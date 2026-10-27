import { cn } from '@/lib/utils'

export type CardPadding = 'none' | 'sm' | 'md' | 'lg'
export type CardVariant = 'default' | 'elevated'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: CardPadding
  variant?: CardVariant
}

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-6 sm:p-8',
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-line shadow-sm',
  elevated: 'bg-white border border-line/80 shadow-md hover:shadow-xl',
}

// 卡片容器：圆角、阴影、边框，可选 hover 浮起效果
export function Card({
  hover = false,
  padding = 'md',
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-sm transition-colors duration-fast ease-out',
        variantStyles[variant],
        hover &&
          'cursor-pointer hover:-translate-y-1 hover:shadow-lg',
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

