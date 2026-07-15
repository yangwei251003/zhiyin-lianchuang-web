'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { useUIStore } from '@/store/ui-store'
import { CAPACITY_DEVICES, REGIONS } from '@/lib/order-config'
import { cn } from '@/lib/utils'

// 产能发布表单校验 schema
const capacitySchema = z
  .object({
    device_type: z.string().min(1, '请选择设备类型'),
    capacity: z
      .string()
      .min(2, '产能描述至少 2 个字')
      .max(200, '产能描述最多 200 个字'),
    region: z.string().min(1, '请选择地区'),
    price_min: z
      .number({ error: '请输入最低价格' })
      .positive('最低价格需大于 0'),
    price_max: z
      .number({ error: '请输入最高价格' })
      .positive('最高价格需大于 0'),
    available_date: z.string().min(1, '请选择可接单日期'),
  })
  .refine((data) => data.price_max >= data.price_min, {
    message: '最高价格不能低于最低价格',
    path: ['price_max'],
  })

type CapacityFormValues = z.infer<typeof capacitySchema>

// 今日日期（yyyy-mm-dd），用于 date 输入 min 属性
function todayStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 产能发布表单（客户端组件）
export function CapacityPublishForm() {
  const router = useRouter()
  const addToast = useUIStore((s) => s.addToast)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CapacityFormValues>({
    resolver: zodResolver(capacitySchema),
    defaultValues: {
      device_type: '',
      capacity: '',
      region: '',
      price_min: undefined,
      price_max: undefined,
      available_date: '',
    },
  })

  const onSubmit = async (values: CapacityFormValues) => {
    try {
      const response = await fetch('/api/business/capacities', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ deviceType: values.device_type, capacity: values.capacity, region: values.region, priceMin: values.price_min, priceMax: values.price_max, availableDate: values.available_date }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      addToast({ type: 'success', message: '产能发布成功' })
      router.push('/orders/capacities')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '发布失败，请稍后重试'
      addToast({ type: 'error', message })
    }
  }

  return (
    <Card padding="lg" className="animate-fade-in-up">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* 设备类型 + 地区 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="设备类型"
            placeholder="请选择设备类型"
            error={errors.device_type?.message}
            {...register('device_type')}
            options={CAPACITY_DEVICES.map((d) => ({
              value: d,
              label: d,
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

        {/* 产能描述 */}
        <Input
          label="产能描述"
          placeholder="如：对开四色，月产能 10 万印"
          maxLength={200}
          error={errors.capacity?.message}
          {...register('capacity')}
        />

        {/* 价格区间 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="number"
            step="0.01"
            min="0"
            label="最低价格（元）"
            placeholder="请输入最低价格"
            error={errors.price_min?.message}
            {...register('price_min', { valueAsNumber: true })}
          />
          <Input
            type="number"
            step="0.01"
            min="0"
            label="最高价格（元）"
            placeholder="请输入最高价格"
            hint="最高价格需不低于最低价格"
            error={errors.price_max?.message}
            {...register('price_max', { valueAsNumber: true })}
          />
        </div>

        {/* 可接单日期 */}
        <div className="w-full">
          <label
            htmlFor="available-date"
            className="mb-1.5 block text-sm font-medium text-ink-primary"
          >
            可接单日期
          </label>
          <input
            id="available-date"
            type="date"
            min={todayStr()}
            className={cn(
              'h-10 w-full rounded-md border bg-white px-3 text-sm text-ink-primary',
              'transition-all duration-fast ease-out-expo',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
              errors.available_date ? 'border-danger' : 'border-line',
            )}
            {...register('available_date')}
          />
          {errors.available_date && (
            <p className="mt-1 text-xs text-danger">
              {errors.available_date.message}
            </p>
          )}
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
            {isSubmitting ? '发布中...' : '发布产能'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
