// Simple auth utilities for GraphQL-only frontend
export interface User {
  id: string
  email: string
  displayName?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock authentication functions - replace with your actual auth implementation
export const signIn = async (email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  // This is a mock implementation
  // Replace with your actual authentication logic
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful authentication
    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email,
      displayName: email.split('@')[0]
    }
    
    const token = 'mock-jwt-token-' + Date.now()
    
    // Store token in localStorage
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_data', JSON.stringify(user))
    
    return { success: true, user, token }
  } catch (error) {
    return { success: false, error: 'Authentication failed' }
  }
}

export const signUp = async (email: string, password: string, displayName?: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  // This is a mock implementation
  // Replace with your actual registration logic
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful registration
    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email,
      displayName: displayName || email.split('@')[0]
    }
    
    const token = 'mock-jwt-token-' + Date.now()
    
    // Store token in localStorage
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_data', JSON.stringify(user))
    
    return { success: true, user, token }
  } catch (error) {
    return { success: false, error: 'Registration failed' }
  }
}

export const signOut = async (): Promise<void> => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
}

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null
  
  const userData = localStorage.getItem('user_data')
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}