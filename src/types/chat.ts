// TypeScript types for chat application

export interface User {
  id: string
  email: string
  displayName?: string
}

export interface Chat {
  id: string
  title: string
  user_id: string
  created_at: string
  updated_at: string
  messages?: Message[]
  messages_aggregate?: {
    aggregate: {
      count: number
    }
  }
}

export interface Message {
  id: string
  chat_id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
}

export interface SendMessageResponse {
  success: boolean
  message?: string
  response?: string
}

// GraphQL operation result types
export interface GetChatsData {
  chats: Chat[]
}

export interface GetChatWithMessagesData {
  chats_by_pk: Chat | null
}

export interface CreateChatData {
  insert_chats_one: Chat
}

export interface InsertMessageData {
  insert_messages_one: Message
}

export interface SendMessageActionData {
  sendMessage: SendMessageResponse
}

// Component props types
export interface ChatListProps {
  chats: Chat[]
  selectedChatId?: string
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
}

export interface MessageListProps {
  messages: Message[]
  isLoading?: boolean
}

export interface MessageInputProps {
  onSendMessage: (content: string) => void
  isLoading?: boolean
}