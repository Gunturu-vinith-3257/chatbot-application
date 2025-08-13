import { NhostClient } from '@nhost/nextjs'

// Initialize Nhost client with configuration
export const nhost = new NhostClient({
  subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN!,
  region: process.env.NEXT_PUBLIC_NHOST_REGION!,
})