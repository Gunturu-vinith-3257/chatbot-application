'use client'

import { useAuthenticationStatus } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

/**
 * Root page component that redirects based on authentication status
 */
export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/chat')
      } else {
        router.push('/auth/signin')
      }
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}