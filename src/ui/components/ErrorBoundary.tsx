import type { ErrorInfo, ReactNode } from 'react'

import { Component } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary: Caught error:', error)
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary: Error details:', error)
    console.error('ErrorBoundary: Component stack:', errorInfo.componentStack)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <h2 className="text-red-600 text-xl font-bold mb-4">Something went wrong</h2>
            <div className="bg-red-50 p-4 rounded mb-4">
              <p className="text-red-700 font-mono text-sm whitespace-pre-wrap">
                {this.state.error?.message || 'An unknown error occurred'}
              </p>
            </div>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 