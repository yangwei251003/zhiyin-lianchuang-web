'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'

const REMEMBER_KEY = 'zl-remember-email'

// 登录表单校验 schema（zod v4：用 error 替代 invalid_type_error）
const loginSchema = z.object({
  email: z
    .string()
    .min(1, '请输入邮箱')
    .email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少 6 位'),
  remember: z.boolean().optional(),
})

type LoginValues = z.infer<typeof loginSchema>

// 登录表单（客户端组件）
export function LoginForm({ from }: { from?: string }) {
  const router = useRouter()
  const signIn = useAuthStore((s) => s.signIn)
  const addToast = useUIStore((s) => s.addToast)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  // 挂载时恢复记住的邮箱
  useEffect(() => {
    const saved =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(REMEMBER_KEY)
        : null
    if (saved) {
      setValue('email', saved)
      setValue('remember', true)
    }
  }, [setValue])

  const onSubmit = async (values: LoginValues) => {
    const { error } = await signIn(values.email.trim(), values.password)
    if (error) {
      const friendly =
        error === 'Invalid login credentials'
          ? '邮箱或密码错误'
          : error
      addToast({ type: 'error', message: friendly })
      return
    }
    // 记住邮箱
    if (values.remember) {
      window.localStorage.setItem(REMEMBER_KEY, values.email.trim())
    } else {
      window.localStorage.removeItem(REMEMBER_KEY)
    }
    addToast({ type: 'success', message: '登录成功' })
    router.push(from || '/')
    router.refresh()
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-lg sm:p-8">
      {/* 标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-primary">欢迎回到智印联创</h1>
        <p className="mt-1.5 text-sm text-ink-secondary">登录您的账户</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* 邮箱 */}
        <Input
          type="email"
          label="邮箱"
          placeholder="请输入邮箱地址"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* 密码 */}
        <Input
          type={showPassword ? 'text' : 'password'}
          label="密码"
          placeholder="请输入密码（至少 6 位）"
          autoComplete="current-password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? '隐藏密码' : '显示密码'}
              className="inline-flex h-6 w-6 items-center justify-center text-ink-tertiary transition-colors hover:text-ink-primary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          {...register('password')}
        />

        {/* 记住我 + 忘记密码 */}
        <div className="flex items-center justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-line text-primary focus:ring-primary/30"
              {...register('remember')}
            />
            记住我
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary transition-colors hover:text-primary-light"
          >
            忘记密码？
          </Link>
        </div>

        {/* 提交按钮 */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? '登录中...' : '登录'}
        </Button>
      </form>

      {/* 底部链接 */}
      <div className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-secondary">
        还没有账户？
        <Link
          href="/register"
          className="ml-1 font-medium text-primary transition-colors hover:text-primary-light"
        >
          立即注册
        </Link>
      </div>
    </div>
  )
}
