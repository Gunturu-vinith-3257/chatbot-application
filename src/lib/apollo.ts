import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { nhost } from './nhost'

// HTTP link for queries and mutations
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
})

// WebSocket link for subscriptions
const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(
  createClient({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL!,
    connectionParams: () => {
      const token = nhost.auth.getAccessToken()
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    },
  })
) : null

// Auth link to add JWT token to requests
const authLink = setContext((_, { headers }) => {
  const token = nhost.auth.getAccessToken()
  
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// Split link to route queries/mutations to HTTP and subscriptions to WebSocket
const splitLink = typeof window !== 'undefined' && wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      authLink.concat(httpLink)
    )
  : authLink.concat(httpLink)

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})