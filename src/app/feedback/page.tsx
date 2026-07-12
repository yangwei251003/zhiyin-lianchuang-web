'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Send, Star } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { useRequireAuth } from '@/lib/auth/client-guard'
import { requestJson } from '@/lib/api/request'
import { useUIStore } from '@/store/ui-store'

const CATEGORIES = ['建议', '问题反馈', '合作联系', '其他'] as const
const MODULES = ['首页', '订单大厅', '集采商城', '纸价信息', '创业孵化', '个人中心', '其他'] as const

export default function FeedbackPage() {
  const requireAuth = useRequireAuth()
  const addToast = useUIStore((state) => state.addToast)
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('建议')
  const [module, setModule] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [content, setContent] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!requireAuth()) return
    setSubmitting(true)
    try {
      await requestJson('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, module, rating, content, contact }),
      })
      setSubmitted(true)
      setContent('')
      setContact('')
    } catch (error) {
      addToast({ type: 'error', message: error instanceof Error ? error.message : '反馈保存失败，请稍后重试。' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F7F8] pb-12">
      <section className="border-b border-[#D9DEE6] bg-white">
        <Container className="py-8 sm:py-10">
          <nav className="mb-4 text-xs text-ink-tertiary" aria-label="面包屑"><Link href="/" className="hover:text-primary">首页</Link><span className="mx-1.5">/</span><span className="text-ink-secondary">意见反馈</span></nav>
          <p className="print-index text-xs font-semibold">04 / 产品改进</p>
          <h1 className="mt-2 text-2xl font-bold text-ink-primary sm:text-3xl">意见反馈</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">登录后可提交建议、问题或合作联系需求。反馈将保存到你的账户记录中，供平台后续处理。</p>
        </Container>
      </section>

      <Container size="md" className="mt-8">
        {submitted ? (
          <section className="border border-success/30 bg-success-bg p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
            <h2 className="mt-4 text-xl font-bold text-ink-primary">反馈已保存</h2>
            <p className="mt-2 text-sm leading-6 text-ink-secondary">感谢你的反馈。后续处理状态将由平台按流程更新。</p>
            <Button className="mt-5" onClick={() => setSubmitted(false)}>继续提交</Button>
          </section>
        ) : (
          <form onSubmit={submitFeedback} className="space-y-6 border border-line bg-white p-5 sm:p-6">
            <fieldset><legend className="text-sm font-semibold text-ink-primary">反馈类型</legend><div className="mt-3 flex flex-wrap gap-2">{CATEGORIES.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-sm border px-3 py-2 text-sm font-medium ${category === item ? 'border-primary bg-primary-bg text-primary' : 'border-line text-ink-secondary hover:border-primary/50'}`}>{item}</button>)}</div></fieldset>
            <fieldset><legend className="text-sm font-semibold text-ink-primary">相关模块</legend><div className="mt-3 flex flex-wrap gap-2">{MODULES.map((item) => <button key={item} type="button" onClick={() => setModule(module === item ? '' : item)} className={`rounded-sm border px-3 py-2 text-sm ${module === item ? 'border-primary bg-primary-bg text-primary' : 'border-line text-ink-secondary hover:border-primary/50'}`}>{item}</button>)}</div></fieldset>
            <fieldset><legend className="text-sm font-semibold text-ink-primary">整体评价（选填）</legend><div className="mt-3 flex gap-1">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`${value} 星`} onClick={() => setRating(value)} className="p-1 text-warning"><Star className={`h-6 w-6 ${rating && value <= rating ? 'fill-current' : ''}`} /></button>)}</div></fieldset>
            <div><label htmlFor="feedback-content" className="text-sm font-semibold text-ink-primary">详细内容</label><textarea id="feedback-content" required maxLength={2000} value={content} onChange={(event) => setContent(event.target.value)} className="mt-2 min-h-36 w-full resize-y rounded-sm border border-line px-3 py-2 text-sm text-ink-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="请说明具体情况、建议或合作需求。" /><p className="mt-1 text-right text-xs text-ink-tertiary">{content.length}/2000</p></div>
            <div><label htmlFor="feedback-contact" className="text-sm font-semibold text-ink-primary">联系方式（选填）</label><input id="feedback-contact" maxLength={120} value={contact} onChange={(event) => setContact(event.target.value)} className="mt-2 h-10 w-full rounded-sm border border-line px-3 text-sm text-ink-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="仅在需要跟进时填写邮箱或手机号" /><p className="mt-1 text-xs leading-5 text-ink-tertiary">请勿提交身份证件、银行账户或其他不必要的敏感信息。</p></div>
            <Button type="submit" size="lg" loading={submitting} disabled={submitting || !content.trim()} className="w-full" leftIcon={<Send className="h-4 w-4" />}>提交反馈</Button>
          </form>
        )}
      </Container>
    </main>
  )
}
