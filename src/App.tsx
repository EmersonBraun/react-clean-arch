import { ContainerProvider } from './ui/providers/ContainerProvider'
import { ErrorBoundary } from './ui/components/ErrorBoundary'
import { UserProfilePage } from './ui/pages/UserProfilePage'

function App() {
  return (
    <ErrorBoundary>
      <ContainerProvider>
        <div className="min-h-screen bg-gray-50 w-full">
          <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              React + Clean Architecture
              <div className="text-sm text-gray-500">
               random users - reload to get new users
              </div>
            </h1>
            <div className="flex flex-row gap-4">
              <UserProfilePage userId="1" />
            </div>
          </div>
        </div>
      </ContainerProvider>
    </ErrorBoundary>
  )
}

export default App
