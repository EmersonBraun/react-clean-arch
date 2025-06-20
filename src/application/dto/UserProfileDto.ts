import { z } from 'zod'

export const UserProfileDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  membershipType: z.enum(['free', 'premium']),
  discountRate: z.number().min(0).max(1),
  availableFeatures: z.array(z.string()),
  statusMessage: z.string(),
  isPremiumEligible: z.boolean(),
  purchaseCount: z.number().min(0),
  totalSpent: z.number().min(0),
  memberSince: z.date(),
})

export type UserProfileDto = z.infer<typeof UserProfileDtoSchema> 