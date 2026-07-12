import type { Metadata } from 'next'
import Link from 'next/link'
import { History } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { PurchaseCard } from '@/components/purchase/PurchaseCard'
import { EmptyState } from '@/components/common/EmptyState'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '采购信息归档 · 智印联创',
  description: '查看已停止收集采购意向的公开信息。',
}

type PurchaseRow = Database['public']['Tables']['purchases']['Row']

// 单页最多展示条数（历史归档，不分页，避免一次加载过多）
const HISTORY_LIMIT = 60

// 集采历史页（服务端组件）
// 获取所有已结束的集采活动，按 end_time DESC 排序
export default async function PurchaseHistoryPage() {
  const supabase = await createClient()

  const { data: purchases } = await supabase
    .from('purchases')
    .select('*')
    .eq('status', 'ended')
    .order('end_time', { ascending: false })
    .limit(HISTORY_LIMIT)

  const historyList = (purchases ?? []) as PurchaseRow[]
  const hasHistory = historyList.length > 0

  return (
    <main className="pb-12">
      <section className="border-b-2 border-line bg-white">
        <Container className="py-8 sm:py-10">
          <nav
            className="mb-4 text-xs text-ink-tertiary"
            aria-label="面包屑"
          >
            <Link href="/" className="hover:text-primary">
              首页
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/purchase" className="hover:text-primary">
              集采商城
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink-secondary">采购信息归档</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-ink-primary sm:text-3xl">
            <History className="h-7 w-7 text-primary" />
            采购信息归档
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-secondary">
            这里保留已停止收集的公开采购信息，仅供回顾需求说明，不代表可继续提交或达成交易。
          </p>
        </Container>
      </section>

      {/* ===== 列表区 ===== */}
      <Container className="mt-6">
        {hasHistory ? (
          <>
            <div className="mb-4 flex items-center justify-between text-xs text-ink-tertiary">
              <span>
                共{' '}
                <span className="font-semibold text-ink-secondary">
                  {historyList.length}
                </span>{' '}
                条归档信息
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {historyList.map((purchase) => (
                <PurchaseCard
                  key={purchase.id}
                  purchase={purchase}
                  readOnly
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-line bg-white">
            <EmptyState
              title="暂无归档采购信息"
              description="已停止收集的采购信息会在这里保留记录"
              action={
                <Link
                  href="/purchase"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-white shadow-sm transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-primary-light"
                >
                  前往集采商城
                </Link>
              }
            />
          </div>
        )}
      </Container>
    </main>
  )
}
