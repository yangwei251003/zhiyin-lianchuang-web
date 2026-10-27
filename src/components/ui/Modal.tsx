'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useUIStore } from '@/store/ui-store'
import { Button } from './Button'

// Modal 渲染器：消费 ui-store 的 modal，居中弹窗 + 遮罩，ESC/点击遮罩关闭
export function Modal() {
  const modal = useUIStore((s) => s.modal)
  const closeModal = useUIStore((s) => s.closeModal)
  const onConfirm = modal.onConfirm

  useEffect(() => {
    if (!modal.open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal.open, closeModal])

  return (
    <AnimatePresence>
      {modal.open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={modal.title}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl"
          >
            {modal.title && (
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <h2 className="text-base font-semibold text-ink-primary">
                  {modal.title}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="关闭"
                  className="text-ink-tertiary transition-colors hover:text-ink-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="px-5 py-4 text-sm text-ink-secondary">
              {modal.content}
            </div>
            <div className="flex justify-end gap-2 border-t border-line px-5 py-3.5">
              <Button variant="outline" size="sm" onClick={closeModal}>
                取消
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onConfirm?.()
                  closeModal()
                }}
              >
                确认
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
