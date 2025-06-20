import type { AnalyticsService } from './GetUserProfile'
import type { UserProfileDto } from '../dto/UserProfileDto'
import type { UserRepository } from '../../domain/repositories/UserRepository'

export interface ListUsersFilters {
  membershipType?: 'free' | 'premium'
  minPurchaseCount?: number
  minTotalSpent?: number
}

export class ListUsers {
  private readonly userRepository: UserRepository
  private readonly analyticsService: AnalyticsService

  constructor(
    userRepository: UserRepository,
    analyticsService: AnalyticsService
  ) {
    this.userRepository = userRepository
    this.analyticsService = analyticsService
  }

  async execute(filters?: ListUsersFilters): Promise<UserProfileDto[]> {
    // Track list attempt
    this.analyticsService.track('users_list_attempt', {
      filters: filters || {},
      hasFilters: !!filters
    })

    try {
      const allUsers = await this.userRepository.findAll()

      // Track successful fetch
      this.analyticsService.track('users_list_fetched', {
        totalUsers: allUsers.length,
        filters: filters || {}
      })

      // Apply filters if provided
      let filteredUsers = allUsers
      if (filters) {
        filteredUsers = allUsers.filter(user => {
          if (filters.membershipType && user.membershipType !== filters.membershipType) {
            return false
          }
          if (filters.minPurchaseCount && user.purchaseCount < filters.minPurchaseCount) {
            return false
          }
          if (filters.minTotalSpent && user.totalSpent < filters.minTotalSpent) {
            return false
          }
          return true
        })

        // Track filter results
        this.analyticsService.track('users_list_filtered', {
          originalCount: allUsers.length,
          filteredCount: filteredUsers.length,
          filters: filters,
          filterEfficiency: ((allUsers.length - filteredUsers.length) / allUsers.length * 100).toFixed(2)
        })
      }

      // Transform to DTOs
      const userDtos: UserProfileDto[] = filteredUsers.map(user => ({
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
      }))

      // Track successful completion
      this.analyticsService.track('users_list_completed', {
        totalUsers: allUsers.length,
        returnedUsers: userDtos.length,
        premiumUsers: userDtos.filter(u => u.membershipType === 'premium').length,
        freeUsers: userDtos.filter(u => u.membershipType === 'free').length,
        eligibleForPremium: userDtos.filter(u => u.isPremiumEligible).length
      })

      return userDtos
    } catch (error) {
      // Track error
      this.analyticsService.track('users_list_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        filters: filters || {}
      })
      throw error
    }
  }
} 