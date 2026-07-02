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
    'bg-primary text-white shadow-sm hover:bg-primary-light hover:shadow-blue hover:-translate-y-0.5',
  secondary:
    'bg-white text-primary border border-primary/30 hover:bg-primary-bg hover:-translate-y-0.5',
  outline:
    'bg-transparent text-ink-primary border border-line hover:bg-canvas hover:border-ink-tertiary',
  ghost: 'bg-transparent text-ink-primary hover:bg-canvas',
  destructive:
    'bg-danger text-white shadow-sm hover:brightness-110 hover:-translate-y-0.5',
  success:
    'bg-success text-white shadow-sm hover:bg-success-light hover:shadow-green hover:-translate-y-0.5',
  warning:
    'bg-warning text-white shadow-sm hover:brightness-110 hover:-translate-y-0.5',
  premium:
    'bg-gradient-to-r from-[#0E2040] via-[#1A5CC8] to-[#0E2040] text-white border border-white/10 shadow-lg hover:shadow-blue hover:-translate-y-0.5 btn-premium',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-sm gap-1',
  md: 'h-10 px-4 text-sm rounded-md gap-1.5',
  lg: 'h-12 px-6 text-base rounded-md gap-2',
  icon: 'h-10 w-10 rounded-md',
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
          'inline-flex items-center justify-center font-semibold transition-all duration-fast ease-out-expo select-none cursor-pointer',
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

