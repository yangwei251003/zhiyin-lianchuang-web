'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Lock, Minus, Plus, Wallet } from 'lucide-react'
import type { Database } from '@/types/database'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import { useRequireVerified } from '@/lib/auth/client-guard'
import {
  formatPrice,
  PURCHASE_ORDER_STATUS_LABEL,
  PURCHASE_ORDER_STATUS_VARIANT,
} from '@/lib/purchase-config'
import { sendMessage, purchaseJoinedMessage } from '@/lib/messages'
import { cn } from '@/lib/utils'

type PurchaseRow = Database['public']['Tables']['purchases']['Row']
type PurchaseOrderRow =
  Database['public']['Tables']['purchase_orders']['Row']

export interface JoinPurchaseFormProps {
  purchase: PurchaseRow
  myOrder: PurchaseOrderRow | null
}

// 参团表单校验 schema（zod v4：用 error 替代 invalid_type_error）
const joinSchema = z.object({
  quantity: z
    .number({ error: '请输入采购数量' })
    .int('数量需为整数')
    .min(1, '数量至少为 1'),
})

type JoinFormValues = z.infer<typeof joinSchema>

// 参团下单表单（客户端组件）
// react-hook-form + zod 校验，提交插入 purchase_orders 表
export function JoinPurchaseForm({ purchase, myOrder }: JoinPurchaseFormProps) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const addToast = useUIStore((s) => s.addToast)
  const requireVerified = useRequireVerified()
  const [quantity, setQuantity] = useState<number>(purchase.min_quantity)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      quantity: purchase.min_quantity,
    },
  })

  const watchedQuantity = watch('quantity')
  const safeQty =
    typeof watchedQuantity === 'number' && !Number.isNaN(watchedQuantity)
      ? watchedQuantity
      : quantity
  const totalPrice = safeQty * purchase.unit_price

  const isActive = purchase.status === 'active'
  const isEnded = purchase.status === 'ended'
  const isCancelled = purchase.status === 'cancelled'
  const formDisabled = !isActive || !!myOrder

  // 数量增减
  const adjustQty = (delta: number) => {
    const next = Math.max(purchase.min_quantity, safeQty + delta)
    setQuantity(next)
    setValue('quantity', next, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const num = Number(raw)
    if (raw === '' || Number.isNaN(num)) {
      setValue('quantity', NaN as unknown as number, { shouldValidate: true })
      setQuantity(0)
      return
    }
    setQuantity(num)
    setValue('quantity', num, { shouldValidate: true, shouldDirty: true })
  }

  const onSubmit = async (values: JoinFormValues) => {
    // 客户端认证守卫：未登录/未认证跳转
    const ok = requireVerified()
    if (!ok) return

    // 二次校验状态
    if (!isActive) {
      addToast({ type: 'warning', message: '该集采活动已不可参团' })
      return
    }
    if (values.quantity < purchase.min_quantity) {
      addToast({
        type: 'warning',
        message: `起订量为 ${purchase.min_quantity} 件`,
      })
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from('purchase_orders').insert({
        purchase_id: purchase.id,
        user_id: user!.id,
        quantity: values.quantity,
        total_price: values.quantity * purchase.unit_price,
        status: 'pending',
      })

      if (error) throw error

      // 发送参团成功消息（非阻塞）
      void sendMessage(supabase, purchaseJoinedMessage(
        user!.id,
        purchase.id,
        purchase.title,
        values.quantity,
      ))

      addToast({ type: 'success', message: '参团成功，请尽快完成支付' })
      router.refresh()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '参团失败，请稍后重试'
      addToast({ type: 'error', message })
    }
  }

  // 已参团：展示订单状态，禁用表单
  if (myOrder) {
    const orderVariant =
      PURCHASE_ORDER_STATUS_VARIANT[myOrder.status] ?? 'default'
    const orderLabel =
      PURCHASE_ORDER_STATUS_LABEL[myOrder.status] ?? myOrder.status
    return (
      <Card padding="lg" className="animate-fade-in-up">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h3 className="text-lg font-bold text-ink-primary">您已参团</h3>
            <Badge variant={orderVariant} size="md">
              {orderLabel}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-canvas p-4">
            <div>
              <p className="text-2xs text-ink-tertiary">参团数量</p>
              <p className="mt-0.5 text-lg font-bold text-ink-primary">
                {myOrder.quantity} 件
              </p>
            </div>
            <div>
              <p className="text-2xs text-ink-tertiary">订单总价</p>
              <p className="mt-0.5 text-lg font-bold text-primary">
                ¥{formatPrice(myOrder.total_price)}
              </p>
            </div>
          </div>
          <p className="text-xs text-ink-tertiary">
            每位用户仅可参团一次，如需修改请联系客服
          </p>
        </div>
      </Card>
    )
  }

  // 已结束/已取消：禁用提示
  if (isEnded || isCancelled) {
    return (
      <Card padding="lg" className="animate-fade-in-up">
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <Lock className="h-8 w-8 text-ink-tertiary" strokeWidth={1.5} />
          <h3 className="text-lg font-bold text-ink-primary">
            {isEnded ? '该集采活动已结束' : '该集采活动已取消'}
          </h3>
          <p className="text-sm text-ink-tertiary">无法继续参团</p>
        </div>
      </Card>
    )
  }

  // 参团表单
  return (
    <Card padding="lg" className="animate-fade-in-up">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-ink-primary">参团下单</h3>
        </div>

        {/* 单价 + 起订量提示 */}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-lg bg-canvas p-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xs text-ink-tertiary">集采单价</span>
            <span className="text-xl font-bold text-primary">
              ¥{formatPrice(purchase.unit_price)}
            </span>
            <span className="text-2xs text-ink-tertiary">元/件</span>
          </div>
          <span className="text-2xs text-ink-tertiary">
            起订量 {purchase.min_quantity} 件
          </span>
        </div>

        {/* 数量输入（带增减按钮） */}
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-ink-primary">
            采购数量
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustQty(-1)}
              disabled={formDisabled || safeQty <= purchase.min_quantity}
              aria-label="减少数量"
              className={cn(
                'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-white',
                'transition-all duration-fast ease-out-expo',
                'hover:border-primary hover:text-primary',
                'disabled:pointer-events-none disabled:opacity-40',
              )}
            >
              <Minus className="h-4 w-4" />
            </button>
            <Input
              type="number"
              min={purchase.min_quantity}
              step={1}
              disabled={formDisabled}
              error={errors.quantity?.message}
              className="text-center"
              {...register('quantity', { valueAsNumber: true })}
              value={Number.isNaN(safeQty) ? '' : safeQty}
              onChange={onQuantityChange}
            />
            <button
              type="button"
              onClick={() => adjustQty(1)}
              disabled={formDisabled}
              aria-label="增加数量"
              className={cn(
                'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-white',
                'transition-all duration-fast ease-out-expo',
                'hover:border-primary hover:text-primary',
                'disabled:pointer-events-none disabled:opacity-40',
              )}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {errors.quantity ? (
            <p className="mt-1 text-xs text-danger">
              {errors.quantity.message}
            </p>
          ) : (
            <p className="mt-1 text-2xs text-ink-tertiary">
              最少 {purchase.min_quantity} 件，可按需增加
            </p>
          )}
        </div>

        {/* 实时总价 */}
        <div className="flex items-center justify-between rounded-lg border border-line-light bg-primary-bg-subtle p-4">
          <span className="text-sm text-ink-secondary">预计总价</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">
              ¥{formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        {/* 提交按钮 */}
        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          disabled={formDisabled || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? '提交中...' : '确认参团'}
        </Button>
      </form>
    </Card>
  )
}
