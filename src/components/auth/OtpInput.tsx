'use client'

import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (val: string) => void
  disabled?: boolean
  className?: string
}

/**
 * 6格 OTP 验证码输入组件
 * - 逐格输入，自动前进
 * - 支持粘贴（6位数字自动填充）
 * - 支持退格、左右箭头键盘导航
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const [focused, setFocused] = useState<number | null>(null)

  const digits = Array.from({ length }, (_, i) => value[i] || '')

  const update = (idx: number, char: string) => {
    const arr = digits.slice()
    arr[idx] = char
    onChange(arr.join(''))
  }

  const handleChange = (idx: number, raw: string) => {
    const char = raw.replace(/\D/g, '').slice(-1)
    update(idx, char)
    if (char && idx < length - 1) {
      refs.current[idx + 1]?.focus()
    }
  }

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        update(idx, '')
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus()
        update(idx - 1, '')
      }
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      refs.current[idx - 1]?.focus()
      e.preventDefault()
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      refs.current[idx + 1]?.focus()
      e.preventDefault()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!text) return
    onChange(text.padEnd(length, '').slice(0, length))
    const nextIdx = Math.min(text.length, length - 1)
    refs.current[nextIdx]?.focus()
  }

  return (
    <div className={cn('flex items-center justify-center gap-2 sm:gap-3', className)}>
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { refs.current[idx] = el }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`验证码第 ${idx + 1} 位`}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          onFocus={() => setFocused(idx)}
          onBlur={() => setFocused(null)}
          className={cn(
            'h-12 w-10 rounded-lg border text-center text-xl font-bold tabular-nums text-ink-primary',
            'transition-all duration-fast ease-out-expo',
            'focus:outline-none focus:ring-2',
            'sm:h-14 sm:w-12 sm:text-2xl',
            digit
              ? 'border-primary bg-primary-bg text-primary'
              : focused === idx
                ? 'border-primary bg-white ring-primary/30'
                : 'border-line bg-white',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        />
      ))}
    </div>
  )
}
