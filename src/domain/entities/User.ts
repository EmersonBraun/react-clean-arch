import { z } from 'zod'

// Schema de validação
export const UserSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  membershipType: z.enum(['free', 'premium'], {
    errorMap: () => ({ message: 'Tipo de membership deve ser free ou premium' })
  }),
  purchaseCount: z.number().min(0, 'Número de compras não pode ser negativo').default(0),
  totalSpent: z.number().min(0, 'Total gasto não pode ser negativo').default(0),
  createdAt: z.date().default(() => new Date()),
})

export type UserData = z.infer<typeof UserSchema>

export class User {
  private readonly _id: string
  private readonly _email: string
  private readonly _name: string
  private readonly _membershipType: 'free' | 'premium'
  private readonly _purchaseCount: number
  private readonly _totalSpent: number
  private readonly _createdAt: Date

  constructor(data: UserData) {
    const validatedData = UserSchema.parse(data)
    
    this._id = validatedData.id
    this._email = validatedData.email
    this._name = validatedData.name
    this._membershipType = validatedData.membershipType
    this._purchaseCount = validatedData.purchaseCount
    this._totalSpent = validatedData.totalSpent
    this._createdAt = validatedData.createdAt
  }

  // Getters
  get id(): string { return this._id }
  get email(): string { return this._email }
  get name(): string { return this._name }
  get membershipType(): 'free' | 'premium' { return this._membershipType }
  get purchaseCount(): number { return this._purchaseCount }
  get totalSpent(): number { return this._totalSpent }
  get createdAt(): Date { return this._createdAt }

  getDiscountRate(): number {
    if (this._membershipType === 'premium') {
      // Premium users get base 15% discount
      let discount = 0.15
      
      // Additional discount based on purchase history
      if (this._purchaseCount >= 50) {
        discount += 0.05 // +5% for loyal customers
      }
      
      if (this._totalSpent >= 1000) {
        discount += 0.05 // +5% for high-value customers
      }
      
      return Math.min(discount, 0.30) // Max 30% discount
    }
    
    return 0 // Free users get no discount
  }

  canAccessFeature(feature: string): boolean {
    const premiumFeatures = [
      'advanced-analytics',
      'export-data',
      'priority-support',
      'custom-themes',
      'api-access'
    ]
    
    if (this._membershipType === 'premium') {
      return true // Premium users can access everything
    }
    
    return !premiumFeatures.includes(feature)
  }

  getAvailableFeatures(): string[] {
    const allFeatures = [
      'basic-dashboard',
      'user-profile',
      'basic-reports',
      'advanced-analytics',
      'export-data',
      'priority-support',
      'custom-themes',
      'api-access'
    ]
    
    return allFeatures.filter(feature => this.canAccessFeature(feature))
  }

  isPremiumEligible(): boolean {
    // Business rule: users with 10+ purchases or $500+ spent are eligible for premium
    return this._purchaseCount >= 10 || this._totalSpent >= 500
  }

  getStatusMessage(): string {
    if (this._membershipType === 'premium') {
      return `Premium member since ${this._createdAt.getFullYear()}`
    }
    
    if (this.isPremiumEligible()) {
      return 'Eligible for Premium upgrade!'
    }
    
    const purchasesNeeded = Math.max(0, 10 - this._purchaseCount)
    const spendingNeeded = Math.max(0, 500 - this._totalSpent)
    
    if (purchasesNeeded <= spendingNeeded / 50) {
      return `${purchasesNeeded} more purchases to unlock Premium`
    } else {
      return `$${spendingNeeded.toFixed(2)} more spending to unlock Premium`
    }
  }

  static fromApiData(apiData: any): User {
    return new User({
      id: apiData.id,
      email: apiData.email,
      name: apiData.name || apiData.full_name,
      membershipType: apiData.membership_type || apiData.plan || 'free',
      purchaseCount: apiData.purchase_count || apiData.orders_count || 0,
      totalSpent: apiData.total_spent || apiData.lifetime_value || 0,
      createdAt: apiData.created_at ? new Date(apiData.created_at) : new Date()
    })
  }
} 