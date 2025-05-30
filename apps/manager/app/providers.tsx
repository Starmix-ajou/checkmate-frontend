'use client'

import SyncAuthState from '@/components/SyncAuthState'
import { AuthProvider } from '@/providers/AuthProvider'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SyncAuthState />
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  )
}
