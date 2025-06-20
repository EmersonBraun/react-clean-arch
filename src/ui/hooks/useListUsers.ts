import { useCallback, useState } from 'react'
import type { UserProfileDto } from '../../application/dto/UserProfileDto'
import { ListUsers, type ListUsersFilters } from '../../application/use-cases/ListUsers'
import { useContainer } from '../providers/ContainerProvider'

interface UseListUsersState {
  users: UserProfileDto[]
  loading: boolean
  error: string | null
}

export function useListUsers() {
  const [state, setState] = useState<UseListUsersState>({
    users: [],
    loading: false,
    error: null,
  })

  const container = useContainer()

  const fetchUsers = useCallback(async (filters?: ListUsersFilters): Promise<void> => {
    console.log('useListUsers: Starting to fetch users with filters:', filters)
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const listUsers = container.resolve<ListUsers>('ListUsers')
      console.log('useListUsers: ListUsers resolved, executing')
      
      const users = await listUsers.execute(filters)
      console.log('useListUsers: Users fetched successfully:', users.length)
      
      setState({
        users,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error('useListUsers: Error fetching users:', error)
      
      let errorMessage = 'An unexpected error occurred while fetching users'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }

      setState({
        users: [],
        loading: false,
        error: errorMessage,
      })
    }
  }, [container])

  const clearUsers = useCallback(() => {
    setState({
      users: [],
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    fetchUsers,
    clearUsers,
  }
} 