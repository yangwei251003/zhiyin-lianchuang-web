'use client'

import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'premium'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    'border border-primary bg-primary text-white hover:border-primary-dark hover:bg-primary-dark',
  secondary:
    'border border-primary/40 bg-white text-primary hover:bg-primary-bg',
  outline:
    'border border-line bg-transparent text-ink-primary hover:border-primary/50 hover:bg-canvas',
  ghost: 'bg-transparent text-ink-primary hover:bg-canvas',
  destructive:
    'border border-danger bg-danger text-white hover:brightness-95',
  success:
    'border border-success bg-success text-white hover:bg-success-light',
  warning:
    'border border-warning bg-warning text-white hover:brightness-95',
  premium:
    'border border-primary-dark bg-primary-deep text-white hover:bg-primary-dark',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-sm gap-1',
  md: 'h-10 px-4 text-sm rounded-sm gap-1.5',
  lg: 'h-12 px-6 text-base rounded-sm gap-2',
  icon: 'h-10 w-10 rounded-sm',
}

// 按钮组件：支持多种样式与尺寸、加载态、左右图标
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'default',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-colors duration-fast select-none cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1',
          'disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  },
)
