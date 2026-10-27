import { cn } from '@/lib/utils'

// 骨架屏占位组件，配合 animate-pulse 实现加载占位
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-line', className)} />
}
