'use client'

import { useEffect, useState } from 'react'
import { Brain, Lightbulb, Sparkles, TrendingUp } from 'lucide-react'
import type { Database } from '@/types/database'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

type PurchaseRow = Database['public']['Tables']['purchases']['Row']

export interface AIPurchaseAdviceProps {
  purchase: PurchaseRow
}

// AI 建议类型
type AdviceAction = 'buy' | 'wait' | 'ended'

interface AdviceResult {
  action: AdviceAction
  title: string
  reason: string
  confidence: number // 0~100
}

interface APIResponse {
  action?: AdviceAction
  title?: string
  reason?: string
  confidence?: number
}

// 结构化兜底建议：根据进度/剩余时间/状态生成
function buildFallbackAdvice(purchase: PurchaseRow): AdviceResult {
  if (purchase.status !== 'active') {
    return {
      action: 'ended',
      title: '活动已结束',
      reason: '该集采活动已不可参团，建议关注后续新品集采。',
      confidence: 100,
    }
  }

  const endMs = new Date(purchase.end_time).getTime()
  const remainMs = endMs - Date.now()
  const remainHours = remainMs / 3_600_000
  const target = Math.max(1, purchase.target_quantity)
  const progress = (purchase.current_quantity / target) * 100

  // 进度高 + 时间紧 → 强烈建议采购（即将成团）
  if (progress >= 80) {
    return {
      action: 'buy',
      title: '建议立即采购',
      reason: `集采进度已达 ${progress.toFixed(0)}%，即将达成目标量，成团确定性高，建议尽快参团锁定批发价。`,
      confidence: 92,
    }
  }

  // 时间紧 + 进度低 → 观望（成团风险高）
  if (remainHours < 24 && progress < 50) {
    return {
      action: 'wait',
      title: '建议观望',
      reason: `活动剩余时间不足 24 小时，当前进度仅 ${progress.toFixed(0)}%，达成目标量存在风险，建议等待下一期活动。`,
      confidence: 68,
    }
  }

  // 进度低 → 观望
  if (progress < 30) {
    return {
      action: 'wait',
      title: '建议观望',
      reason: `当前集采进度较低（${progress.toFixed(0)}%），成团尚有不确定性，可观察后续参团趋势再决定。`,
      confidence: 60,
    }
  }

  // 默认：建议采购
  return {
    action: 'buy',
    title: '建议采购',
    reason: `集采进度 ${progress.toFixed(0)}%，价格优于市场零售，参团可享批量优惠，性价比良好。`,
    confidence: 78,
  }
}

const actionConfig: Record<
  AdviceAction,
  { label: string; gradient: string; iconBg: string; text: string }
> = {
  buy: {
    label: '建议采购',
    gradient: 'from-success to-success-light',
    iconBg: 'bg-white/20',
    text: 'text-white',
  },
  wait: {
    label: '建议观望',
    gradient: 'from-warning to-accent-light',
    iconBg: 'bg-white/20',
    text: 'text-white',
  },
  ended: {
    label: '已结束',
    gradient: 'from-ink-tertiary to-ink-disabled',
    iconBg: 'bg-white/20',
    text: 'text-white',
  },
}

// AI 采购建议组件
// 优先调用 /api/ai/purchase_advice 接口，失败则用结构化兜底文案
export function AIPurchaseAdvice({ purchase }: AIPurchaseAdviceProps) {
  const [advice, setAdvice] = useState<AdviceResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchAdvice = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/ai/purchase_advice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            purchase_id: purchase.id,
            unit_price: purchase.unit_price,
            min_quantity: purchase.min_quantity,
            target_quantity: purchase.target_quantity,
            current_quantity: purchase.current_quantity,
            end_time: purchase.end_time,
            status: purchase.status,
          }),
        })
        if (!res.ok) throw new Error('接口不可用')
        const data: APIResponse = await res.json()
        if (cancelled) return
        if (data.action && data.reason) {
          setAdvice({
            action: data.action,
            title: data.title ?? actionConfig[data.action].label,
            reason: data.reason,
            confidence: typeof data.confidence === 'number' ? data.confidence : 80,
          })
        } else {
          setAdvice(buildFallbackAdvice(purchase))
        }
      } catch {
        if (cancelled) return
        // 兜底：结构化建议
        setAdvice(buildFallbackAdvice(purchase))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void fetchAdvice()
    return () => {
      cancelled = true
    }
  }, [purchase])

  if (loading || !advice) {
    return (
      <Card padding="lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold text-ink-primary">AI 采购建议</h3>
        </div>
        <div className="mt-4 space-y-2.5">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    )
  }

  const config = actionConfig[advice.action]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-gradient-to-br p-5 shadow-md',
        config.gradient,
      )}
    >
      {/* 装饰光晕 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/5"
      />

      <div className="relative">
        {/* 标题行 */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md',
              config.iconBg,
            )}
          >
            <Brain className="h-4 w-4 text-white" />
          </span>
          <h3 className={cn('text-base font-bold', config.text)}>
            AI 采购建议
          </h3>
          <span
            className={cn(
              'ml-auto inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-2xs font-medium',
              config.text,
            )}
          >
            置信度 {advice.confidence}%
          </span>
        </div>

        {/* 建议结论 */}
        <div className="mt-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-white" />
          <span className={cn('text-xl font-bold', config.text)}>
            {advice.title}
          </span>
        </div>

        {/* 理由 */}
        <p className={cn('mt-2 text-sm leading-relaxed text-white/90')}>
          {advice.reason}
        </p>

        {/* 底部提示 */}
        <div
          className={cn(
            'mt-4 flex items-center gap-1.5 border-t border-white/20 pt-3 text-2xs',
            config.text,
          )}
        >
          <TrendingUp className="h-3 w-3" />
          <span className="text-white/70">
            建议由 AI 基于活动进度与剩余时间综合分析，仅供参考
          </span>
        </div>
      </div>
    </div>
  )
}
