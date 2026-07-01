import { cn } from '@/lib/utils'

export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: CardPadding
}

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

// 卡片容器：圆角、阴影、边框，可选 hover 浮起效果
export function Card({
  hover = false,
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-canvas-card rounded-lg border border-line shadow-sm transition-all duration-base ease-out-expo',
        hover &&
          'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg',
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
