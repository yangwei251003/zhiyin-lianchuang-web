import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/guard'
import { Container } from '@/components/layout/Container'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { MineContent } from '@/components/mine/MineContent'

export const metadata: Metadata = {
  title: '我的中心 · 智印联创',
  description: '个人中心，管理资料、订单、报价与企业认证。',
}

// 我的中心页（服务端组件）
// 服务端获取 profile / company / 订单/报价/集采计数 + 待处理徽标
export default async function MinePage() {
  const session = await requireAuth()
  const userId = session.user.id
  const supabase = await createClient()

  // 用户档案 + 企业认证
  const [{ data: profile }, { data: company }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(),
  ])

  // 数据概览计数
  const [
    { count: ordersCount },
    { count: bidsCount },
    { count: purchasesCount },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('bids')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('purchase_orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
  ])

  // 待处理徽标计数
  const [
    { count: pendingOrders },
    { count: pendingBids },
    { count: pendingPurchases },
    { count: unreadMessages },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['open', 'in_progress']),
    supabase
      .from('bids')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'pending'),
    supabase
      .from('purchase_orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['pending', 'paid']),
    supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false),
  ])

  return (
    <main className="pb-12">
      <Container size="lg" className="pt-6">
        {/* 面包屑 */}
        <nav
          className="mb-4 flex items-center gap-1.5 text-xs text-ink-tertiary"
          aria-label="面包屑"
        >
          <Link href="/" className="hover:text-primary">
            首页
          </Link>
          <span>/</span>
          <span className="text-ink-secondary">我的</span>
        </nav>

        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-primary sm:text-3xl">
            我的中心
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            管理个人资料、参与记录与企业资料
          </p>
        </div>

        <AuthGuard>
          <MineContent
            profile={profile}
            company={company}
            stats={{
              orders: ordersCount || 0,
              bids: bidsCount || 0,
              purchases: purchasesCount || 0,
              views: 0,
            }}
            badges={{
              pendingOrders: pendingOrders || 0,
              pendingBids: pendingBids || 0,
              pendingPurchases: pendingPurchases || 0,
              unreadMessages: unreadMessages || 0,
            }}
          />
        </AuthGuard>
      </Container>
    </main>
  )
}
