import Link from 'next/link'
import { ArrowRight, BarChart3, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { HeroBackground } from '@/components/home/HeroBackground'
import { StatsBoard } from '@/components/home/StatsBoard'
import { FeatureEntryCards } from '@/components/home/FeatureEntryCards'
import { ValueBlocks } from '@/components/home/ValueBlocks'
import { PlatformValueSection } from '@/components/home/PlatformValueSection'
import { AICapabilitiesSection } from '@/components/home/AICapabilitiesSection'
import { IndustrialEcologySection } from '@/components/home/IndustrialEcologySection'
import { ProcessFlowSection } from '@/components/home/ProcessFlowSection'
import { CTASection } from '@/components/home/CTASection'
import {
  AIPredictionEntry,
  type PredictionItem,
} from '@/components/home/AIPredictionEntry'

// 首页：服务端组件获取数据，客户端子组件负责交互与动画
export default async function HomePage() {
  const supabase = await createClient()

  // 平台统计：并行查询 companies / profiles / orders 计数
  const [companiesRes, usersRes, ordersRes] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
  ])

  // 绿色认证企业：status = approved
  const greenRes = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  // 行业指数：取最近 6 条历史值（is_predicted=false），按日期倒序
  const { data: rawPredictions } = await supabase
    .from('price_predictions')
    .select('paper_type, price, change_rate, date')
    .eq('is_predicted', false)
    .order('date', { ascending: false })
    .limit(6)

  // 去重：每个纸种仅保留最新一条
  const latestByPaper = new Map<string, PredictionItem>()
  for (const p of rawPredictions ?? []) {
    if (!latestByPaper.has(p.paper_type)) {
      latestByPaper.set(p.paper_type, {
        paper_type: p.paper_type,
        price: p.price,
        change_rate: p.change_rate,
      })
    }
  }

  return (
    <>
      {/* ================================================================
          Hero 区：全屏沉浸式 · 视频背景 · 工业AI指挥中心风格
          ================================================================ */}
      <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden">
        <HeroBackground />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          {/* 品牌标签 */}
          <div className="mb-8 inline-flex animate-fade-in-down items-center gap-2 rounded-full border border-white/20 bg-white/8 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white/85 backdrop-blur-sm sm:text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-light" style={{ boxShadow: '0 0 8px rgba(74,133,230,0.8)' }} />
            Industrial AI · Printing Cloud · Smart Supply Chain
          </div>

          {/* 主标题 */}
          <h1
            className="animate-fade-in-up delay-100 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
            style={{ textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}
          >
            智印联创
          </h1>

          {/* 英文副标 */}
          <p
            className="animate-fade-in-up delay-200 mt-2 text-base font-medium uppercase tracking-[0.25em] sm:text-lg"
            style={{ color: 'rgba(122,166,240,0.8)' }}
          >
            Printing Industry AI Collaboration Platform
          </p>

          {/* 主价值主张 */}
          <p
            className="animate-fade-in-up delay-300 mx-auto mt-7 max-w-2xl text-lg text-white/75 sm:text-xl"
          >
            以人工智能驱动印刷产业全链路协同，
            <br className="hidden sm:block" />
            让每一笔交易更高效、更透明、更省钱
          </p>

          {/* 三个核心数字（实时） */}
          <div className="animate-fade-in-up delay-400 mt-10 flex flex-wrap items-center justify-center gap-8">
            {[
              { value: companiesRes.count ?? 0, label: '联盟企业', suffix: '+' },
              { value: ordersRes.count ?? 0,    label: '完成订单', suffix: '+' },
              { value: 15,                       label: '降本幅度', suffix: '%' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <div
                  className="text-3xl font-bold text-white sm:text-4xl"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {s.value.toLocaleString()}{s.suffix}
                </div>
                <div className="mt-1 text-xs text-white/55 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA 按钮组 */}
          <div className="animate-fade-in-up delay-500 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-primary shadow-xl transition-all duration-base hover:-translate-y-1 hover:shadow-2xl sm:w-auto"
            >
              立即免费入驻
              <ArrowRight className="h-5 w-5 transition-transform duration-fast group-hover:translate-x-1" />
            </Link>
            <Link
              href="/prediction/铜版纸"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/8 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all duration-base hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/12 sm:w-auto"
            >
              <BarChart3 className="h-5 w-5" />
              查看纸价预测
            </Link>
          </div>

          {/* 信任说明 */}
          <p className="animate-fade-in-up delay-600 mt-6 text-sm text-white/40">
            已有 2000+ 印刷企业选择 · 免费注册 · 安全保障
          </p>
        </div>

        {/* 向下滚动指引 */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-float">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/40 uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-5 w-5 text-white/40" />
          </div>
        </div>
      </section>

      {/* ================================================================
          平台价值：核心指标展示
          ================================================================ */}
      <PlatformValueSection />

      {/* ================================================================
          四大核心入口（功能卡片）
          ================================================================ */}
      <FeatureEntryCards />

      {/* ================================================================
          AI 核心能力（深色区块）
          ================================================================ */}
      <AICapabilitiesSection />

      {/* ================================================================
          平台数据看板（工业仪表盘）
          ================================================================ */}
      <StatsBoard
        companies={companiesRes.count ?? 0}
        users={usersRes.count ?? 0}
        orders={ordersRes.count ?? 0}
        greenCompanies={greenRes.count ?? 0}
      />

      {/* ================================================================
          产业链生态图
          ================================================================ */}
      <IndustrialEcologySection />

      {/* ================================================================
          三大价值色块
          ================================================================ */}
      <ValueBlocks />

      {/* ================================================================
          AI 纸价预测入口 + 行业指数
          ================================================================ */}
      <AIPredictionEntry predictions={Array.from(latestByPaper.values())} />

      {/* ================================================================
          合作流程
          ================================================================ */}
      <ProcessFlowSection />

      {/* ================================================================
          底部 CTA
          ================================================================ */}
      <CTASection />
    </>
  )
}
