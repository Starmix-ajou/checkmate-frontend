'use client'

import SyncAuthState from '@/components/SyncAuthState'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SyncAuthState />
      {children}
    </SessionProvider>
  )
}
