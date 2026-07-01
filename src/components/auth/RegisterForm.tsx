'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, User, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OtpInput } from '@/components/auth/OtpInput'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'

// ─── Step 1 Schema ────────────────────────────────────────────────────────────
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

// ─── 组件 ──────────────────────────────────────────────────────────────────────
export function RegisterForm() {
  const router = useRouter()
  const signUp = useAuthStore((s) => s.signUp)
  const verifyOtp = useAuthStore((s) => s.verifyOtp)
  const resendOtp = useAuthStore((s) => s.resendOtp)
  const pendingEmail = useAuthStore((s) => s.pendingEmail)
  const addToast = useUIStore((s) => s.addToast)

  // step: 'form' | 'otp' | 'done'
  const [step, setStep] = useState<'form' | 'otp' | 'done'>('form')
  const [sentEmail, setSentEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // 倒计时重发
  const [countdown, setCountdown] = useState(0)
  const [resending, setResending] = useState(false)

  // 若 store 中已有 pendingEmail（页面刷新）则直接跳到 OTP 步骤
  useEffect(() => {
    if (pendingEmail && step === 'form') {
      setSentEmail(pendingEmail)
      setStep('otp')
      startCountdown()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

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

  // ─── Step 1: 注册信息提交 ───────────────────────────────────────────────────
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
    setSentEmail(values.email.trim())
    setStep('otp')
    startCountdown()
    addToast({ type: 'success', message: `验证码已发送至 ${values.email.trim()}` })
  }

  // ─── Step 2: OTP 验证 ───────────────────────────────────────────────────────
  const handleVerify = async () => {
    if (otp.length !== 8) {
      setOtpError('请输入完整的 8 位验证码')
      return
    }
    setVerifying(true)
    setOtpError('')
    const { error } = await verifyOtp(sentEmail, otp)
    setVerifying(false)
    if (error) {
      setOtpError('验证码错误或已过期，请重新输入')
      setOtp('')
      return
    }
    setStep('done')
    addToast({ type: 'success', message: '邮箱验证成功，欢迎加入智印联创！' })
    setTimeout(() => {
      router.push('/')
      router.refresh()
    }, 1500)
  }

  const handleResend = async () => {
    if (countdown > 0 || resending) return
    setResending(true)
    const { error } = await resendOtp(sentEmail)
    setResending(false)
    if (error) {
      addToast({ type: 'error', message: '重新发送失败，请稍后再试' })
      return
    }
    addToast({ type: 'success', message: '验证码已重新发送' })
    setOtp('')
    setOtpError('')
    startCountdown()
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-lg sm:p-8">
      <AnimatePresence mode="wait">
        {/* ====== Step 1: 注册信息 ====== */}
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
                加入印刷行业 AI 智能撮合平台
              </p>
            </div>

            <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4" noValidate>
              {/* 步骤指示器 */}
              <StepIndicator current={1} />

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
                    <a href="#" className="mx-0.5 font-medium text-primary hover:text-primary-light" onClick={(e) => e.preventDefault()}>
                      《服务条款》
                    </a>
                    和
                    <a href="#" className="mx-0.5 font-medium text-primary hover:text-primary-light" onClick={(e) => e.preventDefault()}>
                      《隐私政策》
                    </a>
                  </span>
                </label>
                {errors.agree?.message && (
                  <p className="mt-1 text-xs text-danger">{errors.agree.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? '发送验证码中...' : '注册并获取验证码'}
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

        {/* ====== Step 2: OTP 验证 ====== */}
        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            {/* 返回按钮 */}
            <button
              type="button"
              onClick={() => { setStep('form'); setOtp(''); setOtpError('') }}
              className="mb-4 inline-flex items-center gap-1 text-sm text-ink-tertiary transition-colors hover:text-ink-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              返回修改信息
            </button>

            {/* 标题 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-ink-primary">验证邮箱</h1>
              <p className="mt-2 text-sm text-ink-secondary">
                验证码已发送至
              </p>
              <p className="mt-1 font-semibold text-primary">{sentEmail}</p>
              <p className="mt-1 text-xs text-ink-tertiary">请查收邮件，填入 6 位数字验证码</p>
            </div>

            {/* 步骤指示器 */}
            <StepIndicator current={2} />

            {/* 8格 OTP 输入 */}
            <div className="mt-6">
              <OtpInput
                length={8}
                value={otp}
                onChange={(v) => { setOtp(v); setOtpError('') }}
                disabled={verifying}
              />
              {otpError && (
                <p className="mt-3 text-sm text-danger">{otpError}</p>
              )}
            </div>

            {/* 验证按钮 */}
            <Button
              size="lg"
              className="mt-6 w-full"
              loading={verifying}
              disabled={verifying || otp.length !== 8}
              onClick={handleVerify}
            >
              {verifying ? '验证中...' : '确认验证'}
            </Button>

            {/* 重新发送 */}
            <div className="mt-4 flex items-center justify-center gap-1 text-sm text-ink-secondary">
              <span>没收到邮件？</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resending}
                className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary-light disabled:text-ink-tertiary disabled:cursor-not-allowed"
              >
                {resending
                  ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" />发送中</>
                  : countdown > 0
                    ? `${countdown}s 后可重发`
                    : '重新发送'
                }
              </button>
            </div>

            {/* 提示 */}
            <p className="mt-4 rounded-lg bg-canvas p-3 text-xs text-ink-tertiary">
              若邮件未到达，请检查垃圾邮件文件夹。验证码 10 分钟内有效。
            </p>
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

// 步骤指示器
function StepIndicator({ current }: { current: 1 | 2 }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              step < current
                ? 'bg-success text-white'
                : step === current
                  ? 'bg-primary text-white'
                  : 'bg-line text-ink-tertiary'
            }`}
          >
            {step < current ? '✓' : step}
          </div>
          <span
            className={`text-xs ${
              step === current ? 'font-semibold text-ink-primary' : 'text-ink-tertiary'
            }`}
          >
            {step === 1 ? '填写信息' : '邮箱验证'}
          </span>
          {step < 2 && <div className="h-px w-8 bg-line" />}
        </div>
      ))}
    </div>
  )
}
