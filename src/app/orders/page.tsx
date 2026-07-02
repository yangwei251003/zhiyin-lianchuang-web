import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Factory, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { OrderList } from '@/components/order/OrderList'
import { PageHeader } from '@/components/layout/PageHeader'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '订单大厅 · 智印联创',
  description: '汇集全网印刷需求，在线投标接单，AI智能撮合，让产能变现更高效。',
}

type OrderRow = Database['public']['Tables']['orders']['Row']

const PAGE_SIZE = 10

interface OrdersPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// 订单大厅列表页（服务端组件）
// 筛选/分页通过 URL searchParams 驱动：服务端读取参数重新查询
export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const status = params.status || 'all'
  const category = params.category || 'all'
  const keyword = (params.keyword || '').trim()

  const supabase = await createClient()

  // 主查询：订单列表 + 总数
  let ordersQuery = supabase
    .from('orders')
    .select('*', { count: 'exact' })

  if (status !== 'all') ordersQuery = ordersQuery.eq('status', status)
  if (category !== 'all') ordersQuery = ordersQuery.eq('category', category)
  if (keyword) {
    // 标题 / 描述模糊匹配（ilike 大小写不敏感）
    const kw = keyword.replace(/,/g, '\\,')
    ordersQuery = ordersQuery.or(
      `title.ilike.%${kw}%,description.ilike.%${kw}%`,
    )
  }

  const { data: orders, count } = await ordersQuery
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const orderList = orders ?? []

  // 批量查询当前页订单的报价数（避免 N+1）
  const orderIds = orderList.map((o) => o.id)
  const bidCountMap = new Map<string, number>()
  if (orderIds.length > 0) {
    const { data: bids } = await supabase
      .from('bids')
      .select('order_id')
      .in('order_id', orderIds)
    for (const b of bids ?? []) {
      bidCountMap.set(
        b.order_id,
        (bidCountMap.get(b.order_id) ?? 0) + 1,
      )
    }
  }

  const ordersWithCount: (OrderRow & { bid_count: number })[] =
    orderList.map((o) => ({
      ...o,
      bid_count: bidCountMap.get(o.id) ?? 0,
    }))

  return (
    <main className="pb-12">
      {/* ===== 页头：企业级工业风格 ===== */}
      <PageHeader
        title="订单大厅"
        subtitle="Order Hall · AI Smart Matching"
        desc="汇集全网印刷需求，AI 智能撮合，在线投标接单，让产能变现更高效"
        theme="blue"
        badge="AI 智能撮合"
        icon={<ShoppingBag className="h-3.5 w-3.5" />}
        breadcrumbs={[{ label: '首页', href: '/' }, { label: '订单大厅' }]}
        stats={[
          { value: String(count ?? 0), label: '当前订单' },
        ]}
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/orders/publish"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-primary shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              发布订单
            </Link>
            <Link
              href="/orders/publish-capacity"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              <Factory className="h-4 w-4" />
              发布产能
            </Link>
            <Link
              href="/orders/capacities"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              查看产能
            </Link>
          </div>
        }
      />

      {/* ===== 列表区：筛选 + 卡片 + 分页（客户端交互） ===== */}
      <Container className="mt-6">
        <OrderList
          initialOrders={ordersWithCount}
          totalCount={count ?? 0}
          currentPage={page}
          pageSize={PAGE_SIZE}
          filters={{ status, category, keyword }}
        />
      </Container>
    </main>
  )
}
