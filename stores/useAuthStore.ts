import { create } from 'zustand'

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

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
