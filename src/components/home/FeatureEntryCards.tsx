import Link from 'next/link'
import {
  ArrowRight,
  GraduationCap,
  Rocket,
  ShoppingBag,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCard {
  icon: LucideIcon
  title: string
  desc: string
  badge: string
  href: string
  /** 主题色：蓝/绿/橙/紫 */
  theme: 'primary' | 'environment' | 'society' | 'purple'
}

const FEATURES: FeatureCard[] = [
  {
    icon: ShoppingBag,
    title: '订单大厅',
    desc: '海量印刷订单智能匹配，一键对接优质产能，撮合效率提升 3 倍',
    badge: '热门',
    href: '/orders',
    theme: 'primary',
  },
  {
    icon: TrendingDown,
    title: '集采商城',
    desc: '集中采购降本增效，拼单团购更低价格，平均节省 8-15% 采购成本',
    badge: '省钱',
    href: '/purchase',
    theme: 'environment',
  },
  {
    icon: Rocket,
    title: '创业孵化',
    desc: '一站式创业服务，导师辅导、案例参考、资源对接，助力印刷创业成功',
    badge: '创业',
    href: '/startup',
    theme: 'society',
  },
  {
    icon: GraduationCap,
    title: '技术培训',
    desc: '系统化技术课程与行业资讯，持续提升专业技能与经营能力',
    badge: '成长',
    href: '/training',
    theme: 'purple',
  },
]

export function FeatureEntryCards() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-ink-primary sm:text-3xl">
            核心服务
          </h2>
          <p className="mt-2 text-sm text-ink-secondary sm:text-base">
            四位一体的行业 SaaS 平台
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm',
                  'transition-all duration-base ease-out-expo',
                  'hover:-translate-y-1 hover:shadow-lg',
                )}
              >
                {/* 顶部主题色条 */}
                <div
                  className={cn('h-1.5 w-full', THEME_BAR[feature.theme])}
                />

                {/* 角标 */}
                <span
                  className={cn(
                    'absolute right-3 top-3 inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium leading-none',
                    THEME_BADGE[feature.theme],
                  )}
                >
                  {feature.badge}
                </span>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {/* 大图标 */}
                  <div
                    className={cn(
                      'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-base ease-out-expo group-hover:scale-110 sm:h-14 sm:w-14',
                      THEME_ICON_BG[feature.theme],
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6 sm:h-7 sm:w-7',
                        THEME_ICON_TEXT[feature.theme],
                      )}
                    />
                  </div>

                  <h3 className="text-lg font-bold text-ink-primary sm:text-xl">
                    {feature.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">
                    {feature.desc}
                  </p>

                  <span
                    className={cn(
                      'mt-4 inline-flex items-center gap-1 text-sm font-medium transition-all duration-base ease-out-expo',
                      'group-hover:gap-2',
                      THEME_LINK[feature.theme],
                    )}
                  >
                    了解更多
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const THEME_BAR: Record<FeatureCard['theme'], string> = {
  primary: 'bg-primary',
  environment: 'bg-environment',
  society: 'bg-society',
  purple: 'bg-purple-500',
}

const THEME_BADGE: Record<FeatureCard['theme'], string> = {
  primary: 'bg-primary-bg text-primary',
  environment: 'bg-environment-bg text-environment',
  society: 'bg-society-bg text-society',
  purple: 'bg-purple-50 text-purple-600',
}

const THEME_ICON_BG: Record<FeatureCard['theme'], string> = {
  primary: 'bg-primary-bg',
  environment: 'bg-environment-bg',
  society: 'bg-society-bg',
  purple: 'bg-purple-50',
}

const THEME_ICON_TEXT: Record<FeatureCard['theme'], string> = {
  primary: 'text-primary',
  environment: 'text-environment',
  society: 'text-society',
  purple: 'text-purple-600',
}

const THEME_LINK: Record<FeatureCard['theme'], string> = {
  primary: 'text-primary group-hover:text-primary-light',
  environment: 'text-environment group-hover:text-environment-light',
  society: 'text-society group-hover:text-society-light',
  purple: 'text-purple-600 group-hover:text-purple-500',
}
