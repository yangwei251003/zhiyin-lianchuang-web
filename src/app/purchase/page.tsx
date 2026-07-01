import type { Metadata } from 'next'
import Link from 'next/link'
import { History, Package, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { PurchaseList } from '@/components/purchase/PurchaseList'
import { PurchaseDashboard } from '@/components/purchase/PurchaseDashboard'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '集采商城 · 智印联创',
  description: '汇集印刷耗材联合集采活动，拼团更低价格，让采购更省钱。',
}

type PurchaseRow = Database['public']['Tables']['purchases']['Row']

const PAGE_SIZE = 10

interface PurchasePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// 集采商城列表页（服务端组件）
// 筛选/分页通过 URL searchParams 驱动：服务端读取参数重新查询
export default async function PurchasePage({
  searchParams,
}: PurchasePageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const status = params.status || 'all'
  const keyword = (params.keyword || '').trim()

  const supabase = await createClient()

  // 主查询：集采活动列表 + 总数
  let query = supabase
    .from('purchases')
    .select('*', { count: 'exact' })

  if (status !== 'all') query = query.eq('status', status)
  if (keyword) {
    // 标题 / 商品名模糊匹配（ilike 大小写不敏感）
    const kw = keyword.replace(/,/g, '\\,')
    query = query.or(`title.ilike.%${kw}%,product_name.ilike.%${kw}%`)
  }

  const { data: purchases, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const purchaseList = (purchases ?? []) as PurchaseRow[]

  return (
    <main className="pb-12">
      {/* ===== 页头：渐变背景 + 面包屑 + 行动入口 ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #2A6CDB 0%, #4A85E6 60%, #5B8FE8 100%)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)',
          }}
        />
        <Container className="relative py-10 sm:py-12">
          <nav
            className="mb-3 text-xs text-white/70"
            aria-label="面包屑"
          >
            <Link href="/" className="hover:text-white">
              首页
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">集采商城</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
            <Package className="h-7 w-7" />
            集采商城
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            联合集采，拼团更优惠。汇集印刷耗材集采活动，参团即享批发价
          </p>

          {/* 行动入口 */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/purchase/mine"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-primary shadow-md transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:shadow-lg"
            >
              <UserCheck className="h-4 w-4" />
              我的集采
            </Link>
            <Link
              href="/purchase/history"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-white/20"
            >
              <History className="h-4 w-4" />
              历史集采
            </Link>
          </div>
        </Container>
      </section>

      {/* ===== 列表区：筛选 + 卡片 + 分页（客户端交互） ===== */}
      <Container className="mt-6 space-y-6">
        <PurchaseDashboard />
        <PurchaseList
          initialPurchases={purchaseList}
          totalCount={count ?? 0}
          currentPage={page}
          pageSize={PAGE_SIZE}
          filters={{ status, keyword }}
        />
      </Container>
    </main>
  )
}
