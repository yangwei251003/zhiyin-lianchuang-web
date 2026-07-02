'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { HeadphonesIcon, MessageCircle, Clock, CheckCircle2, ChevronDown, ArrowRight, Mail, Phone, Zap } from 'lucide-react'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay: i * 0.07, ease: [0.19, 1, 0.22, 1] as any },
})

const faqs = [
  {
    q: '如何注册成为智印联创联盟成员？',
    a: '点击首页"免费入驻"按钮，填写企业基本信息并上传营业执照，我们的工作人员会在1-3个工作日内审核通过。审核通过后即可享受订单大厅、集采商城等全部基础功能。',
  },
  {
    q: 'AI纸价预测的数据来源是什么？精度如何？',
    a: '"智印大脑"AI预测系统实时采集卓创资讯等权威数据源的纸张、油墨等原材料报价数据，采用Prophet+Transformer混合时序预测模型，目前对铜版纸、双胶纸等主流品种的30天预测精度达到87%以上。',
  },
  {
    q: '集中采购的最低参与量是多少？',
    a: '集采商城对单次参与的最低量无硬性要求，但采购量越大享受的折扣越高。通常月用量在5吨以上的企业参与集采会有明显价格优势。平台会定期组织联合集采，提前通知报名。',
  },
  {
    q: '订单撮合平台如何保障双方权益？',
    a: '平台实行严格的企业实名认证制度，所有入驻企业均需提交营业执照和资质证明。交易通过平台担保账户进行，确保"先验货后付款"。同时建立完善的评价体系和纠纷处理机制。',
  },
  {
    q: '如何参加"智印创业营"创业孵化计划？',
    a: '登录后进入"创业孵化"板块，点击"申请入驻"填写创业项目信息。我们的孵化团队会在5个工作日内评估，符合条件的创业者可获得技术培训、设备选型咨询、供应商对接等全链条支持。',
  },
  {
    q: '平台是否免费使用？有哪些收费项目？',
    a: '平台基础功能完全免费，包括企业注册、订单浏览、纸价行情查询等。付费项目包括：VIP会员（享深度报告和实时预警，年费制）、集采差价服务费（按成交额的3-8%）、订单撮合服务费（按成交金额计提）。',
  },
  {
    q: '如何联系客服解决紧急问题？',
    a: '工作日9:00-18:00，可发送邮件至bd@zhiyinlianchuang.com，我们承诺4小时内回复。紧急情况可在平台内使用在线消息功能联系客服，通常30分钟内响应。',
  },
  {
    q: '平台的数据安全如何保障？',
    a: '平台所有数据传输均使用SSL加密，用户交易数据严格脱敏处理。我们定期进行安全审计，建立完整的数据备份机制，严格遵守《数据安全法》和《个人信息保护法》相关规定。',
  },
]

const serviceChannels = [
  { icon: Mail, title: '邮件客服', desc: '适合复杂问题咨询，48小时内必回', value: 'bd@zhiyinlianchuang.com', href: 'mailto:bd@zhiyinlianchuang.com', color: '#2A6CDB' },
  { icon: MessageCircle, title: '平台消息', desc: '登录后在平台内直接发送消息给客服', value: '点击进入消息中心', href: '/messages', color: '#2BAE6E' },
  { icon: Clock, title: '服务时间', desc: '工作日 9:00-18:00，节假日有值班', value: '4小时内必达', href: null, color: '#F08035' },
]

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div {...fadeUp(i * 0.05)}
      className="border-b border-slate-100 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-semibold text-slate-900">{q}</span>
        <ChevronDown className={`mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] as any }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm leading-relaxed text-slate-500">{a}</p>
      </motion.div>
    </motion.div>
  )
}

export default function ServicePage() {
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
            <HeadphonesIcon className="h-3.5 w-3.5" />
            客户服务
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold text-white sm:text-4xl">
            我们随时在这里
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-xl text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            无论您遇到任何问题，我们的客服团队都竭诚为您提供帮助
          </motion.p>
        </div>
      </section>

      {/* 客服渠道 */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {serviceChannels.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.1)}
                  className="rounded-2xl border border-slate-100 p-5 text-center shadow-sm">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: `${s.color}12` }}>
                    <Icon className="h-6 w-6" style={{ color: s.color }} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{s.desc}</p>
                  {s.href ? (
                    <a href={s.href} className="mt-3 block text-sm font-semibold transition-colors"
                      style={{ color: s.color }}>
                      {s.value} →
                    </a>
                  ) : (
                    <div className="mt-3 text-sm font-semibold" style={{ color: s.color }}>{s.value}</div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 常见问题 FAQ */}
      <section className="py-14 sm:py-18" style={{ background: '#F8FAFF' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" />
              常见问题
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900">您可能想知道的</h2>
          </motion.div>
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 divide-y divide-slate-100 px-6">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} i={i} />)}
          </div>

          <motion.div {...fadeUp()} className="mt-10 rounded-2xl p-8 text-center"
            style={{ background: 'linear-gradient(135deg, #0D2040 0%, #1A5CC8 100%)' }}>
            <h3 className="text-base font-bold text-white">没有找到您的问题？</h3>
            <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              直接发送邮件给我们，48 小时内必回
            </p>
            <a href="mailto:bd@zhiyinlianchuang.com"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary transition-all hover:-translate-y-0.5">
              发送邮件咨询 <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
