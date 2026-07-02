'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Briefcase, Code2, TrendingUp, Users, Palette, Brain, ArrowRight, CheckCircle2, Zap, MapPin, Mail, Phone } from 'lucide-react'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] as any },
})

const positions = [
  {
    title: '市场运营实习生',
    type: '实习',
    icon: TrendingUp,
    color: '#2A6CDB',
    desc: '协助开展印刷产业园区地推、内容营销和用户增长工作，参与300+家印刷企业的客户拓展。',
    requirements: ['对印刷行业感兴趣', '有较强的表达和沟通能力', '能接受一定出差频率', '大二及以上在校生优先'],
    benefits: ['深度走访印刷产业集群', '参与真实B2B市场拓展', '导师一对一指导', '实习证明/推荐信'],
  },
  {
    title: '前端开发实习生',
    type: '实习',
    icon: Code2,
    color: '#2BAE6E',
    desc: '参与智印联创 Web 平台与微信小程序的功能迭代，使用 Next.js / React 构建印刷行业数字化功能。',
    requirements: ['熟悉 HTML/CSS/JavaScript', '有 React 或 Vue 基础', '了解微信小程序开发者工具', '有实际项目经验者优先'],
    benefits: ['参与真实产品迭代', '使用 AI 辅助开发工具', '代码审查与技术成长', '转正机会'],
  },
  {
    title: '供应链管理实习生',
    type: '实习',
    icon: Briefcase,
    color: '#F08035',
    desc: '协助平台集采业务运营，对接纸张、油墨等原材料供应商，参与供应商准入评审和价格谈判。',
    requirements: ['了解印刷行业供应链基础', '有较强的谈判与沟通能力', '对数据分析有兴趣', '印刷/材料相关专业优先'],
    benefits: ['接触真实供应链管理', '参与亿级采购谈判', '行业人脉积累', '项目奖金激励'],
  },
  {
    title: 'AI 算法实习生',
    type: '实习',
    icon: Brain,
    color: '#8B5CF6',
    desc: '参与"智印大脑"时序预测模型的优化迭代，使用 Prophet + Transformer 处理纸价预测任务。',
    requirements: ['熟悉 Python，了解机器学习基础', '了解时间序列预测相关知识', '有 TensorFlow/PyTorch 使用经验', '电气/计算机/数学专业优先'],
    benefits: ['真实产业 AI 项目经验', 'DeepSeek API 接入实践', 'AI 研发团队导师指导', '成果共同署名'],
  },
  {
    title: '产品设计实习生',
    type: '实习',
    icon: Palette,
    color: '#D62246',
    desc: '参与平台 UI/UX 设计迭代，为印刷行业用户设计简洁、专业、符合行业审美的数字化界面。',
    requirements: ['熟练使用 Figma 或 Sketch', '有 B2B 平台设计经验者优先', '了解印刷行业基本流程', '有作品集展示'],
    benefits: ['真实 SaaS 产品设计经验', '印刷行业专业知识积累', '参与用户研究访谈', '作品集丰富材料'],
  },
  {
    title: '联盟合作伙伴',
    type: '企业合作',
    icon: Users,
    color: '#00B4D8',
    desc: '欢迎各地印刷企业、产业园区、行业协会与我们建立联盟合作，共享订单、集采降本、联合孵化。',
    requirements: ['印刷行业从业企业', '年营收 300 万以上优先', '愿意开放部分产能数据', '认同平台互助共赢理念'],
    benefits: ['免费加入基础联盟', '享受集采价格折扣', '优先订单分发权益', '联合营销推广支持'],
  },
]

const perks = [
  { title: '校企双师指导', desc: '来自高校的专业导师 + 行业企业家双重指导，快速成长', icon: Users, color: '#2A6CDB' },
  { title: '真实项目历练', desc: '不是打杂，是实际参与产品迭代、客户谈判、AI开发的真实工作', icon: Zap, color: '#2BAE6E' },
  { title: '印刷行业人脉', desc: '接触广东省乃至全国最核心的印刷产业集群，积累稀缺行业人脉', icon: Briefcase, color: '#F08035' },
  { title: '专创融合赋能', desc: '专业知识与创新创业实践深度融合，为未来就业/创业奠基', icon: Brain, color: '#8B5CF6' },
]

export default function JoinPage() {
  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28"
        style={{ background: 'linear-gradient(135deg, #061020 0%, #0D2040 60%, #1A3A8C 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #00B4D8, #D62246, #F5C518, #2A6CDB)' }} />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(42,108,219,0.2)', border: '1px solid rgba(42,108,219,0.35)', color: '#7BA6F0' }}>
            <Users className="h-3.5 w-3.5" />
            加入我们
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
            className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            和我们一起<br />
            <span style={{ background: 'linear-gradient(135deg, #4A85E6, #2BAE6E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              重塑印刷行业的未来
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>
            无论你是在校学生、刚毕业的应届生，还是想寻求合作的印刷企业，
            我们都期待与你并肩探索印刷行业的数字化创新
          </motion.p>
        </div>
      </section>

      {/* 加入优势 */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">加入智印联创，你将获得</h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.08)}
                  className="rounded-2xl border border-slate-100 p-5 text-center shadow-sm">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: `${p.color}12`, border: `1px solid ${p.color}25` }}>
                    <Icon className="h-6 w-6" style={{ color: p.color }} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{p.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 职位列表 */}
      <section className="py-16 sm:py-20" style={{ background: '#F8FAFF' }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" />
              当前开放机会
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">职位 / 合作机会</h2>
          </motion.div>
          <div className="space-y-5">
            {positions.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.06)}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{ background: `${p.color}15` }}>
                          <Icon className="h-4.5 w-4.5" style={{ color: p.color }} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                          style={{ background: p.color }}>{p.type}</span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-slate-500">{p.desc}</p>
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <div className="mb-1.5 text-xs font-bold text-slate-700">任职要求</div>
                          <ul className="space-y-1">
                            {p.requirements.map((r) => (
                              <li key={r} className="flex items-start gap-1.5 text-xs text-slate-500">
                                <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-300" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="mb-1.5 text-xs font-bold text-slate-700">你将获得</div>
                          <ul className="space-y-1">
                            {p.benefits.map((b) => (
                              <li key={b} className="flex items-start gap-1.5 text-xs" style={{ color: p.color }}>
                                <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-start sm:items-center">
                      <a
                        href="mailto:bd@zhiyinlianchuang.com"
                        className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
                        style={{ background: p.color }}
                      >
                        投递简历 <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div {...fadeUp()}
            className="rounded-3xl p-10 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0D2040 0%, #1A5CC8 100%)' }}
          >
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">有想法？直接联系我们</h2>
            <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              发送简历或合作意向至邮箱，我们会在 48 小时内回复
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <a href="mailto:bd@zhiyinlianchuang.com"
                className="flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white">
                <Mail className="h-4 w-4" />
                bd@zhiyinlianchuang.com
              </a>
              <div className="flex items-center gap-2 text-sm text-white/65">
                <MapPin className="h-4 w-4" />
                广东省广州市印刷行业数字创新中心
              </div>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href="mailto:bd@zhiyinlianchuang.com"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-md transition-all hover:-translate-y-0.5">
                发送邮件 <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/about/team"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20">
                了解团队
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
