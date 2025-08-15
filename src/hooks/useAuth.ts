'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User, AuthState, getCurrentUser, isAuthenticated as checkAuth } from '@/lib/auth'

const AuthContext = createContext<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
})

export const useAuth = () => {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const checkAuthStatus = () => {
      const user = getCurrentUser()
      const authenticated = checkAuth()
      
      setAuthState({
        user,
        isAuthenticated: authenticated,
        isLoading: false,
      })
    }

    checkAuthStatus()

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hooks for specific auth operations
export const useAuthenticationStatus = () => {
  const { isAuthenticated, isLoading } = useAuth()
  return { isAuthenticated, isLoading }
}

export const useUserData = () => {
  const { user } = useAuth()
  return user
}