import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CircleHelp, FileText, MessageSquare } from 'lucide-react'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: '服务说明 · 智印联创',
  description: '查看智印联创当前测试预览阶段的服务范围和使用说明。',
}

const QUESTIONS = [
  { question: '订单大厅如何使用？', answer: '可公开浏览需求和产能信息。登录并按流程完成企业资料审核后，可发布需求、发布产能或提交报价沟通。实际价格、交期和合作条款由双方确认。' },
  { question: '采购意向是否包含在线付款？', answer: '不包含。采购页仅收集预计采购数量并协助后续沟通，不提供在线支付、资金监管、价格承诺或供货保证。' },
  { question: '纸价信息来自哪里？', answer: '页面只展示带来源、规格、地区、单位和更新时间的公开或授权数据。当前公开报价会在页面中明确标注来源，数据不足时不会显示模拟值。' },
  { question: '如何提交问题或合作需求？', answer: '登录后可在意见反馈页提交。反馈会保存到本人账户记录中，平台按流程处理。请勿提交不必要的敏感信息。' },
] as const

export default function ServicePage() {
  return (
    <main className="pb-12">
      <section className="border-b-2 border-primary bg-white"><Container className="py-8 sm:py-10"><nav className="mb-4 text-xs text-ink-tertiary" aria-label="面包屑"><Link href="/" className="hover:text-primary">首页</Link><span className="mx-1.5">/</span><Link href="/contact" className="hover:text-primary">联系与合作</Link><span className="mx-1.5">/</span><span className="text-ink-secondary">服务说明</span></nav><p className="text-xs font-semibold text-primary">测试预览说明</p><h1 className="mt-2 text-2xl font-bold text-ink-primary sm:text-3xl">服务说明</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">当前平台处于功能测试预览阶段。以下说明仅覆盖已经开放的服务边界，不构成业务承诺。</p></Container></section>
      <Container size="md" className="mt-8"><div className="divide-y divide-line rounded-lg border border-line bg-white">{QUESTIONS.map((item) => <section key={item.question} className="p-5"><h2 className="flex items-center gap-2 text-base font-semibold text-ink-primary"><CircleHelp className="h-4 w-4 text-primary" />{item.question}</h2><p className="mt-3 text-sm leading-7 text-ink-secondary">{item.answer}</p></section>)}</div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/terms" className="flex items-center gap-3 rounded-lg border border-line bg-white p-4 transition-colors hover:border-primary/50"><FileText className="h-5 w-5 text-primary" /><span className="flex-1 text-sm font-semibold text-ink-primary">查看用户协议</span><ArrowRight className="h-4 w-4 text-ink-tertiary" /></Link><Link href="/feedback" className="flex items-center gap-3 rounded-lg border border-line bg-white p-4 transition-colors hover:border-primary/50"><MessageSquare className="h-5 w-5 text-primary" /><span className="flex-1 text-sm font-semibold text-ink-primary">提交反馈</span><ArrowRight className="h-4 w-4 text-ink-tertiary" /></Link></div></Container>
    </main>
  )
}
