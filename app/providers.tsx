'use client'

import { SessionProvider } from 'next-auth/react'
import SyncAuthState from '@/components/SyncAuthState'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SyncAuthState /> {/* Zustand에 로그인 정보 동기화 */}
      {children}
    </SessionProvider>
  )
}
