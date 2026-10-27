'use client'

import { forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

// 原生 select 封装：支持 label、错误提示、options、placeholder
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, error, hint, options, placeholder, className, id, ...props },
    ref,
  ) {
    const generatedId = useId()
    const selectId = id ?? generatedId
    const hintId = `${selectId}-hint`
    const errorId = `${selectId}-error`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-ink-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              'h-10 w-full appearance-none rounded-md border bg-white px-3 pr-9 text-sm text-ink-primary',
              'transition-all duration-fast ease-out-expo',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
              'disabled:opacity-50 disabled:bg-canvas',
              error
                ? 'border-danger focus:border-danger focus:ring-danger/20'
                : 'border-line',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-tertiary" />
        </div>
        {error ? (
          <p id={errorId} className="mt-1 text-xs text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="mt-1 text-xs text-ink-tertiary">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)
