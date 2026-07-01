'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface CountUpProps {
  end: number
  start?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: boolean
  className?: string
}

// easeOutExpo 缓动：开始快、结束慢，数字滚动更自然
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

// 格式化数字：支持小数位 + 千分位分隔符
function formatNumber(
  value: number,
  decimals: number,
  separator: boolean,
): string {
  const fixed = value.toFixed(decimals)
  if (!separator) return fixed
  const [intPart, decPart] = fixed.split('.')
  const withSeparator = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart ? `${withSeparator}.${decPart}` : withSeparator
}

// 数字滚动动画：进入视口后用 requestAnimationFrame 平滑递增
export function CountUp({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = false,
  className,
}: CountUpProps) {
  const [display, setDisplay] = useState(start)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const node = elementRef.current
    if (!node) return

    // 不支持 IntersectionObserver 时直接显示终值
    if (typeof IntersectionObserver === 'undefined') {
      setDisplay(end)
      setHasAnimated(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            runAnimation()
          }
        })
      },
      { threshold: 0.3 },
    )

    observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, hasAnimated])

  const runAnimation = () => {
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      const current = start + (end - start) * eased
      setDisplay(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setDisplay(end)
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }

  // 卸载时清理 raf
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <span ref={elementRef} className={cn('tabular-nums', className)}>
      {prefix}
      {formatNumber(display, decimals, separator)}
      {suffix}
    </span>
  )
}
