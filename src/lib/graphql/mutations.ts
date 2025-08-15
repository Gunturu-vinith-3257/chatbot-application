import { gql } from '@apollo/client'

// Mutation to create a new chat
export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!, $user_id: uuid!) {
    insert_chats_one(object: { title: $title, user_id: $user_id }) {
      id
      title
      created_at
      updated_at
    }
  }
`

// Mutation to update chat title
export const UPDATE_CHAT_TITLE = gql`
  mutation UpdateChatTitle($chatId: uuid!, $title: String!) {
    update_chats_by_pk(pk_columns: { id: $chatId }, _set: { title: $title }) {
      id
      title
      updated_at
    }
  }
`

// Mutation to delete a chat
export const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: uuid!) {
    delete_chats_by_pk(id: $chatId) {
      id
    }
  }
`

// Mutation to insert a user message
export const INSERT_MESSAGE = gql`
  mutation InsertMessage($chatId: uuid!, $content: String!, $role: String!) {
    insert_messages_one(object: { 
      chat_id: $chatId, 
      content: $content, 
      role: $role 
    }) {
      id
      content
      role
      created_at
    }
  }
`

// Hasura Action to send message to chatbot
export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($chatId: uuid!, $content: String!) {
    sendMessage(chat_id: $chatId, content: $content) {
      success
      message
      response
    }
  }
`