'use client'

import { type ReactNode } from 'react'
import { Modal } from '@/components/ui/Modal'

// Modal Provider：在子树末尾挂载 Modal 渲染器
export function ModalProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Modal />
    </>
  )
}
