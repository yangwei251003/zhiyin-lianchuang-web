'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import { useRequireVerified } from '@/lib/auth/client-guard'
import { ORDER_CATEGORIES, ORDER_CRAFTS, REGIONS } from '@/lib/order-config'
import { sendMessage, orderPublishedMessage } from '@/lib/messages'
import { cn } from '@/lib/utils'

// 订单发布表单校验 schema
const orderSchema = z
  .object({
    title: z
      .string()
      .min(2, '标题至少 2 个字')
      .max(50, '标题最多 50 个字'),
    category: z.string().min(1, '请选择分类'),
    craft: z.string().min(1, '请选择至少一种工艺'),
    budget_min: z
      .number({ error: '请输入最低预算' })
      .positive('最低预算需大于 0'),
    budget_max: z
      .number({ error: '请输入最高预算' })
      .positive('最高预算需大于 0'),
    region: z.string().min(1, '请选择地区'),
    description: z
      .string()
      .min(10, '描述至少 10 个字')
      .max(500, '描述最多 500 个字'),
  })
  .refine((data) => data.budget_max >= data.budget_min, {
    message: '最高预算不能低于最低预算',
    path: ['budget_max'],
  })

type OrderFormValues = z.infer<typeof orderSchema>

// 订单发布表单（客户端组件）
// react-hook-form + zod 校验，提交插入 orders 表
export function OrderPublishForm() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const addToast = useUIStore((s) => s.addToast)
  const requireVerified = useRequireVerified()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      title: '',
      category: '',
      craft: '',
      budget_min: undefined,
      budget_max: undefined,
      region: '',
      description: '',
    },
  })

  const descValue = watch('description') || ''
  const craftValue = watch('craft') || ''
  const craftList = craftValue ? craftValue.split('、') : []

  // 切换工艺多选
  const toggleCraft = (craft: string) => {
    const set = new Set(craftList)
    if (set.has(craft)) set.delete(craft)
    else set.add(craft)
    setValue('craft', Array.from(set).join('、'), {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const onSubmit = async (values: OrderFormValues) => {
    // 客户端认证守卫：未登录/未认证跳转
    const ok = requireVerified()
    if (!ok) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          title: values.title.trim(),
          category: values.category,
          craft: values.craft,
          budget_min: values.budget_min,
          budget_max: values.budget_max,
          region: values.region,
          description: values.description.trim(),
          status: 'open',
        })
        .select('id')
        .single()

      if (error) throw error

      // 发布成功：向发布者自己发送消息通知（非阻塞）
      void sendMessage(supabase, orderPublishedMessage(user!.id, data.id, values.title.trim()))

      addToast({ type: 'success', message: '订单发布成功' })
      router.push(`/orders/${data.id}`)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '发布失败，请稍后重试'
      addToast({ type: 'error', message })
    }
  }

  return (
    <Card padding="lg" className="animate-fade-in-up">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* 标题 */}
        <Input
          label="订单标题"
          placeholder="请输入订单标题（2-50 字）"
          maxLength={50}
          error={errors.title?.message}
          {...register('title')}
        />

        {/* 分类 + 地区 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="分类"
            placeholder="请选择分类"
            error={errors.category?.message}
            {...register('category')}
            options={ORDER_CATEGORIES.map((c) => ({
              value: c,
              label: c,
            }))}
          />
          <Select
            label="地区"
            placeholder="请选择地区"
            error={errors.region?.message}
            {...register('region')}
            options={REGIONS.map((r) => ({ value: r, label: r }))}
          />
        </div>

        {/* 工艺多选 */}
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-ink-primary">
            工艺要求
            <span className="ml-1 text-xs font-normal text-ink-tertiary">
              （可多选）
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {ORDER_CRAFTS.map((craft) => {
              const active = craftList.includes(craft)
              return (
                <button
                  key={craft}
                  type="button"
                  onClick={() => toggleCraft(craft)}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-all duration-fast ease-out-expo',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                    active
                      ? 'border-primary bg-primary-bg text-primary'
                      : 'border-line bg-white text-ink-secondary hover:border-primary/30 hover:text-ink-primary',
                  )}
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                  {craft}
                </button>
              )
            })}
          </div>
          {errors.craft && (
            <p className="mt-1 text-xs text-danger">
              {errors.craft.message}
            </p>
          )}
        </div>

        {/* 预算 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="number"
            step="0.01"
            min="0"
            label="最低预算（元）"
            placeholder="请输入最低预算"
            error={errors.budget_min?.message}
            {...register('budget_min', { valueAsNumber: true })}
          />
          <Input
            type="number"
            step="0.01"
            min="0"
            label="最高预算（元）"
            placeholder="请输入最高预算"
            hint="最高预算需不低于最低预算"
            error={errors.budget_max?.message}
            {...register('budget_max', { valueAsNumber: true })}
          />
        </div>

        {/* 详细描述 */}
        <div className="w-full">
          <label
            htmlFor="order-description"
            className="mb-1.5 block text-sm font-medium text-ink-primary"
          >
            详细描述
          </label>
          <textarea
            id="order-description"
            rows={5}
            maxLength={500}
            placeholder="请详细描述印刷需求（数量、纸张、尺寸、颜色、交期等），10-500 字"
            className={cn(
              'w-full resize-none rounded-md border bg-white px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary',
              'transition-all duration-fast ease-out-expo',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
              errors.description ? 'border-danger' : 'border-line',
            )}
            {...register('description')}
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.description ? (
              <p className="text-xs text-danger">
                {errors.description.message}
              </p>
            ) : (
              <span />
            )}
            <span className="text-2xs text-ink-tertiary">
              {descValue.length}/500
            </span>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? '发布中...' : '发布订单'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
