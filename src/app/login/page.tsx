import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthShell } from '@/components/auth/AuthShell'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: '登录 · 智印联创',
  description: '登录智印联创账户，开启印刷行业 AI 智能撮合之旅。',
}

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// 登录页（服务端组件）
// 已登录用户直接重定向到首页或 from 指定的页面
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const from = params.from

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    redirect(from || '/')
  }

  return (
    <AuthShell>
      <LoginForm from={from} />
    </AuthShell>
  )
}
