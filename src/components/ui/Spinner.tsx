import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  label?: string
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

// 加载旋转图标，配合品牌色展示加载状态
export function Spinner({ size = 'md', className, label = '加载中' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <Loader2 className={cn('animate-spin text-primary', sizeMap[size])} />
    </span>
  )
}
