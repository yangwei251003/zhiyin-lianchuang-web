'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'

// 客户端守卫：校验登录状态，未登录弹 Toast 并跳转登录页
export function useRequireAuth() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isInitialized = useAuthStore((s) => s.isInitialized)
  const addToast = useUIStore((s) => s.addToast)

  return (callback?: () => void): boolean => {
    if (!isInitialized) return false
    if (!user) {
      addToast({ type: 'warning', message: '请先登录后再操作' })
      router.push('/login')
      return false
    }
    callback?.()
    return true
  }
}

// 客户端守卫：校验登录 + 企业认证状态
export function useRequireVerified() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const company = useAuthStore((s) => s.company)
  const isInitialized = useAuthStore((s) => s.isInitialized)
  const addToast = useUIStore((s) => s.addToast)

  return (callback?: () => void): boolean => {
    if (!isInitialized) return false
    if (!user) {
      addToast({ type: 'warning', message: '请先登录后再操作' })
      router.push('/login')
      return false
    }
    if (company?.status !== 'approved') {
      addToast({ type: 'warning', message: '请先完成企业实名认证' })
      router.push('/mine/auth')
      return false
    }
    callback?.()
    return true
  }
}
