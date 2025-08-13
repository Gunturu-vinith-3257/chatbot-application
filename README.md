# AI Chatbot Application

A modern, full-stack chatbot application built with Next.js, Nhost Auth, Hasura GraphQL, and n8n automation. Features real-time messaging, secure authentication, and AI-powered responses via OpenRouter.

## 🚀 Features

- **Authentication**: Email-based sign-up/sign-in with Nhost Auth
- **Real-time Chat**: GraphQL subscriptions for instant message updates
- **AI Responses**: Chatbot powered by OpenRouter API via n8n workflows
- **Secure Architecture**: Row-level security and JWT-based authentication
- **Modern UI**: Responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🏗️ Architecture

### Frontend (Next.js)
- **Authentication**: Nhost Auth with email/password
- **Data Layer**: Apollo Client with GraphQL queries, mutations, and subscriptions
- **UI Components**: Modular React components with Tailwind CSS
- **Real-time Updates**: WebSocket subscriptions for live chat

### Backend (Hasura + n8n)
- **Database**: PostgreSQL with Hasura GraphQL API
- **Permissions**: Row-level security ensuring users only access their data
- **Actions**: Hasura Actions trigger n8n workflows for AI responses
- **Automation**: n8n handles external API calls and business logic

### Security
- **Authentication**: JWT tokens with role-based access control
- **Authorization**: RLS policies restrict data access to owners
- **API Security**: External API keys secured in n8n, never exposed to frontend

## 📋 Prerequisites

- Node.js 18+ and npm
- Nhost account and project
- n8n instance (cloud or self-hosted)
- OpenRouter API key

## 🛠️ Setup Instructions

### 1. Environment Configuration

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Update the following variables:
- `NEXT_PUBLIC_NHOST_SUBDOMAIN`: Your Nhost project subdomain
- `NEXT_PUBLIC_NHOST_REGION`: Your Nhost project region
- `NEXT_PUBLIC_HASURA_GRAPHQL_URL`: Your Hasura GraphQL endpoint
- `NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL`: Your Hasura WebSocket endpoint

### 2. Database Setup

1. **Apply Database Migration**:
   - Copy the SQL from `hasura/migrations/001_create_chats_and_messages.sql`
   - Run it in your Nhost/Hasura SQL console

2. **Configure Permissions**:
   - Apply the permissions from `hasura/metadata/permissions.yaml`
   - Ensure the `user` role has proper access to `chats` and `messages` tables

3. **Setup Hasura Action**:
   - Create the `sendMessage` action using `hasura/metadata/actions.yaml`
   - Configure the webhook URL to point to your n8n instance

### 3. n8n Workflow Setup

1. **Import Workflow**:
   - Import `n8n/chatbot-workflow.json` into your n8n instance
   - Configure environment variables in n8n:
     - `HASURA_GRAPHQL_URL`: Your Hasura endpoint
     - `HASURA_ADMIN_SECRET`: Your Hasura admin secret
     - `OPENROUTER_API_KEY`: Your OpenRouter API key

2. **Activate Webhook**:
   - Activate the workflow to enable the webhook endpoint
   - Update the Hasura Action handler URL to match your n8n webhook

### 4. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Key Components

### Authentication Flow
1. Users sign up/sign in via Nhost Auth
2. JWT tokens are automatically managed by Nhost client
3. Apollo Client includes JWT in all GraphQL requests
4. Hasura validates tokens and applies RLS policies

### Message Flow
1. User types message in chat interface
2. Frontend saves user message via GraphQL mutation
3. Frontend calls Hasura Action `sendMessage`
4. Action triggers n8n workflow with user context
5. n8n validates user owns the chat
6. n8n calls OpenRouter API for AI response
7. n8n saves AI response back to database
8. Frontend receives real-time update via subscription

### Real-time Updates
- GraphQL subscriptions provide live message updates
- WebSocket connection automatically reconnects on auth changes
- Optimistic UI updates for better user experience

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat interface components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── graphql/           # GraphQL queries and mutations
│   ├── apollo.ts          # Apollo Client configuration
│   └── nhost.ts           # Nhost client configuration
└── types/                 # TypeScript type definitions

hasura/
├── migrations/            # Database schema migrations
└── metadata/              # Hasura metadata (permissions, actions)

n8n/
└── chatbot-workflow.json  # n8n workflow definition
```

## 🔒 Security Features

- **Row-Level Security**: Users can only access their own chats and messages
- **JWT Authentication**: Secure token-based authentication
- **API Key Protection**: External API keys never exposed to frontend
- **Input Validation**: Comprehensive validation in n8n workflows
- **CORS Configuration**: Proper CORS setup for secure API access

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository to your deployment platform
2. Set environment variables in deployment settings
3. Deploy with automatic builds on push

### Backend
- **Nhost**: Automatically managed (database, auth, GraphQL)
- **n8n**: Deploy to your preferred platform (cloud or self-hosted)

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
- **Mutations**: `CREATE_CHAT`, `INSERT_MESSAGE`, `SEND_MESSAGE_ACTION`
- **Subscriptions**: `MESSAGES_SUBSCRIPTION`, `CHATS_SUBSCRIPTION`

### Hasura Actions
- **sendMessage**: Triggers n8n workflow for AI responses

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

- [Nhost Documentation](https://docs.nhost.io/)
- [Hasura Documentation](https://hasura.io/docs/)
- [n8n Documentation](https://docs.n8n.io/)
- [OpenRouter API](https://openrouter.ai/docs)