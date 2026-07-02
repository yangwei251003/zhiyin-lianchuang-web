import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthShell } from '@/components/auth/AuthShell'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: '注册 · 智印联创',
  description: '创建智印联创账户，加入印刷行业 AI 智能撮合平台。',
}

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    redirect('/')
  }

  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  )
}
