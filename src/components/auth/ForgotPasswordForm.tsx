'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { useUIStore } from '@/store/ui-store'

// 找回密码表单校验 schema
const forgotSchema = z.object({
  email: z
    .string()
    .min(1, '请输入邮箱')
    .email('邮箱格式不正确'),
})

type ForgotValues = z.infer<typeof forgotSchema>

// 找回密码表单（客户端组件）
// 调用 Supabase auth.resetPasswordForEmail 发送重置邮件
export function ForgotPasswordForm() {
  const addToast = useUIStore((s) => s.addToast)
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: ForgotValues) => {
    const email = values.email.trim()
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      addToast({ type: 'error', message: error.message })
      return
    }
    setSentEmail(email)
    setSent(true)
    addToast({ type: 'success', message: '重置邮件已发送，请查收邮箱' })
  }

  // 成功状态
  if (sent) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 text-center shadow-lg sm:p-8">
        <span className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success-bg">
          <CheckCircle2 className="h-9 w-9 text-success" />
        </span>
        <h1 className="text-2xl font-bold text-ink-primary">邮件已发送</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          我们已向{' '}
          <span className="font-semibold text-ink-primary">{sentEmail}</span>{' '}
          发送了一封密码重置邮件，请在邮箱中点击重置链接完成操作。
        </p>
        <p className="mt-2 text-xs text-ink-tertiary">
          没有收到？请检查垃圾邮件文件夹，或稍后重试。
        </p>
        <div className="mt-6 space-y-3">
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={() => {
              setSent(false)
              setSentEmail('')
            }}
          >
            重新发送
          </Button>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-line px-4 py-3 text-sm font-medium text-ink-secondary transition-colors hover:bg-canvas hover:text-ink-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            返回登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-lg sm:p-8">
      {/* 标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-primary">重置密码</h1>
        <p className="mt-1.5 text-sm text-ink-secondary">
          我们将向您发送密码重置邮件
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          type="email"
          label="邮箱"
          placeholder="请输入注册邮箱地址"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? '发送中...' : '发送重置邮件'}
        </Button>
      </form>

      {/* 底部链接 */}
      <div className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-secondary">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          返回登录
        </Link>
      </div>
    </div>
  )
}
