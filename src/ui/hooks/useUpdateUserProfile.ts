import { useState } from 'react'
import { UpdateUserProfile, type UpdateUserProfileRequest } from '../../application/use-cases/UpdateUserProfile'
import { UserNotFoundError } from '../../domain/repositories/UserRepository'
import { useContainer } from '../providers/ContainerProvider'

interface UseUpdateUserProfileState {
  loading: boolean
  error: string | null
  success: boolean
}

export function useUpdateUserProfile() {
  const [state, setState] = useState<UseUpdateUserProfileState>({
    loading: false,
    error: null,
    success: false,
  })

  const container = useContainer()

  const updateProfile = async (request: UpdateUserProfileRequest): Promise<void> => {
    console.log('useUpdateUserProfile: Starting profile update:', request)
    setState(prev => ({ ...prev, loading: true, error: null, success: false }))

    try {
      const updateUserProfile = container.resolve<UpdateUserProfile>('UpdateUserProfile')
      console.log('useUpdateUserProfile: UpdateUserProfile resolved, executing')
      
      await updateUserProfile.execute(request)
      console.log('useUpdateUserProfile: Profile updated successfully')
      
      setState({
        loading: false,
        error: null,
        success: true,
      })
    } catch (error) {
      console.error('useUpdateUserProfile: Error updating profile:', error)
      
      let errorMessage = 'An unexpected error occurred'
      
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
  }

  const reset = () => {
    setState({
      loading: false,
      error: null,
      success: false,
    })
  }

  return {
    ...state,
    updateProfile,
    reset,
  }
} 