'use client'

import { useRouter } from 'next/navigation'
import { CalendarClock, Package } from 'lucide-react'
import type { Database } from '@/types/database'
import { Badge } from '@/components/ui/Badge'
import {
  PURCHASE_STATUS_LABEL,
  PURCHASE_STATUS_VARIANT,
  PURCHASE_STATUS_BAR,
} from '@/lib/purchase-config'
import { cn } from '@/lib/utils'

type PurchaseRow = Database['public']['Tables']['purchases']['Row']

export interface PurchaseCardProps {
  purchase: PurchaseRow
  className?: string
  /** 历史页使用，显示已归档状态，卡片仍可打开详情 */
  readOnly?: boolean
}

// 采购意向卡片：只呈现已公开的物资与需求描述，不推断价格、销量或成团结果。
export function PurchaseCard({
  purchase,
  className,
  readOnly = false,
}: PurchaseCardProps) {
  const router = useRouter()
  const statusVariant =
    PURCHASE_STATUS_VARIANT[purchase.status] ?? 'default'
  const statusLabel = PURCHASE_STATUS_LABEL[purchase.status] ?? purchase.status
  const statusBar = PURCHASE_STATUS_BAR[purchase.status] ?? 'bg-ink-tertiary'
  const detailHref = `/purchase/${purchase.id}`

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
        'group relative flex overflow-hidden rounded-lg border border-line bg-white',
        'cursor-pointer transition-colors duration-fast',
        'hover:border-primary/50 hover:bg-primary-bg-subtle/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        className,
      )}
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={cn('w-1.5 shrink-0', statusBar)} aria-hidden />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-canvas text-primary">
              <Package className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs text-ink-tertiary">{purchase.product_name}</p>
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink-primary transition-colors group-hover:text-primary">
                {purchase.title}
              </h3>
            </div>
          </div>
          <Badge variant={statusVariant} size="sm">{readOnly ? '已归档' : statusLabel}</Badge>
        </div>
        {purchase.description && (
          <p className="line-clamp-3 text-sm leading-6 text-ink-secondary">{purchase.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-line-light pt-3 text-xs text-ink-tertiary">
          <span className="inline-flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" />
            信息截止 {new Date(purchase.end_time).toLocaleDateString('zh-CN')}
          </span>
          <span className="font-medium text-primary">查看详情</span>
        </div>
      </div>
    </article>
  )
}
