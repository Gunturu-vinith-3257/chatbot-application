'use client'

import { useAuthenticationStatus } from '@nhost/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * AuthGuard component that protects routes requiring authentication
 * Redirects unauthenticated users to the sign-in page
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}