'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { MessageSquare } from 'lucide-react'

import ChatList from './ChatList'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import LoadingSpinner from '../ui/LoadingSpinner'

import { GET_CHATS, GET_CHAT_WITH_MESSAGES, MESSAGES_SUBSCRIPTION } from '@/lib/graphql/queries'
import { CREATE_CHAT, INSERT_MESSAGE, SEND_MESSAGE_ACTION } from '@/lib/graphql/mutations'
import { Chat, Message, GetChatsData, GetChatWithMessagesData } from '@/types/chat'
import { useUserData } from '@/hooks/useAuth'

/**
 * Main chat interface component managing chat list, messages, and real-time updates
 */
export default function ChatInterface() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [isLoadingResponse, setIsLoadingResponse] = useState(false)
  const user = useUserData()
  const router = useRouter()

  // Query all chats
  const { data: chatsData, loading: chatsLoading } = useQuery<GetChatsData>(GET_CHATS, {
    variables: { user_id: user?.id },
    skip: !user?.id,
  })

  // Query selected chat with messages
  const { data: chatData, loading: chatLoading } = useQuery<GetChatWithMessagesData>(
    GET_CHAT_WITH_MESSAGES,
    {
      variables: { chatId: selectedChatId, user_id: user?.id },
      skip: !selectedChatId || !user?.id,
    }
  )

  // Subscribe to real-time message updates
  const { data: messagesData } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chatId: selectedChatId },
    skip: !selectedChatId,
  })

  // Mutations
  const [createChat] = useMutation(CREATE_CHAT, {
    refetchQueries: ['GetChats'],
  })

  const [insertMessage] = useMutation(INSERT_MESSAGE, {
    refetchQueries: ['GetChatWithMessages'],
  })

  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION)

  // Auto-select first chat if none selected
  useEffect(() => {
    if (chatsData?.chats && chatsData.chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chatsData.chats[0].id)
    }
  }, [chatsData, selectedChatId])

  const handleNewChat = async () => {
    if (!user?.id) return
    
    try {
      const result = await createChat({
        variables: { title: 'New Chat', user_id: user.id }
      })
      
      if (result.data?.insert_chats_one) {
        setSelectedChatId(result.data.insert_chats_one.id)
      }
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId)
  }

  const handleSendMessage = async (content: string) => {
    if (!user?.id) return
    
    if (!selectedChatId) {
      // Create new chat if none selected
      await handleNewChat()
      return
    }

    try {
      setIsLoadingResponse(true)

      // Insert user message first
      await insertMessage({
        variables: {
          chatId: selectedChatId,
          content,
          role: 'user'
        }
      })

      // Call Hasura Action to trigger n8n workflow
      const result = await sendMessageAction({
        variables: {
          chatId: selectedChatId,
          content
        }
      })

      if (!result.data?.sendMessage.success) {
        console.error('Failed to send message:', result.data?.sendMessage.message)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoadingResponse(false)
    }
  }

  // Get current messages (prefer subscription data over query data)
  const currentMessages: Message[] = messagesData?.messages || chatData?.chats_by_pk?.messages || []

  if (chatsLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Chat List Sidebar */}
      <ChatList
        chats={chatsData?.chats || []}
        selectedChatId={selectedChatId || undefined}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatId ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  {chatData?.chats_by_pk?.title || 'Loading...'}
                </h1>
              </div>
            </div>

            {/* Messages */}
            {chatLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <MessageList 
                messages={currentMessages} 
                isLoading={isLoadingResponse}
              />
            )}

            {/* Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              isLoading={isLoadingResponse}
            />
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Welcome to AI Chat</h3>
              <p className="text-sm mb-4">Select a chat from the sidebar or create a new one to get started.</p>
              <button
                onClick={handleNewChat}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}