'use client'

import { create } from 'zustand'
import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ModalState {
  open: boolean
  title?: string
  content?: ReactNode
  onConfirm?: () => void
}

interface UIState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id' | 'type'> & { type: ToastType }) => void
  removeToast: (id: string) => void
  modal: ModalState
  openModal: (modal: Omit<ModalState, 'open'>) => void
  closeModal: () => void
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
  unreadCount: number
  setUnreadCount: (count: number) => void
  refreshUnreadCount: (userId: string) => Promise<void>
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2)
    set({ toasts: [...get().toasts, { ...toast, id }] })
    if (toast.duration !== 0) {
      setTimeout(() => get().removeToast(id), toast.duration || 3000)
    }
  },
  removeToast: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  modal: { open: false },
  openModal: (modal) => set({ modal: { ...modal, open: true } }),
  closeModal: () => set({ modal: { open: false } }),
  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  refreshUnreadCount: async (userId) => {
    try {
      const supabase = createClient()
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)
      set({ unreadCount: count ?? 0 })
    } catch {
      // 静默失败：未读计数不影响主流程
    }
  },
}))
