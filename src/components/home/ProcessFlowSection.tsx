'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

interface ProcessStep {
  step: string
  title: string
  desc: string
  detail: string[]
  color: string
}

const STEPS: ProcessStep[] = [
  {
    step: '01',
    title: '注册入驻',
    desc: '快速完成账号注册，填写基本信息',
    detail: ['手机号/邮箱注册', '实名信息认证', '选择企业类型'],
    color: '#2A6CDB',
  },
  {
    step: '02',
    title: '企业认证',
    desc: '完成企业资质认证，解锁核心功能',
    detail: ['营业执照上传', 'AI 智能审核', '绿色认证评级'],
    color: '#00B4D8',
  },
  {
    step: '03',
    title: '发布/接单',
    desc: '发布需求或接受 AI 匹配的优质订单',
    detail: ['AI 智能撮合', '在线投标报价', '双方沟通确认'],
    color: '#2BAE6E',
  },
  {
    step: '04',
    title: '成交结算',
    desc: '安全完成交易，平台全程保障',
    detail: ['合同在线签署', '平台资金监管', '评价与复购'],
    color: '#F08035',
  },
]

export function ProcessFlowSection() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-3">
            <div className="h-px w-10 bg-society/40" />
            <span className="text-xs font-semibold uppercase tracking-widest text-society">
              How It Works
            </span>
            <div className="h-px w-10 bg-society/40" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">
            四步开启协同之旅
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-ink-secondary">
            简单便捷的入驻流程，最快 10 分钟完成认证，立即享受平台核心功能
          </p>
        </div>

        {/* 步骤卡片 */}
        <div className="relative">
          {/* 连接线（桌面端） */}
          <div
            className="absolute left-0 right-0 top-[52px] hidden h-0.5 lg:block"
            style={{ background: 'linear-gradient(90deg, #2A6CDB, #00B4D8, #2BAE6E, #F08035)', marginLeft: '12.5%', marginRight: '12.5%' }}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, idx) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.19,1,0.22,1] }}
                className="group flex flex-col"
              >
                {/* 步骤编号圆 */}
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className="relative flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full border-2 bg-white font-mono text-lg font-bold shadow-sm transition-all duration-base group-hover:scale-110"
                    style={{ borderColor: s.color, color: s.color }}
                  >
                    {s.step}
                    {/* 外圈发光 */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-base group-hover:opacity-100"
                      style={{ boxShadow: `0 0 20px ${s.color}40` }}
                    />
                  </div>
                  <div
                    className="h-px flex-1 lg:hidden"
                    style={{ background: `${s.color}30` }}
                  />
                </div>

                {/* 内容卡片 */}
                <div
                  className="flex-1 rounded-xl border bg-white p-5 shadow-sm transition-all duration-base group-hover:-translate-y-1 group-hover:shadow-md"
                  style={{ borderColor: `${s.color}20` }}
                >
                  <h3
                    className="mb-2 text-base font-bold"
                    style={{ color: s.color }}
                  >
                    {s.title}
                  </h3>
                  <p className="mb-4 text-sm text-ink-secondary">{s.desc}</p>
                  <ul className="space-y-1.5">
                    {s.detail.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-xs text-ink-secondary">
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: s.color }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 底部CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-blue transition-all duration-base hover:-translate-y-0.5 hover:shadow-blue-lg"
          >
            立即免费入驻
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-3 text-sm text-ink-tertiary">已有超过 2000 家印刷企业选择智印联创</p>
        </div>
      </div>
    </section>
  )
}
