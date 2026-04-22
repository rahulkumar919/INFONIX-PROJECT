import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: any | null
  token: string | null
  login: (user: any, token: string) => void
  logout: () => void
  setToken: (token: string | null) => void
  updateUser: (user: any) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => {
        // Store token in cookie as well
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
        set({ user, token })
      },
      logout: () => {
        // Clear cookie
        document.cookie = 'token=; path=/; max-age=0'
        set({ user: null, token: null })
      },
      setToken: (token) => set({ token }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
