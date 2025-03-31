'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAuthStore } from '@/stores/useAuthStore'

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
      })
    } else {
      clearUser()
    }
  }, [session, setUser, clearUser])

  return null
}
