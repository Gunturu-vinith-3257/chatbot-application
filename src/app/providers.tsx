'use client'

import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/lib/apollo'
import { AuthProvider } from '@/hooks/useAuth'

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Root providers component wrapping the app with Apollo and Auth providers
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </AuthProvider>
  )
}