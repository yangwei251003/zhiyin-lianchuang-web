'use client'

import { useEffect, useState } from 'react'
import { Bot, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

export interface AIArticleSummaryProps {
  articleId: string
  title: string
  content: string
}

interface APIResponse {
  summary?: string
}

// 结构化兜底摘要：从正文截取前若干句作为摘要
function buildFallbackSummary(title: string, content: string): string {
  // 去除 HTML 标签与多余空白
  const text = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) {
    return `本文《${title}》围绕印刷行业创业主题展开，提供实操经验与建议，建议结合自身情况参考。`
  }
  // 截取前 120 字符，按句号断句
  const slice = text.slice(0, 160)
  const lastPeriod = slice.lastIndexOf('。')
  const core = lastPeriod > 40 ? slice.slice(0, lastPeriod + 1) : slice
  return `本文核心要点：${core}... 建议阅读全文获取完整方法论与实操细节。`
}

// AI 文章摘要组件
// 优先调用 /api/ai/article_summary 接口，失败则用结构化兜底文案
export function AIArticleSummary({
  articleId,
  title,
  content,
}: AIArticleSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchSummary = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/ai/article_summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            article_id: articleId,
            title,
            content: content.slice(0, 4000),
          }),
        })
        if (!res.ok) throw new Error('接口不可用')
        const data: APIResponse = await res.json()
        if (cancelled) return
        if (data.summary && data.summary.trim()) {
          setSummary(data.summary.trim())
        } else {
          setSummary(buildFallbackSummary(title, content))
        }
      } catch {
        if (cancelled) return
        setSummary(buildFallbackSummary(title, content))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void fetchSummary()
    return () => {
      cancelled = true
    }
  }, [articleId, title, content])

  if (loading || !summary) {
    return (
      <Card padding="lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold text-ink-primary">AI 文章摘要</h3>
        </div>
        <div className="mt-4 space-y-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg p-5 shadow-md',
      )}
      style={{
        background:
          'linear-gradient(135deg, #2A6CDB 0%, #4A85E6 50%, #7C3AED 100%)',
      }}
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
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/20">
            <Bot className="h-4 w-4 text-white" />
          </span>
          <h3 className="text-base font-bold text-white">AI 文章摘要</h3>
          <span className="ml-auto inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-2xs font-medium text-white">
            智能生成
          </span>
        </div>

        {/* 摘要内容 */}
        <p className="mt-4 text-sm leading-relaxed text-white/95">{summary}</p>

        {/* 底部提示 */}
        <div className="mt-4 flex items-center gap-1.5 border-t border-white/20 pt-3 text-2xs text-white/70">
          <Sparkles className="h-3 w-3" />
          <span>摘要由 AI 基于正文自动生成，仅供参考</span>
        </div>
      </div>
    </div>
  )
}
