import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/guard'
import { Container } from '@/components/layout/Container'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { CompanyAuthForm } from '@/components/mine/CompanyAuthForm'

export const metadata: Metadata = {
  title: '企业认证 · 智印联创',
  description: '提交企业资料，按流程完成平台信息审核。',
}

// 企业实名认证页（服务端组件）
// 服务端获取当前用户的企业认证记录，传给客户端表单组件
export default async function CompanyAuthPage() {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle()

  return (
    <main className="pb-12">
      <Container size="sm" className="pt-6">
        {/* 面包屑 */}
        <nav
          className="mb-4 flex items-center gap-1.5 text-xs text-ink-tertiary"
          aria-label="面包屑"
        >
          <Link href="/" className="hover:text-primary">
            首页
          </Link>
          <span>/</span>
          <Link href="/mine" className="hover:text-primary">
            我的
          </Link>
          <span>/</span>
          <span className="text-ink-secondary">企业认证</span>
        </nav>

        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-primary sm:text-3xl">
            企业实名认证
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            审核通过后可发布需求、发布产能和提交报价沟通
          </p>
        </div>

        <AuthGuard>
          <CompanyAuthForm company={company} />
        </AuthGuard>
      </Container>
    </main>
  )
}
