'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Newspaper, Tag, ArrowRight, TrendingUp, Shield, Zap, Brain, Clock, ChevronRight } from 'lucide-react'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay: i * 0.07, ease: [0.19, 1, 0.22, 1] as any },
})

const categories = [
  { label: '全部', value: 'all', color: '#2A6CDB' },
  { label: '行业政策', value: 'policy', color: '#2BAE6E' },
  { label: 'AI 快报', value: 'ai', color: '#8B5CF6' },
  { label: '平台动态', value: 'platform', color: '#F08035' },
  { label: '纸价行情', value: 'price', color: '#D62246' },
]

const news = [
  {
    id: 1,
    category: 'policy',
    categoryLabel: '行业政策',
    date: '2025-06-06',
    title: '国家新闻出版署印发《印刷业数字化三年行动计划（2025-2027年）》',
    summary: '国新出发〔2025〕11号文件明确提出，推动全国出版物印刷企业按需印刷出版能力建设，到2027年按需印刷出版产值在出版物印刷产值中占比达5%，数字化转型成为行业政策主基调。',
    tag: '重磅政策',
    color: '#2BAE6E',
    icon: Shield,
    highlight: true,
  },
  {
    id: 2,
    category: 'platform',
    categoryLabel: '平台动态',
    date: '2025-06-20',
    title: '智印联创完成与广州七色彩广告策划有限公司、广州艺汇科技有限公司试点合作验证',
    summary: '经过历时3个月的深度试点，平台帮助合作企业实现产能利用率提升15-25%，原材料采购成本降低8-12%，AI纸价预测精度达到85%以上，合作企业负责人给予高度评价。',
    tag: '里程碑',
    color: '#2A6CDB',
    icon: Zap,
    highlight: true,
  },
  {
    id: 3,
    category: 'price',
    categoryLabel: '纸价行情',
    date: '2025-06-15',
    title: '6月份铜版纸价格走势：受纸浆上涨影响，短期价格承压',
    summary: '根据卓创资讯最新数据，6月份铜版纸现货价格区间在5,800-6,200元/吨，受上游纸浆价格上行影响，预计7月份价格仍有上涨压力。智印大脑AI预测系统建议：把握6月下旬采购窗口，月均用量超过10吨的企业宜适当提前备货。',
    tag: 'AI快报',
    color: '#D62246',
    icon: TrendingUp,
    highlight: false,
  },
  {
    id: 4,
    category: 'ai',
    categoryLabel: 'AI 快报',
    date: '2025-06-10',
    title: '"智印大脑"Prophet+Transformer模型完成第三轮迭代，预测精度提升至87%',
    summary: '经过电气工程及其自动化专业AI研发团队历时6周的数据收集与模型调优，"智印大脑"时序预测模型完成第三轮迭代。新版本引入更多宏观经济指标（PPI、木浆进口量），并优化了Transformer注意力机制，纸价预测精度从82%提升至87%。',
    tag: '技术突破',
    color: '#8B5CF6',
    icon: Brain,
    highlight: false,
  },
  {
    id: 5,
    category: 'policy',
    categoryLabel: '行业政策',
    date: '2025-05-28',
    title: '广东省全国印刷业工业总产值达3085.53亿元，增速6.7%领跑全国',
    summary: '根据广东省新闻出版局发布的《2024年广东省新闻出版业基本情况》，全省印刷企业16,756家，从业人员51.13万人，规上企业突破千家。广东省印刷业持续领跑全国，稳居首位，珠三角已成为全国最大印刷产业集聚区。',
    tag: '行业数据',
    color: '#2BAE6E',
    icon: Shield,
    highlight: false,
  },
  {
    id: 6,
    category: 'platform',
    categoryLabel: '平台动态',
    date: '2025-05-20',
    title: '智印联创集采商城上线"纸张联采"第一期，首批企业降本达11.8%',
    summary: '平台集采商城正式推出纸张联合采购服务，首期汇聚广东省内23家印刷企业参与，整合月采购量超300吨，向广东省内两家大型造纸贸易商成功争取到低于市场均价11.8%的优惠价格。',
    tag: '新功能上线',
    color: '#F08035',
    icon: Zap,
    highlight: false,
  },
  {
    id: 7,
    category: 'price',
    categoryLabel: '纸价行情',
    date: '2025-05-10',
    title: '5月双胶纸价格平稳，包装纸微涨：印刷企业如何把握采购节奏？',
    summary: '5月双胶纸价格整体平稳，现货价格区间5,200-5,500元/吨；白卡纸受下游快递包装需求带动微涨约2%。智印大脑AI建议：双胶纸采购可保持正常节奏，白卡纸如有大量备货需求可适度前移。',
    tag: '行情分析',
    color: '#D62246',
    icon: TrendingUp,
    highlight: false,
  },
  {
    id: 8,
    category: 'platform',
    categoryLabel: '平台动态',
    date: '2025-04-28',
    title: '智印联创参加广东省包装技术协会2025年会，正式与3家印刷产业园区达成合作',
    summary: '团队携平台最新功能亮相广东省包装技术协会年会，现场展示AI纸价预测和订单智能撮合功能，获得参会企业高度关注。会后正式与东莞厚街、佛山南海、潮州庵埠三个印刷产业园区签署战略合作协议，首年预计入驻联盟企业超过80家。',
    tag: '战略合作',
    color: '#2A6CDB',
    icon: Zap,
    highlight: false,
  },
]

export default function NewsPage() {
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
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(42,108,219,0.2)', border: '1px solid rgba(42,108,219,0.35)', color: '#7BA6F0' }}>
            <Newspaper className="h-3.5 w-3.5" />
            新闻动态
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold text-white sm:text-4xl">
            行业资讯与平台动态
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            实时跟踪印刷行业政策、AI纸价预测快报、平台最新进展，助您把握产业机遇
          </motion.p>
        </div>
      </section>

      {/* 分类标签 */}
      <div className="sticky top-16 z-30 border-b border-slate-100 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((c) => (
              <button key={c.value}
                className="flex-shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all"
                style={{ borderColor: `${c.color}30`, background: `${c.color}10`, color: c.color }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 新闻内容 */}
      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* 置顶重磅新闻 */}
          <div className="mb-10 space-y-5">
            {news.filter((n) => n.highlight).map((n, i) => {
              const Icon = n.icon
              return (
                <motion.article key={n.id} {...fadeUp(i * 0.08)}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br p-6 shadow-sm transition-all hover:shadow-md"
                  style={{ borderLeftColor: n.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${n.color}15` }}>
                      <Icon className="h-6 w-6" style={{ color: n.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                          style={{ background: n.color }}>{n.tag}</span>
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ background: `${n.color}12`, color: n.color }}>{n.categoryLabel}</span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />{n.date}
                        </span>
                      </div>
                      <h2 className="mt-2 text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {n.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-3">{n.summary}</p>
                      <button className="mt-3 flex items-center gap-1 text-xs font-semibold transition-colors"
                        style={{ color: n.color }}>
                        阅读全文 <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>

          {/* 普通新闻列表 */}
          <div className="mb-6 text-sm font-semibold text-slate-500">更多动态</div>
          <div className="space-y-4">
            {news.filter((n) => !n.highlight).map((n, i) => {
              const Icon = n.icon
              return (
                <motion.article key={n.id} {...fadeUp(i * 0.06)}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${n.color}12` }}>
                    <Icon className="h-5 w-5" style={{ color: n.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{ background: `${n.color}12`, color: n.color }}>{n.categoryLabel}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />{n.date}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">{n.summary}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300 transition-colors group-hover:text-primary" />
                </motion.article>
              )
            })}
          </div>

          {/* 订阅纸价快报 */}
          <motion.div {...fadeUp()} className="mt-12 rounded-3xl p-8 text-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0D2040 0%, #1A5CC8 100%)' }}
          >
            <Brain className="mx-auto mb-3 h-8 w-8 text-white/70" />
            <h3 className="text-lg font-bold text-white">订阅"智印大脑"纸价快报</h3>
            <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              每周一次纸价趋势分析 + AI 采购策略建议，直达邮箱
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href="/prediction/铜版纸"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary transition-all hover:-translate-y-0.5">
                查看 AI 纸价预测 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
