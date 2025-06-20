import { Container, container } from '../../infrastructure/config/container'
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'

import type { ReactNode } from 'react'

const ContainerContext = createContext<Container | null>(null)

interface ContainerProviderProps {
  children: ReactNode
}

export function ContainerProvider({ children }: ContainerProviderProps) {
  console.log('ContainerProvider: Initializing with container:', container)
  
  if (!container) {
    console.error('ContainerProvider: Container is not initialized')
    throw new Error('Container is not initialized')
  }

  return (
    <ContainerContext.Provider value={container}>
      {children}
    </ContainerContext.Provider>
  )
}

export function useContainer(): Container {
  const context = useContext(ContainerContext)
  
  if (!context) {
    console.error('useContainer: Container context is not available')
    throw new Error('useContainer must be used within a ContainerProvider')
  }
  
  return context
} 