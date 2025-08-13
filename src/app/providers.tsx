'use client'

import { NhostProvider } from '@nhost/nextjs'
import { NhostApolloProvider } from '@nhost/react-apollo'
import { nhost } from '@/lib/nhost'

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Root providers component wrapping the app with Nhost and Apollo providers
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        {children}
      </NhostApolloProvider>
    </NhostProvider>
  )
}