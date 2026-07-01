import Link from 'next/link'
import { ArrowRight, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { HeroBackground } from '@/components/home/HeroBackground'
import { StatsBoard } from '@/components/home/StatsBoard'
import { FeatureEntryCards } from '@/components/home/FeatureEntryCards'
import { ValueBlocks } from '@/components/home/ValueBlocks'
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
      {/* ===== Hero 区：大屏沉浸式动效背景 + 核心价值主张 ===== */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden md:min-h-[80vh]">
        <HeroBackground />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          {/* 品牌标签 */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:text-sm">
            <BarChart3 className="h-4 w-4" />
            智印联创 · 印刷产业协同平台
          </span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            印刷行业 AI 智能撮合
            <br className="hidden sm:block" />
            与纸价预测平台
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg lg:text-xl">
            让每一笔印刷交易更高效、更透明、更省钱
          </p>

          {/* CTA 按钮组 */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/orders"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-7 text-base font-semibold text-primary shadow-lg transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              立即下单
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/prediction/铜版纸"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur-sm transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-white/10 sm:w-auto"
            >
              查看纸价预测
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 四大核心入口 ===== */}
      <FeatureEntryCards />

      {/* ===== 平台数据看板 ===== */}
      <StatsBoard
        companies={companiesRes.count ?? 0}
        users={usersRes.count ?? 0}
        orders={ordersRes.count ?? 0}
        greenCompanies={greenRes.count ?? 0}
      />

      {/* ===== 三大价值色块 ===== */}
      <ValueBlocks />

      {/* ===== AI 纸价预测入口 + 行业指数 ===== */}
      <AIPredictionEntry predictions={Array.from(latestByPaper.values())} />
    </>
  )
}
