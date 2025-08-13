'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { MessageSquare, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { Chat } from '@/types/chat'
import { DELETE_CHAT, UPDATE_CHAT_TITLE } from '@/lib/graphql/mutations'

interface ChatListProps {
  chats: Chat[]
  selectedChatId?: string
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
}

/**
 * Chat list component displaying all user chats with management options
 */
export default function ChatList({ chats, selectedChatId, onChatSelect, onNewChat }: ChatListProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  
  const [deleteChat] = useMutation(DELETE_CHAT, {
    refetchQueries: ['GetChats'],
  })
  
  const [updateChatTitle] = useMutation(UPDATE_CHAT_TITLE, {
    refetchQueries: ['GetChats'],
  })

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChat({ variables: { chatId } })
      } catch (error) {
        console.error('Error deleting chat:', error)
      }
    }
  }

  const handleEditStart = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingChatId(chat.id)
    setEditTitle(chat.title)
  }

  const handleEditSave = async (chatId: string) => {
    if (editTitle.trim()) {
      try {
        await updateChatTitle({
          variables: { chatId, title: editTitle.trim() }
        })
        setEditingChatId(null)
      } catch (error) {
        console.error('Error updating chat title:', error)
      }
    }
  }

  const handleEditCancel = () => {
    setEditingChatId(null)
    setEditTitle('')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No chats yet</p>
            <p className="text-sm">Start a new conversation!</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChatId === chat.id
                    ? 'bg-indigo-100 border border-indigo-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {editingChatId === chat.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(chat.id)
                            if (e.key === 'Escape') handleEditCancel()
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditSave(chat.id)}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-gray-900 truncate">
                          {chat.title}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {chat.messages_aggregate?.aggregate.count || 0} messages
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(chat.updated_at)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {editingChatId !== chat.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditStart(chat, e)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}