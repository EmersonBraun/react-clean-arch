import type { AnalyticsService } from '../../application/use-cases/GetUserProfile'

export class ConsoleAnalyticsService implements AnalyticsService {
  private userId?: string
  private globalProperties: Record<string, unknown> = {}

  setUserId(userId: string): void {
    this.userId = userId
    console.log(`[Analytics] User ID set: ${userId}`)
  }

  setGlobalProperties(properties: Record<string, unknown>): void {
    this.globalProperties = { ...this.globalProperties, ...properties }
    console.log(`[Analytics] Global properties updated:`, this.globalProperties)
  }

  track(event: string, properties: Record<string, unknown>): void {
    const enrichedProperties = {
      ...this.globalProperties,
      ...properties,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
    }

    console.log(`[Analytics] ${event}:`, enrichedProperties)
  }

  private getSessionId(): string {
    // In a real implementation, this would be a proper session ID
    return `session_${Date.now()}`
  }
}

export class MixpanelAnalyticsService implements AnalyticsService {
  private userId?: string
  private globalProperties: Record<string, unknown> = {}

  constructor() {}

  setUserId(userId: string): void {
    this.userId = userId
    console.log(`[Mixpanel] User ID set: ${userId}`)
    // In a real implementation: mixpanel.identify(userId)
  }

  setGlobalProperties(properties: Record<string, unknown>): void {
    this.globalProperties = { ...this.globalProperties, ...properties }
    console.log(`[Mixpanel] Global properties updated:`, this.globalProperties)
    // In a real implementation: mixpanel.register(properties)
  }

  track(event: string, properties: Record<string, unknown>): void {
    const enrichedProperties = {
      ...this.globalProperties,
      ...properties,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
    }

    // In a real implementation, you would send to Mixpanel
    console.log(`[Mixpanel] ${event}:`, enrichedProperties)
    
    // Example of real implementation:
    // mixpanel.track(event, enrichedProperties)
  }

  private getSessionId(): string {
    // In a real implementation, this would be a proper session ID
    return `session_${Date.now()}`
  }
}

// Analytics service factory for easy switching between implementations
export class AnalyticsServiceFactory {
  static create(type: 'console' | 'mixpanel' = 'console'): AnalyticsService {
    switch (type) {
      case 'mixpanel':
        return new MixpanelAnalyticsService()
      case 'console':
      default:
        return new ConsoleAnalyticsService()
    }
  }
} 