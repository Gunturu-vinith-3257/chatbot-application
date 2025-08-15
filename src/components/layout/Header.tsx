'use client'

import { useUserData } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { LogOut, MessageSquare, User } from 'lucide-react'
import { signOut } from '@/lib/auth'

/**
 * Application header with user info and sign-out functionality
 */
export default function Header() {
  const user = useUserData()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/signin')
    // Trigger a page reload to update auth state
    window.location.reload()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-900">AI Chatbot</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{user?.displayName || user?.email}</span>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}