import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, ClipboardList, Factory, Handshake, LineChart, Users } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import {
  PUBLIC_MENTORS,
  PUBLIC_PARTNERS,
  PUBLIC_PLATFORM_PROFILE,
  PUBLIC_RESEARCH_FACTS,
} from '@/lib/public-content'

export const metadata: Metadata = {
  title: '关于智印联创',
  description: '了解智印联创的服务定位、公开调研依据与已确认的合作信息。',
}

const SERVICES = [
  { icon: Factory, title: '订单与产能撮合', detail: '公开需求和产能信息经平台流程处理后，协助供需双方建立沟通。', href: '/orders' },
  { icon: ClipboardList, title: '采购意向收集', detail: '收集相近的印刷耗材采购需求，不在站内提供付款或价格承诺。', href: '/purchase' },
  { icon: LineChart, title: '纸价信息参考', detail: '仅展示有来源、规格、区域、单位和更新时间的公开或授权数据。', href: '/prediction/白卡纸' },
  { icon: BookOpen, title: '创业孵化服务', detail: '提供公开学习资源、导师信息和投入测算工具。', href: '/startup' },
] as const

export default function AboutPage() {
  return (
    <main className="pb-12">
      <section className="border-b-2 border-primary bg-white">
        <Container className="py-8 sm:py-10">
          <nav className="mb-4 text-xs text-ink-tertiary" aria-label="面包屑">
            <Link href="/" className="hover:text-primary">首页</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink-secondary">关于智印联创</span>
          </nav>
          <p className="text-xs font-semibold text-primary">平台介绍</p>
          <h1 className="mt-2 text-2xl font-bold text-ink-primary sm:text-3xl">智印联创</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">
            {PUBLIC_PLATFORM_PROFILE.description} {PUBLIC_PLATFORM_PROFILE.launchNotice}
          </p>
        </Container>
      </section>

      <Container className="mt-8">
        <section>
          <h2 className="text-xl font-bold text-ink-primary">服务方向</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => {
              const Icon = service.icon
              return (
                <Link key={service.title} href={service.href} className="group rounded-lg border border-line bg-white p-4 transition-colors hover:border-primary/50 hover:bg-primary-bg-subtle/30">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 font-semibold text-ink-primary">{service.title}</h3>
                  <p className="mt-2 min-h-16 text-sm leading-6 text-ink-secondary">{service.detail}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">进入服务 <ArrowRight className="h-4 w-4" /></span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-ink-primary">公开调研依据</h2>
            <p className="mt-2 text-sm leading-6 text-ink-secondary">以下为 2025 年团队调研中可公开引用的信息，不代表平台运营数据或效果承诺。</p>
            <dl className="mt-4 divide-y divide-line rounded-lg border border-line bg-white">
              {PUBLIC_RESEARCH_FACTS.map((fact) => (
                <div key={fact.label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div><dt className="text-sm font-medium text-ink-primary">{fact.label}</dt><dd className="mt-1 text-xs text-ink-tertiary">{fact.detail}</dd></div>
                  <span className="shrink-0 text-xl font-bold text-primary">{fact.value}</span>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink-primary">已确认合作与导师</h2>
            <div className="mt-4 rounded-lg border border-line bg-white p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-primary"><Handshake className="h-4 w-4 text-society" />合作单位</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-secondary">{PUBLIC_PARTNERS.map((partner) => <li key={partner} className="border-l-2 border-society pl-3">{partner}</li>)}</ul>
            </div>
            <div className="mt-3 rounded-lg border border-line bg-white p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-primary"><Users className="h-4 w-4 text-environment" />项目导师</h3>
              <ul className="mt-3 space-y-3">{PUBLIC_MENTORS.map((mentor) => <li key={mentor.name}><p className="text-sm font-medium text-ink-primary">{mentor.name} · {mentor.title}</p><p className="mt-1 text-xs leading-5 text-ink-tertiary">{mentor.expertise}</p></li>)}</ul>
            </div>
          </div>
        </section>

        <section className="mt-10 border-l-2 border-primary bg-primary-bg-subtle px-4 py-4 sm:flex sm:items-center sm:justify-between">
          <div><h2 className="text-base font-semibold text-ink-primary">测试预览说明</h2><p className="mt-1 text-sm leading-6 text-ink-secondary">当前为功能测试预览。备案、数据授权、业务规则和公开材料将在正式上线前持续完善。</p></div>
          <Link href="/feedback" className="mt-3 inline-flex h-10 shrink-0 items-center gap-1 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-light sm:mt-0">提交建议 <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </Container>
    </main>
  )
}
