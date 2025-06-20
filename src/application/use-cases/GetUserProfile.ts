import { UserNotFoundError } from '../../domain/repositories/UserRepository'
import type { UserProfileDto } from '../dto/UserProfileDto'
import type { UserRepository } from '../../domain/repositories/UserRepository'

export interface AnalyticsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  track(event: string, properties: Record<string, any>): void
  setUserId(userId: string): void
  setGlobalProperties(properties: Record<string, unknown>): void
}

export class GetUserProfile {
  private readonly userRepository: UserRepository
  private readonly analyticsService: AnalyticsService

  constructor(
    userRepository: UserRepository,
    analyticsService: AnalyticsService
  ) {
    this.userRepository = userRepository
    this.analyticsService = analyticsService
  }

  async execute(userId: string): Promise<UserProfileDto> {
    // Track profile access attempt
    this.analyticsService.track('user_profile_access_attempt', { userId })

    if (!userId || userId.trim() === '') {
      this.analyticsService.track('user_profile_invalid_id', { userId, reason: 'empty_or_invalid' })
      throw new Error('User ID is required')
    }

    const user = await this.userRepository.findById(userId)
    
    if (!user) {
      this.analyticsService.track('user_profile_not_found', { userId })
      throw new UserNotFoundError(userId)
    }

    // Track successful profile view with detailed analytics
    this.analyticsService.track('user_profile_viewed', {
      userId: user.id,
      membershipType: user.membershipType,
      discountRate: user.getDiscountRate(),
      purchaseCount: user.purchaseCount,
      totalSpent: user.totalSpent,
      isPremiumEligible: user.isPremiumEligible(),
      availableFeaturesCount: user.getAvailableFeatures().length,
      memberSince: user.createdAt.toISOString()
    })

    // Track premium eligibility status
    if (user.isPremiumEligible()) {
      this.analyticsService.track('user_premium_eligible_viewed', {
        userId: user.id,
        purchaseCount: user.purchaseCount,
        totalSpent: user.totalSpent,
        currentMembership: user.membershipType
      })
    }

    // Transform domain entity to DTO
    const profile: UserProfileDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      membershipType: user.membershipType,
      discountRate: user.getDiscountRate(),
      availableFeatures: user.getAvailableFeatures(),
      statusMessage: user.getStatusMessage(),
      isPremiumEligible: user.isPremiumEligible(),
      purchaseCount: user.purchaseCount,
      totalSpent: user.totalSpent,
      memberSince: user.createdAt,
    }

    return profile
  }
} 