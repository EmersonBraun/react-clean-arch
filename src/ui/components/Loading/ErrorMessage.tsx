import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  retryText?: string
}

export function ErrorMessage({ 
  message, 
  onRetry, 
  retryText = 'Try again' 
}: ErrorMessageProps) {
  return (
    <div className="p-6">
      <div className="flex items-center p-4 mb-4 text-red-800 bg-red-50 rounded-lg">
        <AlertCircle className="h-4 w-4" />
        <span className="ml-2">{message}</span>
      </div>
      
      {onRetry && (
        <div className="flex justify-center">
          <button 
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{retryText}</span>
          </button>
        </div>
      )}
    </div>
  )
} 