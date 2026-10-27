import { cn } from '@/lib/utils'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  label?: string
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-[3px]',
  lg: 'h-8 w-8 border-4',
}

// 高级旋转环，结合品牌色展现极致的加载动效
export function Spinner({ size = 'md', className, label = '加载中' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-flex flex-col items-center justify-center gap-2 select-none', className)}
    >
      <span
        className={cn(
          'animate-spin rounded-full border-t-primary border-r-primary border-b-transparent border-l-transparent',
          sizeMap[size]
        )}
        style={{ borderStyle: 'solid' }}
      />
      {label && <span className="text-2xs text-ink-tertiary font-medium">{label}</span>}
    </span>
  )
}

