'use client'

import { type ReactNode } from 'react'
import { Toast } from '@/components/ui/Toast'

// Toast Provider：在子树末尾挂载 Toast 渲染器
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toast />
    </>
  )
}
