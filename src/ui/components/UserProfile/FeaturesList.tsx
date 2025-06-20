import { Check } from 'lucide-react'

interface FeaturesListProps {
  features: string[]
  membershipType: 'free' | 'premium'
}

export function FeaturesList({ features }: FeaturesListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Available Features</h3>
      <div className="space-y-2">
        {features.map((feature) => (
          <div key={feature} className="flex items-center space-x-3">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-gray-700 capitalize">
              {feature.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 