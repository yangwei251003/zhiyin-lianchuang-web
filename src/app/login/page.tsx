import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthShell } from '@/components/auth/AuthShell'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: '登录 · 智印联创',
  description: '登录智印联创账户，继续使用印刷产业协同服务。',
}

export const dynamic = 'force-dynamic'

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

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
