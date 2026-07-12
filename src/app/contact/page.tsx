import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, Handshake, MessageSquare, Users } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { PUBLIC_PARTNERS } from '@/lib/public-content'

export const metadata: Metadata = {
  title: '联系与合作 · 智印联创',
  description: '了解智印联创的合作沟通方向并提交联系需求。',
}

const COOPERATION_AREAS = [
  { icon: Building2, title: '印刷企业与供需协同', detail: '围绕订单、产能和采购意向的信息撮合开展沟通。' },
  { icon: Users, title: '产教融合与人才培养', detail: '围绕实训、学习资源和产业导师支持探索合作方式。' },
  { icon: Handshake, title: '行业资源共建', detail: '围绕公开数据来源、服务规则和合作材料进行对接。' },
] as const

export default function ContactPage() {
  return (
    <main className="pb-12">
      <section className="border-b-2 border-society bg-white">
        <Container className="py-8 sm:py-10">
          <nav className="mb-4 text-xs text-ink-tertiary" aria-label="面包屑">
            <Link href="/" className="hover:text-primary">首页</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink-secondary">联系与合作</span>
          </nav>
          <p className="text-xs font-semibold text-society">沟通与共建</p>
          <h1 className="mt-2 text-2xl font-bold text-ink-primary sm:text-3xl">联系与合作</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">
            平台当前处于测试预览阶段。合作意向、资源建议和业务问题将按提交内容进入后续沟通流程；正式联系方式将在备案和运营信息确认后公开。
          </p>
        </Container>
      </section>

      <Container className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold text-ink-primary">可沟通方向</h2>
          <div className="mt-4 space-y-3">
            {COOPERATION_AREAS.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="flex gap-3 rounded-lg border border-line bg-white p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-society-bg text-society"><Icon className="h-4 w-4" /></span>
                  <div><h3 className="font-semibold text-ink-primary">{item.title}</h3><p className="mt-1 text-sm leading-6 text-ink-secondary">{item.detail}</p></div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink-primary"><MessageSquare className="h-5 w-5 text-primary" />提交联系需求</h2>
          <p className="mt-3 text-sm leading-6 text-ink-secondary">请在反馈页说明合作主体、联系需求和可公开的联系方式。信息会按隐私政策处理；请勿提交身份证件、银行账户或其他不必要的敏感信息。</p>
          <Link href="/feedback" className="mt-5 inline-flex h-10 items-center gap-1 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-light">前往提交 <ArrowRight className="h-4 w-4" /></Link>
          <div className="mt-6 border-t border-line-light pt-4">
            <h3 className="text-sm font-semibold text-ink-primary">已确认合作单位</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-secondary">{PUBLIC_PARTNERS.map((partner) => <li key={partner} className="border-l-2 border-primary pl-3">{partner}</li>)}</ul>
          </div>
        </section>
      </Container>
    </main>
  )
}
