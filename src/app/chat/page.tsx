import AuthGuard from '@/components/auth/AuthGuard'
import Header from '@/components/layout/Header'
import ChatInterface from '@/components/chat/ChatInterface'

/**
 * Main chat page with authentication protection
 */
export default function ChatPage() {
  return (
    <AuthGuard>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1">
          <ChatInterface />
        </div>
      </div>
    </AuthGuard>
  )
}