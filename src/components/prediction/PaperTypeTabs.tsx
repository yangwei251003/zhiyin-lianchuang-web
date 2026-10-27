'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PAPER_TYPES } from '@/lib/price-data'

export interface PaperTypeTabsProps {
  current: string
  paperTypes?: readonly string[]
}

// 纸种切换 Tabs：当前纸种高亮（primary 蓝填充），点击跳转 /prediction/[paperType]
// 移动端横向滚动，桌面端居中铺排
export function PaperTypeTabs({
  current,
  paperTypes = PAPER_TYPES,
}: PaperTypeTabsProps) {
  const router = useRouter()

  const handleClick = (paperType: string) => {
    if (paperType === current) return
    router.push(`/prediction/${encodeURIComponent(paperType)}`)
  }

  return (
    <div
      className="-mx-1 flex items-center gap-1 overflow-x-auto border-b border-[#D9DEE6] px-1"
      role="tablist"
      aria-label="纸种切换"
    >
      {paperTypes.map((paperType) => {
        const active = paperType === current
        return (
          <button
            key={paperType}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => handleClick(paperType)}
            className={cn(
              'inline-flex shrink-0 items-center border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              active
                ? 'border-[#D97706] bg-transparent text-[#173B63]'
                : 'bg-transparent text-ink-secondary hover:border-primary/30 hover:text-primary',
            )}
          >
            {paperType}
          </button>
        )
      })}
    </div>
  )
}

export interface ForecastRangeSelectorProps {
  value: number
  options?: number[]
}

// 预测天数选择器：7 / 14 / 30 天分段控件
// 通过更新 URL ?days=N 触发服务端重新切片预测数据
export function ForecastRangeSelector({
  value,
  options = [7, 14, 30],
}: ForecastRangeSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (days: number) => {
    if (days === value) return
    router.push(`${pathname}?days=${days}`)
  }

  return (
    <div
      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-canvas p-1"
      role="tablist"
      aria-label="预测天数"
    >
      {options.map((days) => {
        const active = days === value
        return (
          <button
            key={days}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => handleChange(days)}
            className={cn(
              'inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-fast ease-out-expo',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              active
                ? 'bg-white text-primary shadow-sm'
                : 'text-ink-secondary hover:text-ink-primary',
            )}
          >
            {days} 天
          </button>
        )
      })}
    </div>
  )
}
