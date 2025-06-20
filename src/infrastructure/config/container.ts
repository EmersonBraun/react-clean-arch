// Simple DI container implementation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T
type ServiceKey = string | symbol
type ServiceFactory<T> = () => T

export class Container {
  private services = new Map<ServiceKey, ServiceFactory<unknown>>()
  private singletons = new Map<ServiceKey, unknown>()

  register<T>(key: ServiceKey, factory: ServiceFactory<T>, singleton = true): void {
    console.log(`Container: Registering service ${String(key)}`)
    this.services.set(key, factory as ServiceFactory<unknown>)
    if (singleton) {
      // Pre-create singleton
      console.log(`Container: Creating singleton for ${String(key)}`)
      try {
        this.singletons.set(key, factory())
        console.log(`Container: Singleton created for ${String(key)}`)
      } catch (error) {
        console.error(`Container: Error creating singleton for ${String(key)}:`, error)
        throw error
      }
    }
  }

  resolve<T>(key: ServiceKey): T {
    console.log(`Container: Resolving service ${String(key)}`)
    
    if (this.singletons.has(key)) {
      console.log(`Container: Returning singleton for ${String(key)}`)
      return this.singletons.get(key) as T
    }

    const factory = this.services.get(key) as ServiceFactory<T>
    if (!factory) {
      console.error(`Container: Service ${String(key)} not registered`)
      throw new Error(`Service ${String(key)} not registered`)
    }

    try {
      const instance = factory()
      console.log(`Container: Created new instance for ${String(key)}`)
      return instance
    } catch (error) {
      console.error(`Container: Error creating instance for ${String(key)}:`, error)
      throw error
    }
  }

  registerClass<T>(key: ServiceKey, constructor: Constructor<T>, dependencies: ServiceKey[] = []): void {
    console.log(`Container: Registering class ${String(key)} with dependencies:`, dependencies)
    
    this.register(key, () => {
      try {
        const deps = dependencies.map(dep => {
          console.log(`Container: Resolving dependency ${String(dep)} for ${String(key)}`)
          return this.resolve(dep)
        })
        console.log(`Container: Creating instance of ${String(key)}`)
        return new constructor(...deps)
      } catch (error) {
        console.error(`Container: Error creating class ${String(key)}:`, error)
        throw error
      }
    })
  }
}

console.log('Container: Creating container instance')
// Create and configure container
export const container = new Container()

import { ConsoleAnalyticsService } from '../services/AnalyticsService'
// Register services
import { GetUserProfile } from '../../application/use-cases/GetUserProfile'
import { ListUsers } from '../../application/use-cases/ListUsers'
import { MockUserRepository } from '../repositories/MockUserRepository'
import { UpdateUserProfile } from '../../application/use-cases/UpdateUserProfile'
import { UpgradeMembership } from '../../application/use-cases/UpgradeMembership'

// Infrastructure
console.log('Container: Registering infrastructure services')
container.register('UserRepository', () => {
  console.log('Container: Creating MockUserRepository instance')
  return new MockUserRepository()
})
container.register('AnalyticsService', () => {
  console.log('Container: Creating ConsoleAnalyticsService instance')
  return new ConsoleAnalyticsService()
})

// Use Cases
console.log('Container: Registering use cases')
container.registerClass('GetUserProfile', GetUserProfile, ['UserRepository', 'AnalyticsService'])
container.registerClass('UpdateUserProfile', UpdateUserProfile, ['UserRepository', 'AnalyticsService'])
container.registerClass('ListUsers', ListUsers, ['UserRepository', 'AnalyticsService'])
container.registerClass('UpgradeMembership', UpgradeMembership, ['UserRepository', 'AnalyticsService'])

console.log('Container: Initialization complete') 