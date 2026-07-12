'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface PurchaseCountdownProps {
  endTime: string | Date
  onEnd?: () => void
  className?: string
}

interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
}

const ZERO: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 }

function getRemaining(end: number): Remaining {
  const diff = end - Date.now()
  if (diff <= 0) return { ...ZERO }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    totalMs: diff,
  }
}

// 集采倒计时：每秒刷新，剩余时间颜色随紧迫程度变化
export function PurchaseCountdown({
  endTime,
  onEnd,
  className,
}: PurchaseCountdownProps) {
  const endMs = new Date(endTime).getTime()
  // 服务端与客户端均从 ZERO 开始，避免 Hydration mismatch
  const [remaining, setRemaining] = useState<Remaining>(ZERO)
  const [expired, setExpired] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false) // 客户端 mount 标志
  const onEndRef = useRef(onEnd)
  const endedRef = useRef(false)

  useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  useEffect(() => {
    // 仅在客户端（mount后）运行，彻底避免 Hydration mismatch
    setMounted(true)

    if (Number.isNaN(endMs)) {
      setExpired(true)
      return
    }

    const tick = () => {
      const next = getRemaining(endMs)
      if (next.totalMs <= 0) {
        setRemaining(ZERO)
        setExpired(true)
        if (!endedRef.current) {
          endedRef.current = true
          onEndRef.current?.()
        }
        return false
      }
      setRemaining(next)
      return true
    }

    // 立即执行一次，避免首帧显示 0
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [endMs])

  // 颜色：>24h 蓝 / 1~24h 橙 / <1h 红
  const urgencyColor =
    remaining.totalMs < 3_600_000
      ? 'text-danger'
      : remaining.totalMs < 86_400_000
        ? 'text-warning'
        : 'text-primary'

  const cellColor =
    remaining.totalMs < 3_600_000
      ? 'bg-danger-bg'
      : remaining.totalMs < 86_400_000
        ? 'bg-warning-bg'
        : 'bg-canvas'

  if (expired) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-md bg-canvas px-3 py-1.5 text-sm font-medium text-ink-tertiary',
          className,
        )}
        role="timer"
        aria-live="polite"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-ink-tertiary" aria-hidden />
        已结束
      </div>
    )
  }

  const cells: { value: number; label: string }[] = [
    { value: remaining.days, label: '天' },
    { value: remaining.hours, label: '时' },
    { value: remaining.minutes, label: '分' },
    { value: remaining.seconds, label: '秒' },
  ]

  // 挂载前显示骨架，避免 00:00:00 初始闪烁
  if (!mounted) {
    return (
      <div className={cn('inline-flex items-end gap-1.5', className)} role="timer">
        <span className="mr-1 text-xs text-ink-tertiary">剩余</span>
        {['天', '时', '分', '秒'].map((label, idx) => (
          <div key={label} className="flex items-end gap-1.5">
            <div className="flex min-w-[2.25rem] flex-col items-center rounded-md bg-canvas px-1.5 py-1">
              <span className="text-lg font-bold tabular-nums leading-none text-primary">--</span>
              <span className="mt-0.5 text-2xs text-ink-tertiary">{label}</span>
            </div>
            {idx < 3 && <span className="pb-1 text-sm font-bold text-primary">:</span>}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('inline-flex items-end gap-1.5', className)}
      role="timer"
      aria-live="polite"
      aria-label={`剩余 ${remaining.days} 天 ${remaining.hours} 时 ${remaining.minutes} 分 ${remaining.seconds} 秒`}
    >
      <span className="mr-1 text-xs text-ink-tertiary">剩余</span>
      {cells.map((cell, idx) => (
        <div key={cell.label} className="flex items-end gap-1.5">
          <div
            className={cn(
              'flex min-w-[2.25rem] flex-col items-center rounded-md px-1.5 py-1',
              cellColor,
            )}
          >
            <span
              className={cn(
                'text-lg font-bold tabular-nums leading-none',
                urgencyColor,
              )}
            >
              {String(cell.value).padStart(2, '0')}
            </span>
            <span className="mt-0.5 text-2xs text-ink-tertiary">
              {cell.label}
            </span>
          </div>
          {idx < cells.length - 1 && (
            <span className={cn('pb-1 text-sm font-bold', urgencyColor)}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
