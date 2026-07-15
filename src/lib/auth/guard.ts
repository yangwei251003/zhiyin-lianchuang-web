import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import type { Session } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Company = Database['public']['Tables']['companies']['Row']

// 服务端守卫：未登录跳转登录页
// 在 Server Component / Route Handler 中调用
export async function requireAuth(): Promise<Session> {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    redirect(`/login${pathname ? `?from=${encodeURIComponent(pathname)}` : ''}`)
  }
  return session
}

// 服务端守卫：已登录但未通过企业认证跳转认证页
export async function requireVerified(): Promise<{
  session: Session
  company: Company | null
}> {
  const session = await requireAuth()
  const supabase = await createClient()
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle()
  if (company?.status !== 'approved') {
    redirect('/mine/auth')
  }
  return { session, company }
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireAuth()
  if (session.user.app_metadata?.role !== 'admin') redirect('/mine')
  return session
}
