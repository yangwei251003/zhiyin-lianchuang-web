import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Factory, Plus, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { OrderList } from '@/components/order/OrderList'
import { ShowcaseRail } from '@/components/common/ShowcaseRail'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '订单大厅 · 智印联创',
  description: '浏览公开印刷需求，提交需求或产能信息后与平台及合作方沟通。',
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
    <main className="min-h-screen bg-gradient-to-b from-[#07152d] via-[#0d1b3a] to-[#07152d] pb-12">
      <section className="relative overflow-hidden border-b border-cyan-300/20 bg-[#07152d]">
        <Image src="/images/external/press-studio.jpg" alt="创意工作室内的传统印刷设备与海报" fill priority className="object-cover opacity-25" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(7,21,45,.98),rgba(7,21,45,.84),rgba(7,21,45,.65))]" />
        <Container className="relative py-8 sm:py-10">
          <nav className="mb-4 text-xs text-slate-400" aria-label="面包屑">
            <Link href="/" className="hover:text-cyan-200">首页</Link>
            <span className="mx-1.5">/</span>
            <span className="text-slate-200">订单大厅</span>
          </nav>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-cyan-300">01 / 供需撮合</p>
              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">订单大厅</h1>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                浏览已公开的印刷需求。提交需求或产能信息后，平台将协助供需双方进行报价沟通；实际合作条款由双方确认。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/orders/publish"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                发布需求
              </Link>
              <Link
                href="/orders/publish-capacity"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Factory className="h-4 w-4" />
                发布产能
              </Link>
              <Link
                href="/orders/capacities"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <ShoppingBag className="h-4 w-4" />
                查看产能
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="mt-6">
        <OrderList
          initialOrders={ordersWithCount}
          totalCount={count ?? 0}
          currentPage={page}
          pageSize={PAGE_SIZE}
          filters={{ status, category, keyword }}
        />
        <ShowcaseRail module="orders" title="公开需求案例信号台" />
      </Container>
    </main>
  )
}
