# GraphQL-Only AI Chatbot Frontend

A modern, GraphQL-only frontend chatbot application built with Next.js, Apollo Client, and Hasura GraphQL. Features real-time messaging, simple authentication, and AI-powered responses.

## 🚀 Features

- **Pure GraphQL**: Direct GraphQL queries, mutations, and subscriptions
- **Real-time Chat**: GraphQL subscriptions for instant message updates
- **Simple Authentication**: Mock authentication system (easily replaceable)
- **AI Responses**: Chatbot powered by external APIs via Hasura Actions
- **Modern UI**: Responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🏗️ Architecture

### Frontend (Next.js + Apollo Client)
- **Data Layer**: Apollo Client with GraphQL queries, mutations, and subscriptions
- **Authentication**: Simple mock auth system (replace with your preferred solution)
- **UI Components**: Modular React components with Tailwind CSS
- **Real-time Updates**: WebSocket subscriptions for live chat

### Backend (Hasura + External Services)
- **Database**: PostgreSQL with Hasura GraphQL API
- **Permissions**: Row-level security ensuring users only access their data
- **Actions**: Hasura Actions trigger external workflows for AI responses
- **Automation**: External services handle AI API calls and business logic

### Security
- **Authentication**: JWT tokens with role-based access control
- **Authorization**: RLS policies restrict data access to owners
- **API Security**: External API keys secured in backend services

## 📋 Prerequisites

- Node.js 18+ and npm
- Hasura GraphQL Engine
- PostgreSQL database
- External AI service (OpenRouter, OpenAI, etc.)

## 🛠️ Setup Instructions

### 1. Environment Configuration

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Update the following variables:
- `NEXT_PUBLIC_HASURA_GRAPHQL_URL`: Your Hasura GraphQL endpoint
- `NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL`: Your Hasura WebSocket endpoint

### 2. Database Setup

1. **Apply Database Migration**:
   - Use the provided Supabase migration or adapt it for your Hasura setup
   - Ensure proper RLS policies are in place

2. **Configure Permissions**:
   - Set up proper permissions for the `user` role
   - Ensure users can only access their own chats and messages

3. **Setup Hasura Actions**:
   - Create the `sendMessage` action
   - Configure the webhook URL to point to your AI service

### 3. Authentication Setup

The current implementation uses a mock authentication system. To integrate with a real auth provider:

1. **Replace Mock Auth**:
   - Update `src/lib/auth.ts` with your authentication logic
   - Modify the auth hooks in `src/hooks/useAuth.ts`
   - Update token management in Apollo Client configuration

2. **Popular Auth Options**:
   - Auth0
   - Firebase Auth
   - AWS Cognito
   - Supabase Auth
   - Custom JWT implementation

### 4. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Key Components

### GraphQL Operations
- **Queries**: Fetch chats and messages with proper user filtering
- **Mutations**: Create, update, delete chats and messages
- **Subscriptions**: Real-time updates for messages and chats
- **Actions**: Trigger external AI services

### Authentication Flow
1. Users sign in via the mock auth system (replace with real auth)
2. JWT tokens are stored in localStorage
3. Apollo Client includes JWT in all GraphQL requests
4. Hasura validates tokens and applies RLS policies

### Message Flow
1. User types message in chat interface
2. Frontend saves user message via GraphQL mutation
3. Frontend calls Hasura Action `sendMessage`
4. Action triggers external AI service
5. AI service validates user permissions
6. AI service calls external API for AI response
7. AI service saves response back to database
8. Frontend receives real-time update via subscription

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat interface components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── hooks/
│   └── useAuth.ts         # Authentication hooks
├── lib/
│   ├── graphql/           # GraphQL queries and mutations
│   ├── apollo.ts          # Apollo Client configuration
│   └── auth.ts            # Authentication utilities
└── types/                 # TypeScript type definitions
```

## 🔒 Security Features

- **Row-Level Security**: Users can only access their own chats and messages
- **JWT Authentication**: Token-based authentication
- **Input Validation**: Comprehensive validation in backend services
- **CORS Configuration**: Proper CORS setup for secure API access

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository to your deployment platform
2. Set environment variables in deployment settings
3. Deploy with automatic builds on push

### Backend
- **Hasura**: Deploy to Hasura Cloud or self-hosted
- **Database**: PostgreSQL on your preferred platform
- **AI Service**: Deploy your AI service handler

## 🧪 Development

### Running Tests
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 📚 API Documentation

### GraphQL Schema
- **Queries**: `GET_CHATS`, `GET_CHAT_WITH_MESSAGES`
- **Mutations**: `CREATE_CHAT`, `INSERT_MESSAGE`, `UPDATE_CHAT_TITLE`, `DELETE_CHAT`
- **Subscriptions**: `MESSAGES_SUBSCRIPTION`, `CHATS_SUBSCRIPTION`
- **Actions**: `sendMessage`

### Authentication
Replace the mock authentication in `src/lib/auth.ts` with your preferred solution:

```typescript
// Example with real auth service
export const signIn = async (email: string, password: string) => {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  const data = await response.json()
  
  if (data.success) {
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('user_data', JSON.stringify(data.user))
  }
  
  return data
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔗 Links

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Hasura Documentation](https://hasura.io/docs/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Next.js Documentation](https://nextjs.org/docs)