import type { Metadata } from 'next'
import Link from 'next/link'
import { History, Package, UserCheck, TrendingDown, ArrowRight, PiggyBank, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { PurchaseList } from '@/components/purchase/PurchaseList'
import { PurchaseDashboard } from '@/components/purchase/PurchaseDashboard'
import { PageHeader } from '@/components/layout/PageHeader'
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
    <main className="pb-12 bg-slate-50 min-h-screen">
      {/* ===== 页头 ===== */}
      <PageHeader
        title="集采商城"
        subtitle="Purchase Mall · Centralized Procurement"
        desc="联合集采，拼团更优惠。汇集印刷耗材集采活动，参团即享批发价，平均降本 8-15%"
        theme="green"
        badge="联合集采降本"
        icon={<Package className="h-3.5 w-3.5" />}
        breadcrumbs={[{ label: '首页', href: '/' }, { label: '集采商城' }]}
        stats={[
          { value: String(count ?? 0), label: '活跃集采项目' },
        ]}
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/purchase/mine"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-primary shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <UserCheck className="h-4 w-4" />
              我的集采
            </Link>
            <Link
              href="/purchase/history"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              <History className="h-4 w-4" />
              历史集采
            </Link>
          </div>
        }
      />

      {/* ===== 列表区 ===== */}
      <Container className="mt-6 space-y-6">
        
        {/* 新增：集采降本联盟战报 */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <PiggyBank className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-3xs text-slate-400">已为联盟成员累计节省</span>
              <span className="text-lg font-bold text-slate-800">¥241,850 <span className="text-3xs font-normal text-slate-400">元</span></span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-3xs text-slate-400">首期拼团降本比例</span>
              <span className="text-lg font-bold text-slate-800">低于均价 11.8% <span className="text-3xs font-normal text-slate-400">(以量换价)</span></span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-3xs text-slate-400">联盟集采累计总量</span>
              <span className="text-lg font-bold text-slate-800">1,840 <span className="text-3xs font-normal text-slate-400">吨 (纸张/耗材)</span></span>
            </div>
          </div>
        </section>

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
