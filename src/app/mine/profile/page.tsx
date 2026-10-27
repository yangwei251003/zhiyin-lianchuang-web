import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/guard'
import { Container } from '@/components/layout/Container'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { ProfileEditForm } from '@/components/mine/ProfileEditForm'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: '编辑资料 · 智印联创',
  description: '编辑个人昵称、手机号与头像。',
}

// 编辑个人资料页（服务端组件）
export default async function ProfileEditPage() {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

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
          <span className="text-ink-secondary">编辑资料</span>
        </nav>

        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-primary sm:text-3xl">
            编辑资料
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            更新昵称、手机号与头像
          </p>
        </div>

        <AuthGuard>
          {profile ? (
            <ProfileEditForm profile={profile} />
          ) : (
            <Card padding="lg" className="text-center text-sm text-ink-secondary">
              未找到用户资料，请稍后重试
            </Card>
          )}
        </AuthGuard>
      </Container>
    </main>
  )
}
