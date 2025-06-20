import { useCallback, useState } from 'react'
import { UpgradeMembership, type UpgradeMembershipRequest } from '../../application/use-cases/UpgradeMembership'
import { UserNotFoundError } from '../../domain/repositories/UserRepository'
import { useContainer } from '../providers/ContainerProvider'

interface UseUpgradeMembershipState {
  loading: boolean
  error: string | null
  success: boolean
}

export function useUpgradeMembership() {
  const [state, setState] = useState<UseUpgradeMembershipState>({
    loading: false,
    error: null,
    success: false,
  })

  const container = useContainer()

  const upgradeMembership = useCallback(async (request: UpgradeMembershipRequest): Promise<void> => {
    console.log('useUpgradeMembership: Starting membership upgrade:', request)
    setState(prev => ({ ...prev, loading: true, error: null, success: false }))

    try {
      const upgradeMembershipUseCase = container.resolve<UpgradeMembership>('UpgradeMembership')
      console.log('useUpgradeMembership: UpgradeMembership resolved, executing')
      
      await upgradeMembershipUseCase.execute(request)
      console.log('useUpgradeMembership: Membership upgraded successfully')
      
      setState({
        loading: false,
        error: null,
        success: true,
      })
    } catch (error) {
      console.error('useUpgradeMembership: Error upgrading membership:', error)
      
      let errorMessage = 'An unexpected error occurred during upgrade'
      
      if (error instanceof UserNotFoundError) {
        errorMessage = 'User not found'
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      setState({
        loading: false,
        error: errorMessage,
        success: false,
      })
    }
  }, [container])

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
    })
  }, [])

  return {
    ...state,
    upgradeMembership,
    reset,
  }
} 