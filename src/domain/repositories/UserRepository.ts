import { User } from '../entities/User'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
}

export class UserNotFoundError extends Error {
  public readonly userId: string

  constructor(userId: string) {
    super(`User with ID ${userId} not found`)
    this.name = 'UserNotFoundError'
    this.userId = userId
  }
} 