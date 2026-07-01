import { cn } from '@/lib/utils'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
}

// 页面内容容器：统一水平边距与最大宽度
export function Container({
  size = 'xl',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
