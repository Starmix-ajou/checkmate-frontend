import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  name: string
  email: string
  image: string
  accessToken: string
}

type AuthStore = {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
