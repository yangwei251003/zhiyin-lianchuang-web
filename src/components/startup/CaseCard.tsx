'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Lightbulb, TrendingUp, Wallet } from 'lucide-react'
import type { Database } from '@/types/database'
import { CountUp } from '@/components/common/CountUp'
import { cn } from '@/lib/utils'

type CaseRow = Database['public']['Tables']['cases']['Row']

export interface CaseCardProps {
  caseItem: CaseRow
  className?: string
}

// 创业案例卡片：封面 + 行业标签 + 标题 + 摘要 + 投资金额 + 营收（CountUp 动画）
// 卡片可点击跳转详情，hover 浮起
export function CaseCard({ caseItem, className }: CaseCardProps) {
  const router = useRouter()
  const detailHref = `/startup/cases/${caseItem.id}`

  const handleClick = () => router.push(detailHref)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      router.push(detailHref)
    }
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-canvas-card shadow-sm',
        'cursor-pointer transition-all duration-base ease-out-expo',
        'hover:-translate-y-1 hover:shadow-lg hover:border-society/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-society/40',
        className,
      )}
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* 封面图 + 行业标签 */}
      <div className="relative h-40 w-full overflow-hidden bg-canvas sm:h-44">
        {caseItem.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={caseItem.cover_image}
            alt={caseItem.title}
            className="h-full w-full object-cover transition-transform duration-slow ease-out-expo group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                'linear-gradient(135deg, #FFF5ED 0%, #FEF9F5 50%, #FFF5ED 100%)',
            }}
          >
            <Lightbulb
              className="h-12 w-12 text-society/40"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-2xs font-medium text-society backdrop-blur-sm">
          {caseItem.industry}
        </span>
        {/* 左侧主色条 */}
        <div
          className="absolute left-0 top-0 h-full w-1.5 bg-society"
          aria-hidden
        />
      </div>

      {/* 内容区 */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink-primary transition-colors group-hover:text-society">
          {caseItem.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-ink-secondary">
          {caseItem.summary}
        </p>

        {/* 投资金额 + 营收（CountUp 动画） */}
        <div className="mt-1 grid grid-cols-2 gap-2 border-t border-line-light pt-3">
          <div>
            <p className="flex items-center gap-0.5 text-2xs text-ink-tertiary">
              <Wallet className="h-3 w-3" />
              投资金额
            </p>
            <p className="mt-0.5 text-lg font-bold text-ink-primary">
              <CountUp
                end={caseItem.investment_amount}
                duration={1500}
                suffix=" 万"
              />
            </p>
          </div>
          <div>
            <p className="flex items-center gap-0.5 text-2xs text-ink-tertiary">
              <TrendingUp className="h-3 w-3" />
              年营收
            </p>
            <p className="mt-0.5 text-lg font-bold text-society">
              <CountUp
                end={caseItem.revenue}
                duration={1500}
                suffix=" 万"
              />
            </p>
          </div>
        </div>

        {/* 查看详情 */}
        <div className="mt-1 flex items-center justify-end text-xs font-medium text-society transition-all duration-base ease-out-expo group-hover:gap-2">
          <span className="inline-flex items-center gap-1">
            查看详情
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  )
}
