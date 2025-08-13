import { gql } from '@apollo/client'

// Query to get all chats for the current user
export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      messages_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`

// Query to get a specific chat with its messages
export const GET_CHAT_WITH_MESSAGES = gql`
  query GetChatWithMessages($chatId: uuid!) {
    chats_by_pk(id: $chatId) {
      id
      title
      created_at
      updated_at
      messages(order_by: { created_at: asc }) {
        id
        content
        role
        created_at
      }
    }
  }
`

// Subscription to listen for new messages in a chat
export const MESSAGES_SUBSCRIPTION = gql`
  subscription MessagesSubscription($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      role
      created_at
    }
  }
`

// Subscription to listen for chat updates
export const CHATS_SUBSCRIPTION = gql`
  subscription ChatsSubscription {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      messages_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`