'use client'

import { useEffect, useRef } from 'react'
import { Bot, User } from 'lucide-react'
import { Message } from '@/types/chat'
import LoadingSpinner from '../ui/LoadingSpinner'

interface MessageListProps {
  messages: Message[]
  isLoading?: boolean
}

/**
 * Message list component displaying chat messages with auto-scroll
 */
export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
          <p className="text-sm">Send a message to begin chatting with the AI assistant.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-3 ${
            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {message.role === 'user' ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>

          {/* Message Content */}
          <div
            className={`flex-1 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatTime(message.created_at)}
            </p>
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="inline-block px-4 py-2 rounded-lg bg-gray-100">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  )
}