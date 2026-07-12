import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Lightbulb,
  MessagesSquare,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import {
  PUBLIC_MENTORS,
  PUBLIC_PARTNERS,
  PUBLIC_RESEARCH_FACTS,
} from '@/lib/public-content'
import { cn } from '@/lib/utils'
import { ShowcaseRail } from '@/components/common/ShowcaseRail'

export const metadata: Metadata = {
  title: '创业孵化 · 智印联创',
  description: '面向印刷创业者的公开学习资源、导师咨询与投入测算工具。',
}

interface ModuleEntry {
  icon: LucideIcon
  title: string
  desc: string
  href: string
  theme: 'primary' | 'environment' | 'society' | 'deep'
}

const MODULE_ENTRIES: ModuleEntry[] = [
  {
    icon: BookOpen,
    title: '学习文章',
    desc: '查看经审核后公开的印刷创业与经营学习材料。',
    href: '/startup/articles',
    theme: 'primary',
  },
  {
    icon: Users,
    title: '导师咨询',
    desc: '了解项目已确认的校内与企业产业导师。',
    href: '/startup/mentors',
    theme: 'environment',
  },
  {
    icon: Calculator,
    title: '投入测算',
    desc: '按自身实际参数估算筹备阶段的成本项目。',
    href: '/startup/calculator',
    theme: 'society',
  },
  {
    icon: MessagesSquare,
    title: '提交咨询',
    desc: '提交问题或建议，平台会按流程安排后续沟通。',
    href: '/feedback',
    theme: 'deep',
  },
]

const THEME_CONFIG: Record<ModuleEntry['theme'], { bar: string; icon: string; text: string }> = {
  primary: { bar: 'bg-primary', icon: 'bg-primary-bg text-primary', text: 'text-primary' },
  environment: { bar: 'bg-environment', icon: 'bg-environment-bg text-environment', text: 'text-environment' },
  society: { bar: 'bg-society', icon: 'bg-society-bg text-society', text: 'text-society' },
  deep: { bar: 'bg-deep', icon: 'bg-deep-bg text-deep', text: 'text-deep' },
}

export default function StartupHomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#07152d] via-[#10234b] to-[#07152d] pb-12 text-white">
      <section className="relative overflow-hidden border-b border-fuchsia-300/20 bg-[#07152d]">
        <Image src="/images/external/press-tools.jpg" alt="工作人员调整印刷设备" fill priority className="object-cover opacity-25" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(7,21,45,.98),rgba(16,35,75,.88),rgba(7,21,45,.62))]" />
        <Container className="relative py-8 sm:py-10">
          <nav className="mb-4 text-xs text-slate-400" aria-label="面包屑">
            <Link href="/" className="hover:text-cyan-200">首页</Link>
            <span className="mx-1.5">/</span>
            <span className="text-slate-200">创业孵化</span>
          </nav>
          <p className="text-xs font-semibold text-fuchsia-300">产教融合服务</p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">创业孵化</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
            为印刷创业者提供公开学习资源、导师咨询与筹备测算。平台不承诺投资回报或经营结果，所有信息请结合自身情况独立判断。
          </p>
        </Container>
      </section>

      <Container className="mt-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODULE_ENTRIES.map((entry) => {
            const Icon = entry.icon
            const theme = THEME_CONFIG[entry.theme]
            return (
              <Link
                key={entry.title}
                href={entry.href}
                className="group overflow-hidden rounded-lg border border-line bg-white transition-colors hover:border-primary/50 hover:bg-primary-bg-subtle/30"
              >
                <div className={cn('h-1', theme.bar)} />
                <div className="p-4">
                  <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-md', theme.icon)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <h2 className="mt-4 text-base font-semibold text-ink-primary">{entry.title}</h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-ink-secondary">{entry.desc}</p>
                  <span className={cn('mt-4 inline-flex items-center gap-1 text-sm font-medium', theme.text)}>
                    查看服务 <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </Container>

      <Container className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-environment" />
            <h2 className="text-xl font-bold text-ink-primary">已确认导师</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink-secondary">以下信息来自项目商业计划书，具体咨询安排以平台后续通知为准。</p>
          <div className="mt-4 space-y-3">
            {PUBLIC_MENTORS.map((mentor) => (
              <div key={mentor.name} className="flex gap-3 rounded-lg border border-line bg-white p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-environment-bg text-sm font-semibold text-environment">
                  {mentor.name.slice(0, 1)}
                </span>
                <div>
                  <h3 className="font-semibold text-ink-primary">{mentor.name}</h3>
                  <p className="mt-1 text-sm text-ink-secondary">{mentor.title}</p>
                  <p className="mt-1 text-xs leading-5 text-ink-tertiary">{mentor.expertise}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/startup/mentors" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light">
            查看导师信息 <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-society" />
            <h2 className="text-xl font-bold text-ink-primary">项目依据</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink-secondary">以下为 2025 年团队调研中可公开引用的信息，不用于推断平台运营成果。</p>
          <dl className="mt-4 divide-y divide-line rounded-lg border border-line bg-white">
            {PUBLIC_RESEARCH_FACTS.map((fact) => (
              <div key={fact.label} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <dt className="text-sm font-medium text-ink-primary">{fact.label}</dt>
                  <dd className="mt-1 text-xs leading-5 text-ink-tertiary">{fact.detail}</dd>
                </div>
                <span className="shrink-0 text-xl font-bold text-society">{fact.value}</span>
              </div>
            ))}
          </dl>
          <h3 className="mt-6 text-sm font-semibold text-ink-primary">项目合作单位</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
            {PUBLIC_PARTNERS.map((partner) => <li key={partner} className="border-l-2 border-primary pl-3">{partner}</li>)}
          </ul>
        </section>
      </Container>
      <Container><ShowcaseRail module="startup" title="图文创业资源与案例" /></Container>
    </main>
  )
}
