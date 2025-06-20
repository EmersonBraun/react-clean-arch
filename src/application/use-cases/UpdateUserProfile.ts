import type { AnalyticsService } from './GetUserProfile'
import { User } from '../../domain/entities/User'
import { UserNotFoundError } from '../../domain/repositories/UserRepository'
import type { UserRepository } from '../../domain/repositories/UserRepository'

export interface UpdateUserProfileRequest {
  userId: string
  name?: string
  email?: string
}

export class UpdateUserProfile {
  private readonly userRepository: UserRepository
  private readonly analyticsService: AnalyticsService

  constructor(
    userRepository: UserRepository,
    analyticsService: AnalyticsService
  ) {
    this.userRepository = userRepository
    this.analyticsService = analyticsService
  }

  async execute(request: UpdateUserProfileRequest): Promise<void> {
    const { userId, name, email } = request

    // Track update attempt
    this.analyticsService.track('user_profile_update_attempt', {
      userId,
      fieldsToUpdate: {
        name: !!name,
        email: !!email
      }
    })

    if (!userId) {
      this.analyticsService.track('user_profile_update_invalid_id', { userId, reason: 'missing_user_id' })
      throw new Error('User ID is required')
    }

    const existingUser = await this.userRepository.findById(userId)
    
    if (!existingUser) {
      this.analyticsService.track('user_profile_update_not_found', { userId })
      throw new UserNotFoundError(userId)
    }

    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(email)
      if (userWithEmail && userWithEmail.id !== userId) {
        this.analyticsService.track('user_profile_update_email_conflict', {
          userId,
          requestedEmail: email,
          existingUserWithEmail: userWithEmail.id
        })
        throw new Error('Email is already taken')
      }
    }

    // Track what fields are actually changing
    const changedFields = {
      name: name !== undefined && name !== existingUser.name,
      email: email !== undefined && email !== existingUser.email,
    }

    // Create updated user
    const updatedUser = new User({
      id: existingUser.id,
      name: name || existingUser.name,
      email: email || existingUser.email,
      membershipType: existingUser.membershipType,
      purchaseCount: existingUser.purchaseCount,
      totalSpent: existingUser.totalSpent,
      createdAt: existingUser.createdAt,
    })

    await this.userRepository.save(updatedUser)

    // Track successful update with detailed analytics
    this.analyticsService.track('user_profile_updated', {
      userId,
      changedFields,
      previousValues: {
        name: existingUser.name,
        email: existingUser.email
      },
      newValues: {
        name: updatedUser.name,
        email: updatedUser.email
      },
      membershipType: updatedUser.membershipType,
      updateTimestamp: new Date().toISOString()
    })

    // Track specific field updates
    if (changedFields.name) {
      this.analyticsService.track('user_name_updated', {
        userId,
        previousName: existingUser.name,
        newName: updatedUser.name
      })
    }

    if (changedFields.email) {
      this.analyticsService.track('user_email_updated', {
        userId,
        previousEmail: existingUser.email,
        newEmail: updatedUser.email
      })
    }
  }
} 