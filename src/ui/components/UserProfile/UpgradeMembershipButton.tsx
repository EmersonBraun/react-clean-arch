import type { UserProfileDto } from '../../../application/dto/UserProfileDto'
import { useAnalytics } from '../Analytics/AnalyticsProvider'
import { useState } from 'react'
import { useUpgradeMembership } from '../../hooks/useUpgradeMembership'

interface UpgradeMembershipButtonProps {
  user: UserProfileDto
  onSuccess?: () => void
}

export function UpgradeMembershipButton({ user, onSuccess }: UpgradeMembershipButtonProps) {
  const { upgradeMembership, loading, error } = useUpgradeMembership()
  const { trackEvent } = useAnalytics()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleUpgradeClick = () => {
    // Track button click
    trackEvent('upgrade_membership_button_clicked', {
      userId: user.id,
      currentMembership: user.membershipType,
      isEligible: user.isPremiumEligible,
      purchaseCount: user.purchaseCount,
      totalSpent: user.totalSpent,
      location: 'profile_page'
    })

    if (user.membershipType === 'premium') {
      trackEvent('upgrade_membership_already_premium_clicked', {
        userId: user.id,
        location: 'profile_page'
      })
      return
    }

    if (!user.isPremiumEligible) {
      trackEvent('upgrade_membership_not_eligible_clicked', {
        userId: user.id,
        currentMembership: user.membershipType,
        purchaseCount: user.purchaseCount,
        totalSpent: user.totalSpent,
        location: 'profile_page'
      })
      return
    }

    setShowConfirmation(true)
  }

  const handleConfirmUpgrade = async () => {
    try {
      await upgradeMembership({
        userId: user.id,
        targetMembershipType: 'premium'
      })

      // Track successful upgrade from UI
      trackEvent('upgrade_membership_ui_success', {
        userId: user.id,
        previousMembership: user.membershipType,
        newMembership: 'premium',
        location: 'profile_page'
      })

      setShowConfirmation(false)
      onSuccess?.()
    } catch (error) {
      // Track upgrade error from UI
      trackEvent('upgrade_membership_ui_error', {
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        location: 'profile_page'
      })
    }
  }

  const handleCancelUpgrade = () => {
    trackEvent('upgrade_membership_cancelled', {
      userId: user.id,
      location: 'profile_page'
    })
    setShowConfirmation(false)
  }

  if (user.membershipType === 'premium') {
    return (
      <div className="bg-green-50 text-green-700 p-3 rounded-md">
        <p className="font-medium">✓ Premium Member</p>
        <p className="text-sm">You already have premium membership!</p>
      </div>
    )
  }

  if (!user.isPremiumEligible) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-3 rounded-md">
        <p className="font-medium">Upgrade to Premium</p>
        <p className="text-sm">
          You need {10 - user.purchaseCount} more purchases or ${(500 - user.totalSpent).toFixed(2)} more spent to be eligible.
        </p>
      </div>
    )
  }

  if (showConfirmation) {
    return (
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
        <h3 className="font-medium text-blue-900 mb-2">Confirm Premium Upgrade</h3>
        <p className="text-sm text-blue-700 mb-4">
          You're eligible for premium membership! This will give you access to advanced features and better discounts.
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-2 rounded-md text-sm mb-3">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleConfirmUpgrade}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Upgrading...' : 'Confirm Upgrade'}
          </button>
          <button
            onClick={handleCancelUpgrade}
            disabled={loading}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleUpgradeClick}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">⭐</span>
        <div className="text-left">
          <div className="font-semibold">Upgrade to Premium</div>
          <div className="text-sm opacity-90">Unlock advanced features</div>
        </div>
      </div>
    </button>
  )
} 