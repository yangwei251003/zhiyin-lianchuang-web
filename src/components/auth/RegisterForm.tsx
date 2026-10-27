'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, User, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'

// ─── Schema 校验规则 ────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    nickname: z.string().min(2, '昵称至少 2 个字').max(20, '昵称最多 20 个字'),
    email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
    password: z
      .string()
      .min(6, '密码至少 6 位')
      .refine(
        (v) => /[A-Za-z]/.test(v) && /\d/.test(v),
        '密码需同时包含字母和数字',
      ),
    confirmPassword: z.string(),
    agree: z.boolean(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })
  .refine((d) => d.agree === true, {
    message: '请同意服务条款',
    path: ['agree'],
  })

type RegisterValues = z.infer<typeof registerSchema>

// ─── 注册表单组件 ──────────────────────────────────────────────────────────
export function RegisterForm() {
  const router = useRouter()
  const signUp = useAuthStore((s) => s.signUp)
  const addToast = useUIStore((s) => s.addToast)

  // step: 'form' | 'done'
  const [step, setStep] = useState<'form' | 'done'>('form')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false,
    },
  })

  // ─── 注册信息提交 ──────────────────────────────────────────────────────────
  const onRegisterSubmit = async (values: RegisterValues) => {
    const { error } = await signUp(
      values.email.trim(),
      values.password,
      values.nickname.trim(),
    )
    if (error) {
      const friendly = /already registered|already been registered/i.test(error)
        ? '邮箱已被注册，请直接登录'
        : error
      addToast({ type: 'error', message: friendly })
      return
    }
    setStep('done')
    addToast({ type: 'success', message: '注册成功，欢迎加入智印联创！' })
    setTimeout(() => {
      router.push('/')
      router.refresh()
    }, 1500)
  }

  return (
    <div className="border border-line bg-white p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {/* ====== 注册输入表单 ====== */}
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* 标题 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-ink-primary">创建智印联创账户</h1>
              <p className="mt-1.5 text-sm text-ink-secondary">
                创建账户后可按需使用平台服务
              </p>
            </div>

            <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4" noValidate>
              {/* 昵称 */}
              <Input
                label="昵称"
                placeholder="请输入昵称（2-20 字）"
                maxLength={20}
                autoComplete="nickname"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.nickname?.message}
                {...register('nickname')}
              />

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
                placeholder="至少 6 位，需含字母和数字"
                autoComplete="new-password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                    className="inline-flex h-6 w-6 items-center justify-center text-ink-tertiary transition-colors hover:text-ink-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                {...register('password')}
              />

              {/* 确认密码 */}
              <Input
                type={showConfirm ? 'text' : 'password'}
                label="确认密码"
                placeholder="请再次输入密码"
                autoComplete="new-password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? '隐藏密码' : '显示密码'}
                    className="inline-flex h-6 w-6 items-center justify-center text-ink-tertiary transition-colors hover:text-ink-primary"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                {...register('confirmPassword')}
              />

              {/* 同意条款 */}
              <div>
                <label className="flex cursor-pointer items-start gap-2 text-sm text-ink-secondary">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-line text-primary focus:ring-primary/30"
                    {...register('agree')}
                  />
                  <span>
                    我已阅读并同意
                    <Link href="/terms" className="mx-0.5 font-medium text-primary hover:text-primary-light">
                      《服务条款》
                    </Link>
                    和
                    <Link href="/privacy" className="mx-0.5 font-medium text-primary hover:text-primary-light">
                      《隐私政策》
                    </Link>
                  </span>
                </label>
                {errors.agree?.message && (
                  <p className="mt-1 text-xs text-danger">{errors.agree.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? '正在注册...' : '立即注册'}
              </Button>
            </form>

            <div className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-secondary">
              已有账户？
              <Link href="/login" className="ml-1 font-medium text-primary transition-colors hover:text-primary-light">
                立即登录
              </Link>
            </div>
          </motion.div>
        )}

        {/* ====== Step 3: 注册完成 ====== */}
        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="py-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success-bg"
            >
              <CheckCircle className="h-10 w-10 text-success" />
            </motion.div>
            <h2 className="text-2xl font-bold text-ink-primary">注册成功！</h2>
            <p className="mt-2 text-sm text-ink-secondary">
              欢迎加入智印联创，正在跳转首页…
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
