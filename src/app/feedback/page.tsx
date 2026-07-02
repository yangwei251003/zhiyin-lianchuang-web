'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { MessageSquare, Star, Bug, Lightbulb, CheckCircle2, Send, ArrowRight } from 'lucide-react'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay: i * 0.07, ease: [0.19, 1, 0.22, 1] as any },
})

const feedbackTypes = [
  { value: 'feature', label: '功能建议', icon: Lightbulb, color: '#2A6CDB' },
  { value: 'bug', label: '问题反馈', icon: Bug, color: '#D62246' },
  { value: 'experience', label: '体验评价', icon: Star, color: '#F08035' },
  { value: 'other', label: '其他意见', icon: MessageSquare, color: '#8B5CF6' },
]

const modules = ['首页', '订单大厅', '集采商城', '创业孵化', 'AI纸价预测', '消息中心', '个人中心', '其他']

export default function FeedbackPage() {
  const [type, setType] = useState('')
  const [rating, setRating] = useState(0)
  const [module, setModule] = useState('')
  const [content, setContent] = useState('')
  const [contact, setContact] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!type || !content) return
    setSent(true)
  }

  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20"
        style={{ background: 'linear-gradient(135deg, #061020 0%, #0D2040 60%, #1A3A8C 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #00B4D8, #D62246, #F5C518, #2A6CDB)' }} />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(42,108,219,0.2)', border: '1px solid rgba(42,108,219,0.35)', color: '#7BA6F0' }}>
            <MessageSquare className="h-3.5 w-3.5" />
            意见反馈
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold text-white sm:text-4xl">
            您的每一条反馈<br />都让我们变得更好
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-xl text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            智印联创由一线实训中的真实问题出发，我们始终相信用户是产品最好的老师
          </motion.p>
        </div>
      </section>

      {/* 反馈表单 */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
              </motion.div>
              <h2 className="text-xl font-bold text-green-800">感谢您的反馈！</h2>
              <p className="mt-3 text-sm leading-relaxed text-green-600">
                您的建议已经收到。我们的产品团队会认真阅读每一条反馈，
                并在下一个版本迭代中优先考虑高频需求。
                {contact && '如有需要，我们会通过您留下的联系方式与您沟通。'}
              </p>
              <button onClick={() => setSent(false)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-green-700">
                再提一条反馈 <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <motion.form {...fadeUp()} onSubmit={handleSubmit} className="space-y-6">

              {/* 反馈类型 */}
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">反馈类型 *</label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {feedbackTypes.map((ft) => {
                    const Icon = ft.icon
                    const active = type === ft.value
                    return (
                      <button key={ft.value} type="button"
                        onClick={() => setType(ft.value)}
                        className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all"
                        style={{
                          borderColor: active ? ft.color : '#E2E8F0',
                          background: active ? `${ft.color}10` : 'white',
                          color: active ? ft.color : '#64748B',
                        }}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-semibold">{ft.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 相关模块 */}
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">相关模块</label>
                <div className="flex flex-wrap gap-2">
                  {modules.map((m) => (
                    <button key={m} type="button"
                      onClick={() => setModule(module === m ? '' : m)}
                      className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all"
                      style={{
                        borderColor: module === m ? '#2A6CDB' : '#E2E8F0',
                        background: module === m ? '#EEF4FF' : 'white',
                        color: module === m ? '#2A6CDB' : '#64748B',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* 满意度评分 */}
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">整体满意度</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110">
                      <Star className={`h-8 w-8 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 self-center text-sm text-slate-500">
                      {['', '非常不满意', '不满意', '一般', '满意', '非常满意'][rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* 详细内容 */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">详细描述 *</label>
                <textarea required rows={5} value={content} onChange={(e) => setContent(e.target.value)}
                  placeholder="请详细描述您的建议或遇到的问题，越具体越好，帮助我们快速理解和改进..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                />
                <div className="mt-1 text-right text-xs text-slate-400">{content.length}/500</div>
              </div>

              {/* 联系方式（可选） */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  联系方式 <span className="font-normal text-slate-400">（可选，留下后我们可回复您的反馈）</span>
                </label>
                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)}
                  placeholder="邮箱或手机号"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <button type="submit" disabled={!type || !content}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: type ? '#2A6CDB' : '#94A3B8' }}
              >
                <Send className="h-4 w-4" />
                提交反馈
              </button>

              <p className="text-center text-xs text-slate-400">
                您的反馈会匿名提交，我们承诺保护您的隐私
              </p>
            </motion.form>
          )}
        </div>
      </section>
    </main>
  )
}
