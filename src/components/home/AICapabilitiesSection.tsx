'use client'

import { motion } from 'framer-motion'
import {
  Brain,
  BarChart3,
  Zap,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

interface AICapability {
  icon: LucideIcon
  title: string
  subtitle: string
  desc: string
  href: string
  tag: string
  gradient: string
  iconBg: string
}

const CAPABILITIES: AICapability[] = [
  {
    icon: Brain,
    title: 'AI 智能撮合',
    subtitle: 'Smart Matching',
    desc: '基于深度学习的订单-产能智能匹配算法，综合考量工艺、产能、地域、价格等多维因素，实现精准撮合。',
    href: '/orders',
    tag: '核心引擎',
    gradient: 'linear-gradient(135deg, #0E2040 0%, #1A3A7C 100%)',
    iconBg: 'rgba(42,108,219,0.2)',
  },
  {
    icon: BarChart3,
    title: 'AI 纸价预测',
    subtitle: 'Price Prediction',
    desc: '整合原材料期货、市场供需、季节因素等数据，AI 预测未来 30 天纸价走势，辅助采购决策降低风险。',
    href: '/prediction/白卡纸',
    tag: '独家能力',
    gradient: 'linear-gradient(135deg, #061020 0%, #1A2A5C 100%)',
    iconBg: 'rgba(0,180,216,0.2)',
  },
  {
    icon: Zap,
    title: 'AI 采购建议',
    subtitle: 'Purchase Advisor',
    desc: '根据历史采购数据与市场行情，实时给出集采参团建议、最优采购时机及供应商评级，让每笔采购更划算。',
    href: '/purchase',
    tag: 'AI 赋能',
    gradient: 'linear-gradient(135deg, #0D1A30 0%, #162040 100%)',
    iconBg: 'rgba(43,174,110,0.2)',
  },
  {
    icon: ShieldCheck,
    title: '绿色认证体系',
    subtitle: 'Green Certification',
    desc: '依托 AI 评估体系，对平台内企业进行绿色印刷认证评级，优先推荐符合双碳目标的供应商。',
    href: '/orders',
    tag: '环境赋能',
    gradient: 'linear-gradient(135deg, #0A1628 0%, #132A1E 100%)',
    iconBg: 'rgba(43,174,110,0.2)',
  },
]

const ICON_COLORS: Record<string, string> = {
  'AI 智能撮合': '#4A85E6',
  'AI 纸价预测': '#00B4D8',
  'AI 采购建议': '#2BAE6E',
  '绿色认证体系': '#2BAE6E',
}

export function AICapabilitiesSection() {
  return (
    <section
      className="relative py-20 sm:py-24"
      style={{ background: 'linear-gradient(180deg, #0D1A30 0%, #061020 100%)' }}
    >
      {/* 工业网格背景 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* 光晕装饰 */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(42,108,219,0.15) 0%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 标题区 */}
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: 'rgba(42,108,219,0.15)',
              border: '1px solid rgba(42,108,219,0.25)',
              color: '#7BA6F0',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            AI Intelligence Engine
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            AI 驱动的核心能力
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-white/60 sm:text-lg">
            以人工智能为核心引擎，赋予印刷产业协同的全新可能
          </p>
        </div>

        {/* 能力网格 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon
            const iconColor = ICON_COLORS[cap.title] ?? '#4A85E6'
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.19,1,0.22,1] }}
              >
                <Link
                  href={cap.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-all duration-base hover:-translate-y-1"
                  style={{
                    background: cap.gradient,
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Hover 发光边框 */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-base group-hover:opacity-100"
                    style={{
                      border: `1px solid ${iconColor}40`,
                      boxShadow: `inset 0 0 30px ${iconColor}10`,
                    }}
                  />

                  {/* Tag */}
                  <span
                    className="mb-4 inline-flex self-start rounded-full px-2.5 py-1 text-2xs font-semibold uppercase tracking-wide"
                    style={{
                      background: `${iconColor}20`,
                      color: iconColor,
                      border: `1px solid ${iconColor}30`,
                    }}
                  >
                    {cap.tag}
                  </span>

                  {/* 图标 */}
                  <div
                    className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-base group-hover:scale-110"
                    style={{ background: cap.iconBg, border: `1px solid ${iconColor}25` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: iconColor }} />
                  </div>

                  {/* 标题 */}
                  <h3 className="mb-0.5 text-base font-bold text-white">{cap.title}</h3>
                  <p className="mb-3 text-xs font-medium" style={{ color: iconColor }}>{cap.subtitle}</p>

                  {/* 描述 */}
                  <p className="flex-1 text-xs leading-relaxed text-white/55">{cap.desc}</p>

                  {/* 进入箭头 */}
                  <div
                    className="mt-5 flex items-center gap-1.5 text-xs font-medium transition-all duration-fast group-hover:gap-2.5"
                    style={{ color: iconColor }}
                  >
                    了解更多
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
