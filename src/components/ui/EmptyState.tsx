import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

// 空状态展示：图标 + 标题 + 描述 + 可选操作按钮
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-4 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-ink-tertiary" aria-hidden>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-ink-primary">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-ink-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
