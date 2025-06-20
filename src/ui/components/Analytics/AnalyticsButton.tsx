import type { ButtonHTMLAttributes } from 'react'
import { useAnalytics } from './AnalyticsProvider'

interface AnalyticsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  eventName: string
  eventProperties?: Record<string, unknown>
  children: React.ReactNode
}

export function AnalyticsButton({ 
  eventName, 
  eventProperties = {}, 
  children, 
  onClick,
  ...buttonProps 
}: AnalyticsButtonProps) {
  const { trackEvent } = useAnalytics()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Track the button click
    trackEvent(eventName, {
      ...eventProperties,
      buttonText: typeof children === 'string' ? children : 'Unknown',
      timestamp: new Date().toISOString(),
      elementType: 'button'
    })

    // Call the original onClick if provided
    if (onClick) {
      onClick(event)
    }
  }

  return (
    <button onClick={handleClick} {...buttonProps}>
      {children}
    </button>
  )
} 