'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  /** 页面标题 */
  title: string
  /** 英文副标（可选） */
  subtitle?: string
  /** 描述文字 */
  desc?: string
  /** 主题色类型 */
  theme?: 'blue' | 'green' | 'orange' | 'purple' | 'dark'
  /** 功能标签文字（可选） */
  badge?: string
  /** 图标 */
  icon?: ReactNode
  /** 额外操作区域（CTA按钮等） */
  actions?: React.ReactNode
  /** 面包屑 */
  breadcrumbs?: { label: string; href?: string }[]
  /** 右侧统计数字（可选） */
  stats?: { value: string; label: string }[]
}

const THEME_CONFIG = {
  blue: {
    gradFrom: '#0D2040',
    gradTo: '#1A3A8C',
    accent: '#4A85E6',
    badge: 'rgba(42,108,219,0.25)',
    badgeText: '#7BA6F0',
    borderColor: 'rgba(42,108,219,0.20)',
  },
  green: {
    gradFrom: '#0A2318',
    gradTo: '#1A5C3A',
    accent: '#2BAE6E',
    badge: 'rgba(43,174,110,0.25)',
    badgeText: '#6EDAA8',
    borderColor: 'rgba(43,174,110,0.20)',
  },
  orange: {
    gradFrom: '#1E1008',
    gradTo: '#5C2E10',
    accent: '#F08035',
    badge: 'rgba(240,128,53,0.25)',
    badgeText: '#F5A66B',
    borderColor: 'rgba(240,128,53,0.20)',
  },
  purple: {
    gradFrom: '#12082A',
    gradTo: '#3A1C7C',
    accent: '#8B5CF6',
    badge: 'rgba(139,92,246,0.25)',
    badgeText: '#A78BFA',
    borderColor: 'rgba(139,92,246,0.20)',
  },
  dark: {
    gradFrom: '#061020',
    gradTo: '#0D1A30',
    accent: '#4A85E6',
    badge: 'rgba(42,108,219,0.20)',
    badgeText: '#7BA6F0',
    borderColor: 'rgba(42,108,219,0.15)',
  },
}

/**
 * 企业级页面头部组件
 * 深色工业风格，带CMYK装饰条、品牌色渐变、面包屑、统计数字区
 */
export function PageHeader({
  title,
  subtitle,
  desc,
  theme = 'blue',
  badge,
  icon,
  actions,
  breadcrumbs,
  stats,
}: PageHeaderProps) {
  const cfg = THEME_CONFIG[theme]

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cfg.gradFrom} 0%, ${cfg.gradTo} 100%)`,
      }}
    >
      {/* 工业网格背景 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* 光晕装饰 */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full"
        style={{
          background: `radial-gradient(circle, ${cfg.accent}20 0%, transparent 70%)`,
          filter: 'blur(2px)',
        }}
      />

      {/* CMYK顶部色条 */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, #00B4D8, #D62246, #F5C518, #2A6CDB)' }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* 面包屑 */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 flex items-center gap-2 text-xs text-white/45"
            aria-label="面包屑"
          >
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {idx > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-white/75 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-white/65">{crumb.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            {/* Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: cfg.badge,
                  border: `1px solid ${cfg.borderColor}`,
                  color: cfg.badgeText,
                }}
              >
                {icon}
                {badge}
              </motion.div>
            )}

            {/* 主标题 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm font-medium uppercase tracking-widest" style={{ color: cfg.accent }}>
                  {subtitle}
                </p>
              )}
              {desc && (
                <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                  {desc}
                </p>
              )}
            </motion.div>
          </div>

          {/* 操作区 / 统计数字 */}
          {(actions || stats) && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-3 sm:items-end"
            >
              {/* 统计数字 */}
              {stats && (
                <div className="flex gap-6">
                  {stats.map((s) => (
                    <div key={s.label} className="text-center">
                      <div
                        className="text-xl font-bold sm:text-2xl"
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          color: cfg.accent,
                        }}
                      >
                        {s.value}
                      </div>
                      <div className="text-xs text-white/50">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {/* 操作按钮 */}
              {actions}
            </motion.div>
          )}
        </div>
      </div>

      {/* 底部渐变遮罩（与下方内容区衔接） */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-12"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.15), transparent)' }}
      />
    </div>
  )
}
