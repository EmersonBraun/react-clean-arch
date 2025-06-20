import { createContext, useContext, useEffect } from 'react'

import type { AnalyticsService } from '../../../application/use-cases/GetUserProfile'
import type { ReactNode } from 'react'
import { useContainer } from '../../providers/ContainerProvider'

interface AnalyticsContextType {
  analytics: AnalyticsService
  setUserContext: (userId: string, userProperties?: Record<string, unknown>) => void
  trackEvent: (event: string, properties?: Record<string, unknown>) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

interface AnalyticsProviderProps {
  children: ReactNode
  userId?: string
  userProperties?: Record<string, unknown>
}

export function AnalyticsProvider({ children, userId, userProperties }: AnalyticsProviderProps) {
  const container = useContainer()
  const analytics = container.resolve<AnalyticsService>('AnalyticsService')

  const setUserContext = (userId: string, userProperties?: Record<string, unknown>) => {
    analytics.setUserId(userId)
    if (userProperties) {
      analytics.setGlobalProperties(userProperties)
    }
  }

  const trackEvent = (event: string, properties?: Record<string, unknown>) => {
    analytics.track(event, properties || {})
  }

  // Set up analytics context when component mounts
  useEffect(() => {
    if (userId) {
      setUserContext(userId, userProperties)
      
      // Track page view
      analytics.track('page_view', {
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      })
    }
  }, [userId, userProperties, analytics])

  // Track route changes
  useEffect(() => {
    const handleRouteChange = () => {
      analytics.track('page_view', {
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      })
    }

    // In a real SPA, you would listen to route changes
    // For now, we'll just track on mount
    handleRouteChange()

    return () => {
      // Cleanup if needed
    }
  }, [analytics])

  const value: AnalyticsContextType = {
    analytics,
    setUserContext,
    trackEvent,
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
} 