'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { User } from '@cm/types/user'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createContext, useContext } from 'react'
import { toast } from 'react-toastify'

type AuthContextType = {
  user: User | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user)
  const clearUser = useAuthStore((state) => state.clearUser)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      clearUser()
      toast.success('로그아웃이 완료되었습니다.')
      router.push('/login')
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다.')
      console.error(error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}
