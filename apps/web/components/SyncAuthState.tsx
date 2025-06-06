'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function SyncAuthState() {
  const { data: session } = useSession()
  const setUser = useAuthStore((state) => state.setUser)
  const clearUser = useAuthStore((state) => state.clearUser)

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        image: session.user.image ?? '',
        accessToken: session.accessToken ?? '',
      })
    } else {
      clearUser()
    }
  }, [session, setUser, clearUser])

  return null
}
