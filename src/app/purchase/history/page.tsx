import type { Metadata } from 'next'
import Link from 'next/link'
import { History } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { PurchaseCard } from '@/components/purchase/PurchaseCard'
import { EmptyState } from '@/components/common/EmptyState'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '集采历史 · 智印联创',
  description: '查看已结束的集采活动历史记录。',
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
      {/* ===== 页头 ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #1E293B 0%, #334155 60%, #475569 100%)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
          }}
        />
        <Container className="relative py-10 sm:py-12">
          <nav
            className="mb-3 text-xs text-white/60"
            aria-label="面包屑"
          >
            <Link href="/" className="hover:text-white">
              首页
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/purchase" className="hover:text-white">
              集采商城
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">集采历史</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
            <History className="h-7 w-7" />
            集采历史
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
            回顾已结束的集采活动，了解历史价格与成团情况
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
                条历史记录
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
          <div className="rounded-xl border border-line bg-white shadow-sm">
            <EmptyState
              title="暂无历史集采活动"
              description="已结束的集采活动将展示在此处"
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
