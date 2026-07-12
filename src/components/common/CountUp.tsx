import { cn } from '@/lib/utils'

export interface CountUpProps {
  end: number
  start?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: boolean
  className?: string
}

function formatNumber(value: number, decimals: number, separator: boolean): string {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: separator,
  })
}

// Stable display avoids client-only counters changing layout or SSR output.
export function CountUp({
  end,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = false,
  className,
}: CountUpProps) {
  return <span className={cn('tabular-nums', className)}>{prefix}{formatNumber(end, decimals, separator)}{suffix}</span>
}
