import { useCallback, useEffect, useState } from 'react'

import { GetUserProfile } from '../../application/use-cases/GetUserProfile'
import { UserNotFoundError } from '../../domain/repositories/UserRepository'
import type { UserProfileDto } from '../../application/dto/UserProfileDto'
import { useContainer } from '../providers/ContainerProvider'

interface UseUserProfileState {
  profile: UserProfileDto | null
  loading: boolean
  error: string | null
}

export function useUserProfile(userId: string) {
  console.log('useUserProfile: Hook called with userId:', userId)
  
  const [state, setState] = useState<UseUserProfileState>({
    profile: null,
    loading: false,
    error: null,
  })

  const container = useContainer()
  console.log('useUserProfile: Container resolved')

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      console.log('useUserProfile: No userId provided')
      setState(prev => ({ ...prev, profile: null, error: null }))
      return
    }

    console.log('useUserProfile: Starting to fetch profile')
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      console.log('useUserProfile: Resolving GetUserProfile use case')
      const getUserProfile = container.resolve<GetUserProfile>('GetUserProfile')
      console.log('useUserProfile: GetUserProfile resolved, executing')
      
      const profile = await getUserProfile.execute(userId)
      console.log('useUserProfile: Profile fetched successfully:', profile)
      
      setState({
        profile,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error('useUserProfile: Error fetching profile:', error)
      
      let errorMessage = 'An unexpected error occurred'
      
      if (error instanceof UserNotFoundError) {
        errorMessage = `User not found`
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      setState({
        profile: null,
        loading: false,
        error: errorMessage,
      })
    }
  }, [userId, container])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    ...state,
    refetch: fetchProfile,
  }
} 