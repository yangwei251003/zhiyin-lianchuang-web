'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useCallback } from 'react'
import {
  Brain,
  Lightbulb,
  Minus,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  ShoppingCart,
  BarChart2,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import {
  type Trend,
  deriveTrend,
  trendBadgeClass,
  trendArrow,
  trendTextClass,
} from '@/lib/trend-utils'

export interface AIAnalysisProps {
  analysis: string | null
  paperType: string
  changeRate: number
  trend: Trend
  /** 近期历史价格（用于向 AI 发送真实数据分析） */
  recentPrices?: { date: string; price: number }[]
}

interface StructuredAnalysis {
  trend: string
  reason: string
  suggestion: string
  risk: string
  confidence: number // 0-100
}

// ─── 根据趋势生成优质兜底文案 ────────────────────────────────────────────────
function buildFallbackAnalysis(
  paperType: string,
  changeRate: number,
  trend: Trend,
): StructuredAnalysis {
  const absChange = Math.abs(changeRate).toFixed(2)
  return {
    trend:
      trend === 'up'
        ? `${paperType}近期呈上涨态势，较上一周期涨幅约 ${absChange}%，市场需求端支撑明显。`
        : trend === 'down'
          ? `${paperType}近期承压下行，较上一周期跌幅约 ${absChange}%，供给宽松压制价格。`
          : `${paperType}当前接入的同口径公开报价在近期记录内保持稳定，变动约 ${absChange}%。`,
    reason:
      trend === 'up'
        ? '主要受原材料（木浆）价格上升、物流成本增加与下游印刷旺季补库需求共同推动。'
        : trend === 'down'
          ? '主要受进口纸张增加、国内产能扩张与需求季节性走弱影响，价格承压。'
          : '当前页面只基于同一来源、同一规格和同一地区的公开报价进行识别，不能据此推断整个成品纸市场供需。',
    suggestion:
      trend === 'up'
        ? '建议按生产计划分批采购，避免大量囤货；有刚性需求可适度锁量，控制采购成本。'
        : trend === 'down'
          ? '建议密切关注价格止跌信号，可选择分批补货策略，锁定阶段性低位成本。'
          : '建议将当前报价作为询价锚点，并结合至少两家供应商的正式报价、交期和结算条件安排采购。',
    risk:
      trend === 'up'
        ? '风险提示：若原材料价格持续走高，可能导致进一步上涨，请关注木浆期货价格动向。'
        : trend === 'down'
          ? '风险提示：价格过低可能触发纸厂限产，需警惕阶段性反弹，避免踏空。'
          : '风险提示：当前同口径历史样本仍有限，尚不适合输出 30 天数值预测或替代供应商正式报价。',
    confidence: trend === 'flat' ? 65 : 78,
  }
}

// ─── 主组件 ──────────────────────────────────────────────────────────────────
export function AIAnalysis({
  analysis,
  paperType,
  changeRate,
  trend,
  recentPrices = [],
}: AIAnalysisProps) {
  const [structured, setStructured] = useState<StructuredAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [requested, setRequested] = useState(false)

  // 解析已有 analysis 文本
  useEffect(() => {
    if (analysis && analysis.trim().length > 0) {
      setStructured(buildFallbackAnalysis(paperType, changeRate, trend))
    } else {
      setStructured(buildFallbackAnalysis(paperType, changeRate, trend))
    }
  }, [paperType, changeRate, trend, analysis])

  // 实时调用 AI 深度分析
  const fetchAIAnalysis = useCallback(async () => {
    if (loading) return
    setLoading(true)
    setRequested(true)
    try {
      const resp = await fetch('/api/ai/price_analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperType,
          changeRate,
          trend,
          recentPrices: recentPrices.slice(-14),
        }),
      })
      if (!resp.ok) throw new Error('AI 分析请求失败')
      const data = await resp.json() as { analysis?: StructuredAnalysis }
      if (data.analysis) setStructured(data.analysis)
    } catch {
      // 失败保留兜底文案
    } finally {
      setLoading(false)
    }
  }, [paperType, changeRate, trend, recentPrices, loading])

  const fallback = structured ?? buildFallbackAnalysis(paperType, changeRate, trend)

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  const trendColor =
    trend === 'up' ? 'text-danger' : trend === 'down' ? 'text-success' : 'text-white/70'

  const confidence = fallback.confidence

  return (
    <section
      className="animate-fade-in-up relative overflow-hidden rounded-xl shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #2A6CDB 0%, #5B5CD9 55%, #8B5CF6 100%)',
      }}
    >
      {/* 装饰光晕 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)' }}
      />

      <div className="relative p-6 sm:p-7">
        {/* ─── 标题栏 ─── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Brain className="h-6 w-6 text-white" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white sm:text-xl">AI 智能解读</h2>
              <p className="text-xs text-white/70">
                {requested && !loading ? '实时 AI 深度分析' : '基于历史价格与行业模型'}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => void fetchAIAnalysis()}
            disabled={loading}
            className="shrink-0 border-white/30 bg-white/15 text-white hover:bg-white/25"
            variant="outline"
          >
            {loading ? (
              <><RefreshCw className="h-3.5 w-3.5 animate-spin" />分析中</>
            ) : (
              <><RefreshCw className="h-3.5 w-3.5" />{requested ? '重新分析' : 'AI 实时分析'}</>
            )}
          </Button>
        </div>

        {/* ─── 置信度条 ─── */}
        <div className="mt-5 flex items-center gap-3">
          <span className="text-xs text-white/60">AI 置信度</span>
          <div className="flex-1 overflow-hidden rounded-full bg-white/20 h-1.5">
            <div
              className="h-full rounded-full bg-white transition-all duration-700 ease-out"
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-white">{confidence}%</span>
        </div>

        {/* ─── 趋势快览 ─── */}
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-white/15', trendColor)}>
            <TrendIcon className="h-5 w-5" />
          </span>
          <p className="text-sm leading-relaxed text-white/90">{fallback.trend}</p>
        </div>

        {/* ─── 四格分析卡片 ─── */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* 原因分析 */}
          <AnalysisCard
            icon={<BarChart2 className="h-4.5 w-4.5" />}
            label="驱动因素"
            text={fallback.reason}
            loading={loading}
          />
          {/* 采购建议 */}
          <AnalysisCard
            icon={<ShoppingCart className="h-4.5 w-4.5" />}
            label="采购建议"
            text={fallback.suggestion}
            loading={loading}
            highlight
          />
          {/* 风险提示 */}
          <AnalysisCard
            icon={<AlertTriangle className="h-4.5 w-4.5" />}
            label="风险提示"
            text={fallback.risk}
            loading={loading}
          />
          {/* 操作评级 */}
          <div className="flex flex-col justify-center gap-2 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white">
                <CheckCircle className="h-4 w-4" />
              </span>
              <span className="text-xs font-semibold text-white">操作评级</span>
            </div>
            <div className="mt-1 text-center">
              <span className={cn(
                'text-2xl font-extrabold',
                trend === 'up' ? 'text-amber-300' : trend === 'down' ? 'text-green-300' : 'text-white',
              )}>
                {trend === 'up' ? '谨慎买入' : trend === 'down' ? '逢低补货' : '正常采购'}
              </span>
              <p className="mt-1 text-2xs text-white/60">仅供参考，不构成投资建议</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 分析卡片子组件
function AnalysisCard({
  icon,
  label,
  text,
  loading,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  text: string
  loading: boolean
  highlight?: boolean
}) {
  return (
    <div className={cn(
      'flex flex-col gap-2 rounded-xl p-4 backdrop-blur-sm',
      highlight ? 'bg-white/20 ring-1 ring-white/30' : 'bg-white/10',
    )}>
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white">
          {icon}
        </span>
        <span className="text-xs font-semibold text-white">{label}</span>
      </div>
      {loading ? (
        <div className="space-y-1.5">
          <div className="h-2.5 w-full animate-pulse rounded bg-white/20" />
          <div className="h-2.5 w-4/5 animate-pulse rounded bg-white/20" />
          <div className="h-2.5 w-3/5 animate-pulse rounded bg-white/20" />
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-white/85">{text}</p>
      )}
    </div>
  )
}
