'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { CheckCircle2, CalendarPlus, Clock, FileText, MessageSquare } from 'lucide-react'
import type { Database } from '@/types/database'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import { useRequireAuth } from '@/lib/auth/client-guard'
import { cn } from '@/lib/utils'

type MentorRow = Database['public']['Tables']['mentors']['Row']

export interface MentorBookingFormProps {
  mentor: MentorRow
}

// 预约表单校验 schema（zod v4：用 error 替代 invalid_type_error）
const bookingSchema = z.object({
  topic: z
    .string({ error: '请输入咨询主题' })
    .min(2, '主题至少 2 个字')
    .max(60, '主题不超过 60 个字'),
  description: z
    .string()
    .max(500, '描述不超过 500 个字')
    .optional(),
  booking_date: z
    .string({ error: '请选择预约日期' })
    .min(1, '请选择预约日期')
    .refine((val) => {
      // 日期不早于今天
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const picked = new Date(val)
      picked.setHours(0, 0, 0, 0)
      return picked >= today
    }, '预约日期不能早于今天'),
  booking_time: z
    .string({ error: '请选择预约时间' })
    .min(1, '请选择预约时间'),
})

type BookingFormValues = z.infer<typeof bookingSchema>

// 导师预约表单（客户端组件）
// react-hook-form + zod 校验，提交插入 mentor_bookings 表
export function MentorBookingForm({ mentor }: MentorBookingFormProps) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const addToast = useUIStore((s) => s.addToast)
  const requireAuth = useRequireAuth()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      topic: '',
      description: '',
      booking_date: '',
      booking_time: '',
    },
  })

  const onSubmit = async (values: BookingFormValues) => {
    // 客户端认证守卫：未登录跳转
    const ok = requireAuth()
    if (!ok) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('mentor_bookings').insert({
        mentor_id: mentor.id,
        user_id: user!.id,
        topic: values.topic,
        description: values.description ?? '',
        booking_date: values.booking_date,
        booking_time: values.booking_time,
        status: 'pending',
      })

      if (error) throw error

      addToast({ type: 'success', message: '预约提交成功，等待导师确认' })
      setSubmitted(true)
      router.refresh()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '预约失败，请稍后重试'
      addToast({ type: 'error', message })
    }
  }

  // 预约成功状态
  if (submitted) {
    return (
      <Card padding="lg" className="animate-fade-in-up">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success-bg">
            <CheckCircle2 className="h-8 w-8 text-success" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-ink-primary">预约提交成功</h3>
          <p className="max-w-sm text-sm text-ink-secondary">
            您的咨询预约已提交，导师「{mentor.name}」将在确认后与您联系，请留意消息通知
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setSubmitted(false)}
            >
              再次预约
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => router.push('/startup/mentors')}
            >
              返回导师列表
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // 预约表单
  return (
    <Card padding="lg" className="animate-fade-in-up">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarPlus className="h-5 w-5 text-environment" />
          <h3 className="text-lg font-bold text-ink-primary">预约咨询</h3>
          <Badge variant="success" size="sm" className="ml-auto">
            {mentor.name}
          </Badge>
        </div>

        {/* 咨询主题 */}
        <div className="w-full">
          <label
            htmlFor="booking-topic"
            className="mb-1.5 block text-sm font-medium text-ink-primary"
          >
            咨询主题 <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-tertiary" />
            <input
              id="booking-topic"
              type="text"
              placeholder="例如：设备选型与采购方案"
              {...register('topic')}
              className={cn(
                'h-10 w-full rounded-md border bg-white pl-9 pr-3 text-sm text-ink-primary placeholder:text-ink-tertiary',
                'transition-all duration-fast ease-out-expo',
                'focus:outline-none focus:ring-2 focus:ring-environment/30 focus:border-environment',
                errors.topic
                  ? 'border-danger focus:border-danger focus:ring-danger/20'
                  : 'border-line',
              )}
            />
          </div>
          {errors.topic && (
            <p className="mt-1 text-xs text-danger">{errors.topic.message}</p>
          )}
        </div>

        {/* 问题描述 */}
        <div className="w-full">
          <label
            htmlFor="booking-desc"
            className="mb-1.5 block text-sm font-medium text-ink-primary"
          >
            问题描述 <span className="text-ink-tertiary">（选填）</span>
          </label>
          <div className="relative">
            <MessageSquare className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-tertiary" />
            <textarea
              id="booking-desc"
              rows={4}
              placeholder="请简要描述你的创业现状与具体困惑，便于导师提前准备"
              {...register('description')}
              className={cn(
                'w-full rounded-md border bg-white py-2 pl-9 pr-3 text-sm text-ink-primary placeholder:text-ink-tertiary',
                'transition-all duration-fast ease-out-expo',
                'focus:outline-none focus:ring-2 focus:ring-environment/30 focus:border-environment',
                'resize-y min-h-24',
                errors.description
                  ? 'border-danger focus:border-danger focus:ring-danger/20'
                  : 'border-line',
              )}
            />
          </div>
          {errors.description && (
            <p className="mt-1 text-xs text-danger">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* 预约日期 + 时间 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            type="date"
            label="预约日期"
            leftIcon={<CalendarPlus className="h-4 w-4" />}
            error={errors.booking_date?.message}
            {...register('booking_date')}
          />
          <Input
            type="time"
            label="预约时间"
            leftIcon={<Clock className="h-4 w-4" />}
            error={errors.booking_time?.message}
            {...register('booking_time')}
          />
        </div>

        {/* 提交按钮 */}
        <Button
          type="submit"
          variant="success"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? '提交中...' : '提交预约'}
        </Button>

        <p className="text-center text-2xs text-ink-tertiary">
          提交后导师将在 24 小时内确认，请保持联系方式畅通
        </p>
      </form>
    </Card>
  )
}
