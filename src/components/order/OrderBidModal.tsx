'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useUIStore } from '@/store/ui-store'
import { useRequireAuth } from '@/lib/auth/client-guard'
import { cn } from '@/lib/utils'

// 报价表单校验 schema
const bidSchema = z.object({
  price: z
    .number({ error: '请输入报价金额' })
    .positive('报价金额需大于 0'),
  delivery_days: z
    .number({ error: '请输入交货天数' })
    .int('交货天数需为整数')
    .min(1, '交货天数至少 1 天'),
  note: z.string().max(500, '备注最多 500 字').optional(),
})

type BidFormValues = z.infer<typeof bidSchema>

export interface OrderBidModalProps {
  orderId: string
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

// 报价弹窗：供应商给订单提交报价
export function OrderBidModal({
  orderId,
  open,
  onClose,
  onSuccess,
}: OrderBidModalProps) {
  const addToast = useUIStore((s) => s.addToast)
  const requireAuth = useRequireAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: { price: undefined, delivery_days: undefined, note: '' },
  })

  // ESC 关闭
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // 关闭时重置表单
  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const onSubmit = async (values: BidFormValues) => {
    // 登录校验：未登录弹 Toast 并跳转登录页
    const ok = requireAuth()
    if (!ok) return

    try {
      const response = await fetch('/api/business/bids', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderId, price: values.price, deliveryDays: values.delivery_days, note: values.note ?? '' }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      addToast({ type: 'success', message: '报价提交成功' })
      onSuccess?.()
      onClose()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '报价提交失败，请稍后重试'
      addToast({ type: 'error', message })
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 遮罩 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* 内容区 */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="我要报价"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl"
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div>
                <h2 className="text-base font-semibold text-ink-primary">
                  我要报价
                </h2>
                <p className="mt-0.5 text-xs text-ink-tertiary">
                  填写报价信息，需求方将收到您的报价
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭"
                className="text-ink-tertiary transition-colors hover:text-ink-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 表单 */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 px-5 py-4"
            >
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="请输入报价金额（元）"
                label="报价金额"
                error={errors.price?.message}
                {...register('price', { valueAsNumber: true })}
              />

              <Input
                type="number"
                min="1"
                step="1"
                placeholder="请输入交货天数"
                label="交货天数"
                hint="预计完成订单所需的天数"
                error={errors.delivery_days?.message}
                {...register('delivery_days', { valueAsNumber: true })}
              />

              <div className="w-full">
                <label
                  htmlFor="bid-note"
                  className="mb-1.5 block text-sm font-medium text-ink-primary"
                >
                  备注说明
                  <span className="ml-1 text-xs font-normal text-ink-tertiary">
                    （选填）
                  </span>
                </label>
                <textarea
                  id="bid-note"
                  rows={3}
                  maxLength={500}
                  placeholder="可填写工艺说明、加急情况等"
                  className={cn(
                    'w-full resize-none rounded-md border bg-white px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary',
                    'transition-all duration-fast ease-out-expo',
                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                    errors.note ? 'border-danger' : 'border-line',
                  )}
                  {...register('note')}
                />
                {errors.note && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.note.message}
                  </p>
                )}
              </div>

              {/* 底部按钮 */}
              <div className="flex justify-end gap-2 border-t border-line pt-3.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  提交报价
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
