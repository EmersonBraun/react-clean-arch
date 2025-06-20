import type { AnalyticsService } from './GetUserProfile'
import { User } from '../../domain/entities/User'
import { UserNotFoundError } from '../../domain/repositories/UserRepository'
import type { UserRepository } from '../../domain/repositories/UserRepository'

export interface UpgradeMembershipRequest {
  userId: string
  targetMembershipType: 'premium'
}

export class UpgradeMembership {
  private readonly userRepository: UserRepository
  private readonly analyticsService: AnalyticsService

  constructor(
    userRepository: UserRepository,
    analyticsService: AnalyticsService
  ) {
    this.userRepository = userRepository
    this.analyticsService = analyticsService
  }

  async execute(request: UpgradeMembershipRequest): Promise<void> {
    const { userId, targetMembershipType } = request

    // Track upgrade attempt
    this.analyticsService.track('membership_upgrade_attempt', {
      userId,
      targetMembershipType,
      timestamp: new Date().toISOString()
    })

    if (!userId) {
      this.analyticsService.track('membership_upgrade_invalid_id', { userId, reason: 'missing_user_id' })
      throw new Error('User ID is required')
    }

    if (targetMembershipType !== 'premium') {
      this.analyticsService.track('membership_upgrade_invalid_type', {
        userId,
        targetMembershipType,
        reason: 'only_premium_supported'
      })
      throw new Error('Only premium membership is supported for upgrades')
    }

    const existingUser = await this.userRepository.findById(userId)
    
    if (!existingUser) {
      this.analyticsService.track('membership_upgrade_user_not_found', { userId })
      throw new UserNotFoundError(userId)
    }

    // Check if user is already premium
    if (existingUser.membershipType === 'premium') {
      this.analyticsService.track('membership_upgrade_already_premium', {
        userId,
        currentMembership: existingUser.membershipType,
        purchaseCount: existingUser.purchaseCount,
        totalSpent: existingUser.totalSpent
      })
      throw new Error('User is already a premium member')
    }

    // Check eligibility
    const isEligible = existingUser.isPremiumEligible()
    
    if (!isEligible) {
      this.analyticsService.track('membership_upgrade_not_eligible', {
        userId,
        currentMembership: existingUser.membershipType,
        purchaseCount: existingUser.purchaseCount,
        totalSpent: existingUser.totalSpent,
        requiredPurchases: 10,
        requiredSpent: 500
      })
      throw new Error('User is not eligible for premium membership. Requires 10+ purchases or $500+ spent.')
    }

    // Track eligibility confirmation
    this.analyticsService.track('membership_upgrade_eligible_confirmed', {
      userId,
      currentMembership: existingUser.membershipType,
      purchaseCount: existingUser.purchaseCount,
      totalSpent: existingUser.totalSpent,
      eligibilityReason: existingUser.purchaseCount >= 10 ? 'purchase_count' : 'total_spent'
    })

    // Create upgraded user
    const upgradedUser = new User({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      membershipType: targetMembershipType,
      purchaseCount: existingUser.purchaseCount,
      totalSpent: existingUser.totalSpent,
      createdAt: existingUser.createdAt,
    })

    await this.userRepository.save(upgradedUser)

    // Track successful upgrade
    this.analyticsService.track('membership_upgrade_successful', {
      userId,
      previousMembership: existingUser.membershipType,
      newMembership: upgradedUser.membershipType,
      purchaseCount: upgradedUser.purchaseCount,
      totalSpent: upgradedUser.totalSpent,
      upgradeTimestamp: new Date().toISOString(),
      availableFeaturesCount: upgradedUser.getAvailableFeatures().length,
      discountRate: upgradedUser.getDiscountRate()
    })

    // Track business metrics
    this.analyticsService.track('premium_conversion', {
      userId,
      conversionSource: 'manual_upgrade',
      timeToConversion: Math.floor((Date.now() - existingUser.createdAt.getTime()) / (1000 * 60 * 60 * 24)), // days
      purchaseCount: upgradedUser.purchaseCount,
      totalSpent: upgradedUser.totalSpent
    })
  }
} 