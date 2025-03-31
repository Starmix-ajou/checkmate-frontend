'use client'

import { SessionProvider } from 'next-auth/react'
import SyncAuthState from '@/components/SyncAuthState'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SyncAuthState />
      {children}
    </SessionProvider>
  )
}
