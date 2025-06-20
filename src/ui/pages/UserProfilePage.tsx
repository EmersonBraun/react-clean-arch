import { EditProfileForm } from '../components/UserProfile/EditProfileForm'
import { ErrorMessage } from '../components/Loading/ErrorMessage'
import { FeaturesList } from '../components/UserProfile/FeaturesList'
import { LoadingSpinner } from '../components/Loading/LoadingSpinner'
import { MembershipBadge } from '../components/UserProfile/MembershipBadge'
import { useUserProfile } from '../hooks/useUserProfile'

export function UserProfilePage({ userId }: { userId: string }) {

  const { profile, loading, error, refetch } = useUserProfile(userId)

  const handleProfileUpdateSuccess = () => {
    refetch()
  }

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!profile) {
    return <ErrorMessage message="No profile data available" />
  }
  return (
    <div className="container mx-auto p-6 gap-4 flex flex-row">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-blue-100">{profile.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <MembershipBadge membershipType={profile.membershipType} />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold">${profile.totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Purchases</p>
              <p className="text-2xl font-bold">{profile.purchaseCount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Discount Rate</p>
              <p className="text-2xl font-bold">{(profile.discountRate * 100).toFixed(0)}%</p>
            </div>
          </div>

          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
            <p className="font-medium">{profile.statusMessage}</p>
          </div>

          <FeaturesList
            features={profile.availableFeatures}
            membershipType={profile.membershipType}
          />
        </div>
      </div>
      <EditProfileForm 
        profile={profile} 
        onSuccess={handleProfileUpdateSuccess}
      />
    </div>
  )
} 