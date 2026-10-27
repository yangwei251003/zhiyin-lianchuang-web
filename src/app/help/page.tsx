import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, ClipboardList, Factory, LineChart, UserRound } from 'lucide-react'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: '帮助中心 · 智印联创',
  description: '了解智印联创的账户、需求撮合、采购意向和纸价信息使用方式。',
}

const GUIDES = [
  { icon: UserRound, title: '账户与企业资料', content: '注册后可完善个人资料；发布需求和产能前需按流程提交企业资料。', href: '/mine/auth', action: '进入企业资料' },
  { icon: Factory, title: '订单与产能', content: '浏览公开需求和产能信息。实际报价、合作范围和交期由供需双方后续确认。', href: '/orders', action: '进入订单大厅' },
  { icon: ClipboardList, title: '采购意向', content: '提交预计采购数量后进入沟通流程。平台不提供站内付款、价格承诺或供货保证。', href: '/purchase', action: '查看采购信息' },
  { icon: LineChart, title: '纸价信息', content: '只展示标注了来源、规格、地区、单位和更新时间的公开或授权报价。', href: '/prediction/白卡纸', action: '查看纸价信息' },
] as const

export default function HelpPage() {
  return (
    <main className="pb-12">
      <section className="border-b-2 border-primary bg-white">
        <Container className="py-8 sm:py-10">
          <nav className="mb-4 text-xs text-ink-tertiary" aria-label="面包屑"><Link href="/" className="hover:text-primary">首页</Link><span className="mx-1.5">/</span><span className="text-ink-secondary">帮助中心</span></nav>
          <p className="text-xs font-semibold text-primary">使用说明</p>
          <h1 className="mt-2 text-2xl font-bold text-ink-primary sm:text-3xl">帮助中心</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">当前测试预览提供基础操作说明。业务规则、数据来源和开放范围以页面中的最新说明为准。</p>
        </Container>
      </section>
      <Container className="mt-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {GUIDES.map((guide) => {
            const Icon = guide.icon
            return <article key={guide.title} className="rounded-lg border border-line bg-white p-5"><Icon className="h-5 w-5 text-primary" /><h2 className="mt-4 text-lg font-semibold text-ink-primary">{guide.title}</h2><p className="mt-2 min-h-14 text-sm leading-6 text-ink-secondary">{guide.content}</p><Link href={guide.href} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light">{guide.action}<ArrowRight className="h-4 w-4" /></Link></article>
          })}
        </div>
        <section className="mt-8 flex flex-col gap-3 border-l-2 border-primary bg-primary-bg-subtle px-4 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-base font-semibold text-ink-primary"><BookOpen className="h-4 w-4" />仍未解决问题？</h2><p className="mt-1 text-sm text-ink-secondary">登录后可提交反馈或联系需求，平台会按流程处理。</p></div><Link href="/feedback" className="inline-flex h-10 shrink-0 items-center gap-1 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-light">提交反馈<ArrowRight className="h-4 w-4" /></Link></section>
      </Container>
    </main>
  )
}
