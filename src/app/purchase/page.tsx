import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ClipboardList, History, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { PurchaseList } from '@/components/purchase/PurchaseList'
import { ShowcaseRail } from '@/components/common/ShowcaseRail'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '集采商城 · 智印联创',
  description: '收集印刷耗材采购意向，促进需求方、供货方的采购沟通。',
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
    <main className="min-h-screen bg-gradient-to-b from-[#07152d] via-[#0d1b3a] to-[#07152d] pb-12">
      <section className="relative overflow-hidden border-b border-fuchsia-300/20 bg-[#07152d]">
        <Image src="/images/external/press-production.png" alt="正在运行的工业印刷设备细节" fill priority className="object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(7,21,45,.98),rgba(13,27,58,.9),rgba(7,21,45,.65))]" />
        <Container className="relative py-8 sm:py-10">
          <nav className="mb-4 text-xs text-slate-400" aria-label="面包屑">
            <Link href="/" className="hover:text-cyan-200">首页</Link>
            <span className="mx-1.5">/</span>
            <span className="text-slate-200">集采商城</span>
          </nav>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-fuchsia-300">02 / 采购意向撮合</p>
              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">集采商城</h1>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                收集印刷耗材采购意向，帮助有相近需求的企业与供货方建立联系。本站不提供在线支付，价格、供货与交付以双方后续沟通确认为准。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/purchase/mine"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-400 to-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                <UserCheck className="h-4 w-4" />
                我的意向
              </Link>
              <Link
                href="/purchase/history"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <History className="h-4 w-4" />
                已归档活动
              </Link>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 border-l-2 border-fuchsia-300 bg-white/10 px-3 py-2 text-xs leading-5 text-slate-200 backdrop-blur-sm">
            <ClipboardList className="h-4 w-4 shrink-0 text-cyan-300" />
            仅展示经过平台审核后公开的采购信息；意向提交不构成交易、付款或供货承诺。
          </div>
        </Container>
      </section>

      <Container className="mt-6">
        <PurchaseList
          initialPurchases={purchaseList}
          totalCount={count ?? 0}
          currentPage={page}
          pageSize={PAGE_SIZE}
          filters={{ status, keyword }}
        />
        <ShowcaseRail module="purchase" title="材料光谱与品类参考" />
      </Container>
    </main>
  )
}
