'use client'

import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  Search,
  type LucideIcon,
} from 'lucide-react'
import {
  EmptyState as BaseEmptyState,
  type EmptyStateProps as BaseEmptyStateProps,
} from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

export type EmptyStateVariant = 'default' | 'search' | 'error' | 'success'

export interface EmptyStateProps
  extends Omit<BaseEmptyStateProps, 'icon' | 'title'> {
  variant?: EmptyStateVariant
  icon?: React.ReactNode
  /** 不传则按 variant 取默认标题 */
  title?: string
}

interface VariantConfig {
  icon: LucideIcon
  color: string
  title: string
  description: string
}

const variantConfig: Record<EmptyStateVariant, VariantConfig> = {
  default: {
    icon: Inbox,
    color: 'text-ink-tertiary',
    title: '暂无数据',
    description: '暂时没有相关内容',
  },
  search: {
    icon: Search,
    color: 'text-ink-tertiary',
    title: '未找到相关结果',
    description: '试试调整搜索条件或更换关键词',
  },
  error: {
    icon: AlertCircle,
    color: 'text-danger',
    title: '加载失败',
    description: '数据加载出错，请稍后重试',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-success',
    title: '操作成功',
    description: '已完成当前操作',
  },
}

// 增强版空状态：支持 variant 自动匹配图标 / 颜色 / 默认文案
export function EmptyState({
  variant = 'default',
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant]
  const Icon = config.icon
  const iconNode = icon ?? (
    <Icon className="h-12 w-12" strokeWidth={1.5} aria-hidden />
  )

  return (
    <BaseEmptyState
      icon={<span className={cn(config.color)}>{iconNode}</span>}
      title={title ?? config.title}
      description={description ?? config.description}
      action={action}
      className={className}
    />
  )
}

// 保留原始无 variant 版本，供仅需 icon/title/description/action 的场景直接使用
export { BaseEmptyState as EmptyStateBase }
export type { EmptyStateProps as BaseEmptyStateProps } from '@/components/ui/EmptyState'
