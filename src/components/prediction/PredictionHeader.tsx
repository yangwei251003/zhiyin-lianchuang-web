import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface PredictionHeaderProps {
  paperType: string
}

// 预测详情页头部：面包屑 + 大标题 + 副标题
// 渲染于蓝紫渐变 Hero 之上，文字为白色系
export function PredictionHeader({ paperType }: PredictionHeaderProps) {
  return (
    <header className="relative">
      {/* 面包屑 */}
      <nav
        aria-label="面包屑"
        className="flex items-center gap-1 text-xs text-white/70 sm:text-sm"
      >
        <Link
          href="/"
          className="transition-colors duration-fast ease-out-expo hover:text-white"
        >
          首页
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-white/50" />
        <Link
          href="/prediction/铜版纸"
          className="transition-colors duration-fast ease-out-expo hover:text-white"
        >
          AI 纸价预测
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-white/50" />
        <span className="text-white">{paperType}</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {paperType} 价格预测
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
        基于 AI 模型的 7 天价格趋势预测
      </p>
    </header>
  )
}
