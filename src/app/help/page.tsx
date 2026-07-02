'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Search, ArrowRight, TrendingUp, Factory, ShoppingCart, GraduationCap, Brain, User, ChevronRight } from 'lucide-react'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay: i * 0.07, ease: [0.19, 1, 0.22, 1] as any },
})

const categories = [
  {
    icon: User,
    color: '#2A6CDB',
    title: '账户与认证',
    desc: '注册、登录、企业认证',
    articles: [
      { title: '如何注册智印联创账号？', url: '#' },
      { title: '企业认证需要哪些资料？', url: '#' },
      { title: '忘记密码怎么找回？', url: '#' },
      { title: '如何修改企业基本信息？', url: '#' },
    ],
  },
  {
    icon: TrendingUp,
    color: '#D62246',
    title: 'AI 纸价预测',
    desc: '智印大脑使用指南',
    articles: [
      { title: 'AI 纸价预测功能介绍', url: '#' },
      { title: '如何查看不同纸张品种的预测？', url: '#' },
      { title: '纸价预警如何设置？', url: '#' },
      { title: '预测精度如何评估？', url: '#' },
    ],
  },
  {
    icon: Factory,
    color: '#2BAE6E',
    title: '订单大厅',
    desc: '发布订单、接单指南',
    articles: [
      { title: '如何发布印刷订单？', url: '#' },
      { title: '接单前需要注意什么？', url: '#' },
      { title: '订单确认和验收流程', url: '#' },
      { title: '交易纠纷如何处理？', url: '#' },
    ],
  },
  {
    icon: ShoppingCart,
    color: '#F08035',
    title: '集采商城',
    desc: '联合集采参与指南',
    articles: [
      { title: '如何参加联合集采活动？', url: '#' },
      { title: '集采报名和付款流程', url: '#' },
      { title: '货物配送说明', url: '#' },
      { title: '集采退换货政策', url: '#' },
    ],
  },
  {
    icon: GraduationCap,
    color: '#8B5CF6',
    title: '创业孵化',
    desc: '智印创业营申请指南',
    articles: [
      { title: '创业孵化项目介绍', url: '#' },
      { title: '如何申请入驻创业孵化？', url: '#' },
      { title: '三阶段孵化路径详解', url: '#' },
      { title: '5万元轻创业模式指南', url: '#' },
    ],
  },
  {
    icon: Brain,
    color: '#00B4D8',
    title: '纸张工装工具',
    desc: '损耗测算工装使用说明',
    articles: [
      { title: '纸张损耗测算工装简介', url: '#' },
      { title: '如何录入纸张规格数据？', url: '#' },
      { title: '开法优化建议说明', url: '#' },
      { title: '测算结果如何导出？', url: '#' },
    ],
  },
]

const quickGuides = [
  { step: '01', title: '注册账号', desc: '提交营业执照完成企业认证', color: '#2A6CDB' },
  { step: '02', title: '浏览功能', desc: '探索订单、集采、AI预测等模块', color: '#2BAE6E' },
  { step: '03', title: '加入联盟', desc: '申请成为联盟正式成员', color: '#F08035' },
  { step: '04', title: '享受权益', desc: '集采优惠、订单撮合、孵化支持', color: '#8B5CF6' },
]

export default function HelpPage() {
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
            <BookOpen className="h-3.5 w-3.5" />
            帮助中心
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold text-white sm:text-4xl">
            有什么可以帮助您？
          </motion.h1>

          {/* 搜索框（视觉展示） */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-8 max-w-lg">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3.5">
              <Search className="h-5 w-5 text-white/50" />
              <span className="text-sm text-white/50">搜索帮助文档...</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 快速入门 */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-8 text-center">
            <h2 className="text-lg font-extrabold text-slate-900">新手快速入门</h2>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {quickGuides.map((g, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ background: g.color }}>
                  {g.step}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{g.title}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{g.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 帮助分类 */}
      <section className="py-12" style={{ background: '#F8FAFF' }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-10 text-center">
            <h2 className="text-xl font-extrabold text-slate-900">帮助文档分类</h2>
            <p className="mt-2 text-sm text-slate-500">按模块浏览常见问题和使用指南</p>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => {
              const Icon = c.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.07)}
                  className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: `${c.color}12` }}>
                      <Icon className="h-5 w-5" style={{ color: c.color }} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{c.title}</div>
                      <div className="text-xs text-slate-400">{c.desc}</div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {c.articles.map((a) => (
                      <li key={a.title}>
                        <a href={a.url}
                          className="flex items-center gap-2 text-xs text-slate-600 transition-colors hover:text-primary">
                          <ChevronRight className="h-3 w-3 flex-shrink-0 text-slate-300" />
                          {a.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 联系客服 */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div {...fadeUp()}
            className="rounded-3xl p-8 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0D2040 0%, #1A5CC8 100%)' }}
          >
            <h3 className="text-lg font-bold text-white">没有找到答案？</h3>
            <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>联系我们的客服团队，我们随时为您解答</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact/service"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary transition-all hover:-translate-y-0.5">
                联系客服 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/feedback"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20">
                提交反馈
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
