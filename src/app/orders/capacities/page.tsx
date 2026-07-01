import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { CapacityList } from '@/components/order/CapacityList'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '产能大厅 · 智印联创',
  description: '浏览印刷设备产能，快速匹配闲置产能接单。',
}

type CapacityRow = Database['public']['Tables']['capacities']['Row']

const PAGE_SIZE = 12

interface CapacitiesPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// 产能列表页（服务端组件）
// 筛选/分页通过 URL searchParams 驱动
export default async function CapacitiesPage({
  searchParams,
}: CapacitiesPageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const deviceType = params.device_type || 'all'
  const region = params.region || 'all'
  const status = params.status || 'all'

  const supabase = await createClient()

  let query = supabase
    .from('capacities')
    .select('*', { count: 'exact' })

  if (deviceType !== 'all')
    query = query.eq('device_type', deviceType)
  if (region !== 'all') query = query.eq('region', region)
  if (status !== 'all') query = query.eq('status', status)

  const { data: capacities, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const capacityList = (capacities ?? []) as CapacityRow[]

  return (
    <main className="pb-12">
      {/* ===== 页头 ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #2BAE6E 0%, #4ECB9E 60%, #5BD4AD 100%)',
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
            <Link href="/orders" className="hover:text-white">
              订单大厅
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">产能大厅</span>
          </nav>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            产能大厅
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            汇集全网印刷设备产能，闲置产能一键发布、精准撮合
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/orders/publish-capacity"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-success shadow-md transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              发布产能
            </Link>
            <Link
              href="/orders"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-white/20"
            >
              查看订单需求
            </Link>
          </div>
        </Container>
      </section>

      <Container className="mt-6">
        <CapacityList
          initialCapacities={capacityList}
          totalCount={count ?? 0}
          currentPage={page}
          pageSize={PAGE_SIZE}
          filters={{ deviceType, region, status }}
        />
      </Container>
    </main>
  )
}
