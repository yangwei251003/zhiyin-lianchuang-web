'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { createClient } from '@/lib/supabase/client'

type Profile = Database['public']['Tables']['profiles']['Row']
type Company = Database['public']['Tables']['companies']['Row']

interface AuthState {
  user: User | null
  profile: Profile | null
  company: Company | null
  isLoading: boolean
  isInitialized: boolean
  pendingEmail: string | null
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (
    email: string,
    password: string,
    nickname?: string
  ) => Promise<{ error: string | null }>
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>
  resendOtp: (email: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  setSession: (user: User | null) => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      company: null,
      isLoading: false,
      isInitialized: false,
      pendingEmail: null,

      signIn: async (email, password) => {
        set({ isLoading: true })
        try {
          const supabase = createClient()
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) {
            set({ isLoading: false })
            return { error: error.message }
          }
          await get().setSession(data.user)
          set({ isLoading: false })
          return { error: null }
        } catch (e) {
          set({ isLoading: false })
          return { error: (e as Error).message }
        }
      },

      signUp: async (email, password, nickname) => {
        set({ isLoading: true })
        try {
          const supabase = createClient()
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { nickname: nickname || email.split('@')[0] },
            },
          })
          if (error) {
            set({ isLoading: false })
            return { error: error.message }
          }
          if (data.user) {
            await get().setSession(data.user)
            // 发送欢迎消息（非阻塞）
            void fetch('/api/messages/welcome', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: data.user.id }),
            }).catch(() => null)
          }
          set({ isLoading: false, pendingEmail: null })
          return { error: null }
        } catch (e) {
          set({ isLoading: false })
          return { error: (e as Error).message }
        }
      },

      verifyOtp: async (email, token) => {
        set({ isLoading: true })
        try {
          const supabase = createClient()
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup',
          })
          if (error) {
            set({ isLoading: false })
            return { error: error.message }
          }
          if (data.user) {
            await get().setSession(data.user)
            // 发送欢迎消息（非阻塞）
            void fetch('/api/messages/welcome', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: data.user.id }),
            }).catch(() => null)
          }
          set({ isLoading: false, pendingEmail: null })
          return { error: null }
        } catch (e) {
          set({ isLoading: false })
          return { error: (e as Error).message }
        }
      },

      resendOtp: async (email) => {
        try {
          const supabase = createClient()
          const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
          })
          if (error) return { error: error.message }
          return { error: null }
        } catch (e) {
          return { error: (e as Error).message }
        }
      },

      signOut: async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        set({ user: null, profile: null, company: null, isLoading: false })
      },

      refreshProfile: async () => {
        const { user } = get()
        if (!user) return
        const supabase = createClient()
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
        set({ profile, company })
      },

      setSession: async (user) => {
        set({ user, isLoading: !!user })
        if (user) {
          await get().refreshProfile()
        }
        set({ isLoading: false })
      },

      initialize: async () => {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          await get().setSession(session.user)
        }
        set({ isInitialized: true })
      },
    }),
    {
      name: 'zl-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        company: state.company,
        pendingEmail: state.pendingEmail,
      }),
    }
  )
)
