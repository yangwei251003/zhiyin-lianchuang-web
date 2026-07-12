'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ClipboardList, Lock, Minus, Plus } from 'lucide-react'
import type { Database } from '@/types/database'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import { useRequireAuth } from '@/lib/auth/client-guard'
import {
  PURCHASE_ORDER_STATUS_LABEL,
  PURCHASE_ORDER_STATUS_VARIANT,
} from '@/lib/purchase-config'
import { sendMessage, purchaseJoinedMessage } from '@/lib/messages'
import { cn } from '@/lib/utils'

type PurchaseRow = Database['public']['Tables']['purchases']['Row']
type PurchaseOrderRow = Database['public']['Tables']['purchase_orders']['Row']

export interface JoinPurchaseFormProps {
  purchase: PurchaseRow
  myOrder: PurchaseOrderRow | null
}

const intentSchema = z.object({
  quantity: z
    .number({ error: '请输入预计采购数量' })
    .int('数量需为整数')
    .min(1, '数量至少为 1'),
})

type IntentFormValues = z.infer<typeof intentSchema>

// 复用既有 purchase_orders 存储意向；total_price 固定为 0，明确表示没有发生支付或报价。
export function JoinPurchaseForm({ purchase, myOrder }: JoinPurchaseFormProps) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const addToast = useUIStore((s) => s.addToast)
  const requireAuth = useRequireAuth()
  const [quantity, setQuantity] = useState(1)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IntentFormValues>({
    resolver: zodResolver(intentSchema),
    defaultValues: { quantity: 1 },
  })

  const safeQuantity = quantity
  const isActive = purchase.status === 'active'

  const adjustQuantity = (delta: number) => {
    const next = Math.max(1, safeQuantity + delta)
    setQuantity(next)
    setValue('quantity', next, { shouldDirty: true, shouldValidate: true })
  }

  const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    setQuantity(Number.isNaN(next) ? 0 : next)
    setValue('quantity', next, { shouldDirty: true, shouldValidate: true })
  }

  const onSubmit = async (values: IntentFormValues) => {
    if (!requireAuth()) return
    if (!isActive) {
      addToast({ type: 'warning', message: '该采购信息已不再收集意向' })
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from('purchase_orders').insert({
        purchase_id: purchase.id,
        user_id: user!.id,
        quantity: values.quantity,
        total_price: 0,
        status: 'pending',
      })
      if (error) throw error

      void sendMessage(
        supabase,
        purchaseJoinedMessage(user!.id, purchase.id, purchase.title, values.quantity),
      )
      addToast({ type: 'success', message: '采购意向已提交，后续请留意沟通通知' })
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : '提交失败，请稍后重试'
      addToast({ type: 'error', message })
    }
  }

  if (myOrder) {
    const statusVariant = PURCHASE_ORDER_STATUS_VARIANT[myOrder.status] ?? 'default'
    const statusLabel = PURCHASE_ORDER_STATUS_LABEL[myOrder.status] ?? myOrder.status
    return (
      <div className="rounded-lg border border-line bg-white p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <h2 className="text-lg font-bold text-ink-primary">采购意向已提交</h2>
        </div>
        <div className="mt-4 border-y border-line-light py-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-ink-tertiary">预计采购数量</span>
            <span className="font-semibold text-ink-primary">{myOrder.quantity}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-ink-tertiary">当前状态</span>
            <Badge variant={statusVariant} size="sm">{statusLabel}</Badge>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-ink-tertiary">
          平台不会在站内收款；价格、交期和供货细节由后续沟通确认。
        </p>
      </div>
    )
  }

  if (!isActive) {
    return (
      <div className="rounded-lg border border-line bg-white p-5 text-center">
        <Lock className="mx-auto h-7 w-7 text-ink-tertiary" strokeWidth={1.5} />
        <h2 className="mt-3 text-lg font-bold text-ink-primary">该信息已停止收集</h2>
        <p className="mt-2 text-sm leading-6 text-ink-tertiary">请关注后续公开的采购信息。</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-ink-primary">提交采购意向</h2>
        </div>
        <p className="text-sm leading-6 text-ink-secondary">
          填写预计用量后，平台将按流程协助建立沟通。提交不构成订单、付款或供货承诺。
        </p>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-primary">预计采购数量</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="减少数量"
              onClick={() => adjustQuantity(-1)}
              disabled={safeQuantity <= 1}
              className={cn(
                'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-white',
                'transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40',
              )}
            >
              <Minus className="h-4 w-4" />
            </button>
            <Input
              type="number"
              min={1}
              step={1}
              aria-label="预计采购数量"
              error={errors.quantity?.message}
              className="text-center"
              {...register('quantity', { valueAsNumber: true })}
              value={Number.isNaN(safeQuantity) ? '' : safeQuantity}
              onChange={onQuantityChange}
            />
            <button
              type="button"
              aria-label="增加数量"
              onClick={() => adjustQuantity(1)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-white transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {errors.quantity && <p className="mt-1 text-xs text-danger">{errors.quantity.message}</p>}
        </div>
        <Button type="submit" size="lg" loading={isSubmitting} disabled={isSubmitting} className="w-full">
          {isSubmitting ? '提交中...' : '提交意向'}
        </Button>
      </form>
    </div>
  )
}
