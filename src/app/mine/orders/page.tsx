import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/guard'
import { Container } from '@/components/layout/Container'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { MyOrdersList } from '@/components/order/MyOrdersList'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '我的订单 · 智印联创',
  description: '管理我发布的全部印刷需求订单。',
}

type OrderRow = Database['public']['Tables']['orders']['Row']

const PAGE_SIZE = 10

interface MyOrdersPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// 我的订单页（服务端组件）
// requireAuth 取当前用户，查询其发布的订单；状态/分页通过 searchParams 驱动
export default async function MyOrdersPage({
  searchParams,
}: MyOrdersPageProps) {
  const session = await requireAuth()
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const status = params.status || 'all'

  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('user_id', session.user.id)

  if (status !== 'all') query = query.eq('status', status)

  const { data: orders, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const orderList = (orders ?? []) as OrderRow[]

  return (
    <main className="pb-12">
      <Container size="lg" className="pt-6">
        {/* 面包屑 + 标题 */}
        <nav
          className="mb-3 flex items-center gap-1.5 text-xs text-ink-tertiary"
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
          <span className="text-ink-secondary">我的订单</span>
        </nav>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink-primary sm:text-3xl">
              我的订单
            </h1>
            <p className="mt-2 text-sm text-ink-secondary">
              管理我发布的全部印刷需求
            </p>
          </div>
          <Link
            href="/orders/publish"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-white shadow-sm transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-primary-light"
          >
            <Plus className="h-4 w-4" />
            发布订单
          </Link>
        </div>

        <AuthGuard>
          <MyOrdersList
            initialOrders={orderList}
            totalCount={count ?? 0}
            currentPage={page}
            pageSize={PAGE_SIZE}
            currentStatus={status}
          />
        </AuthGuard>
      </Container>
    </main>
  )
}
