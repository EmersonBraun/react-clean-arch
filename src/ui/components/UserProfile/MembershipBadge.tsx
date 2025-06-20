import { Crown, User } from 'lucide-react'

interface MembershipBadgeProps {
  membershipType: 'free' | 'premium'
  className?: string
}

export function MembershipBadge({ membershipType, className }: MembershipBadgeProps) {
  const isPremium = membershipType === 'premium'
  
  return (
    <div 
      className={`
        inline-flex items-center space-x-1 px-3 py-1 rounded-full font-medium
        ${isPremium 
          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 border border-gray-200'
        }
        ${className}
      `}
    >
      {isPremium ? (
        <Crown className="w-3 h-3" />
      ) : (
        <User className="w-3 h-3" />
      )}
      <span className="capitalize font-semibold">
        {membershipType}
      </span>
    </div>
  )
} 