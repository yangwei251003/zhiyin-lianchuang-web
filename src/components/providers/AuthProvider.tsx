'use client'

import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from '@/store/auth-store'

// 认证 Provider：挂载时初始化 auth-store，恢复会话与档案
export function AuthProvider({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  useEffect(() => {
    if (!isInitialized) {
      void initialize()
    }
  }, [isInitialized, initialize])

  return <>{children}</>
}
