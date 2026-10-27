'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { Skeleton } from '@/components/ui/Skeleton'

interface AuthGuardProps {
  children: ReactNode
  requireVerified?: boolean
}

// 客户端认证守卫组件：包裹需登录页面，未初始化/未登录时显示骨架屏并跳转
export function AuthGuard({ children, requireVerified = false }: AuthGuardProps) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const company = useAuthStore((s) => s.company)
  const isInitialized = useAuthStore((s) => s.isInitialized)
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    if (!isInitialized) {
      void initialize()
    }
  }, [isInitialized, initialize])

  useEffect(() => {
    if (!isInitialized) return
    if (!user) {
      router.replace('/login')
      return
    }
    if (requireVerified && company?.status !== 'approved') {
      router.replace('/mine/auth')
    }
  }, [isInitialized, user, company, requireVerified, router])

  if (!isInitialized || !user) {
    return <Skeleton className="h-screen w-full" />
  }

  return <>{children}</>
}
