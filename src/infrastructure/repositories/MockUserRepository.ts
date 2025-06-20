import { User } from '../../domain/entities/User'
import type { UserRepository } from '../../domain/repositories/UserRepository'
import { faker } from '@faker-js/faker'

export class MockUserRepository implements UserRepository {
  private users: Map<string, User> = new Map()

  constructor() {
    // Seed with sample data
    this.seedData()
  }

  private seedData() {
    // Generate 10 random users
    for (let i = 1; i <= 10; i++) {
      const user = new User({
        id: i.toString(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        membershipType: faker.helpers.arrayElement(['free', 'premium']),
        purchaseCount: faker.number.int({ min: 0, max: 100 }),
        totalSpent: parseFloat(faker.finance.amount({ min: 0, max: 5000, dec: 2 })),
        createdAt: faker.date.past({ years: 2 }),
      })
      this.users.set(user.id, user)
    }
  }

  async findById(id: string): Promise<User | null> {
    // Simulate API delay
    await this.delay(300)
    return this.users.get(id) || null
  }

  async save(user: User): Promise<void> {
    await this.delay(200)
    this.users.set(user.id, user)
  }

  async findByEmail(email: string): Promise<User | null> {
    await this.delay(250)
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  async findAll(): Promise<User[]> {
    await this.delay(400)
    return Array.from(this.users.values())
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
} 