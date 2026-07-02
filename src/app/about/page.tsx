'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Globe, Brain, Leaf, Factory, Target, TrendingUp,
  Award, Shield, Star, ArrowRight, CheckCircle2, Users, BookOpen, Zap
} from 'lucide-react'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] as any },
})

// 来自312家企业实地调研的真实数据
const surveyStats = [
  {
    value: '78.6%',
    label: '企业无法及时获取纸价',
    desc: '信息滞后 2-7 天，价格剧烈波动时损失占月利润 8-12%',
    color: '#D62246',
    icon: TrendingUp,
  },
  {
    value: '62.3%',
    label: '全国设备平均开机率',
    desc: '近四成产能闲置浪费，企业处于微利甚至亏损状态',
    color: '#F08035',
    icon: Factory,
  },
  {
    value: '85.2%',
    label: '创业者缺资源是最大障碍',
    desc: '启动资金需 150-300 万，入行门槛高，新鲜血液不足',
    color: '#8B5CF6',
    icon: Target,
  },
  {
    value: '1.5万亿',
    label: '全国印刷业年产值规模',
    desc: '全国 10.9 万家印刷企业，232 万从业人员（2024年数据）',
    color: '#2A6CDB',
    icon: Globe,
  },
]

// 四位一体产品体系
const products = [
  {
    icon: TrendingUp,
    color: '#2A6CDB',
    title: '行业资讯共享',
    tag: '信息平权',
    desc: '每日更新纸价行情、政策解读、设备技术动态。VIP 会员享深度报告和实时价格预警。"智印大脑"纸价预测模型提供未来 30 天走势，精度 85%+。',
    metrics: ['每日价格播报', 'AI 趋势预测', '政策解读推送'],
  },
  {
    icon: Factory,
    color: '#2BAE6E',
    title: '订单分发协同',
    tag: '产能共享',
    desc: '平台智能匹配"有单没设备"与"有设备没订单"两端，根据设备类型、产能负荷、地理位置等多维因素实现最优撮合，帮助联盟企业提升产能利用率 15-25%。',
    metrics: ['产能利用率+15-25%', 'AI 智能撮合', '绿色认证优先'],
  },
  {
    icon: Shield,
    color: '#F08035',
    title: '集中采购降本',
    tag: '以量换价',
    desc: '定期组织联盟成员对纸张、油墨、版材等原材料联合集采，以"量大价优"向造纸厂争取最优价格。同时引入供应链金融，为成员企业提供账期支持。',
    metrics: ['采购成本降 8-15%', '供应链金融账期', '严选供应商'],
  },
  {
    icon: BookOpen,
    color: '#8B5CF6',
    title: '创业孵化赋能',
    tag: '5万轻创业',
    desc: '推出"智印创业营"，为印刷行业创业者提供市场选址分析、设备选型建议、技术培训、订单对接等全链条支持，将创业失败率从行业平均 60% 降低至 30% 以下。',
    metrics: ['失败率降至 30%', '全链条孵化支持', '实训基地赋能'],
  },
]

// 三大技术创新亮点
const innovations = [
  {
    num: '01',
    title: '纸张损耗测算工装',
    subtitle: '学生自主研发 · 工艺创新',
    desc: '由团队在实训车间自主设计研发的便携式测算工具，快速计算不同开法的材料利用率。将印刷师傅的经验决策转化为可量化的数据标准，精准把控纸张成本（纸张成本占生产成本约 28%）。',
    highlight: '降低纸张损耗 5-8%',
    color: '#2A6CDB',
    bg: 'from-[#0D2040] to-[#1A3A8C]',
  },
  {
    num: '02',
    title: '绿色印刷排产方案',
    subtitle: 'AI 智能排产 · 降碳减排',
    desc: '基于订单合版拼版算法的智能排产，减少纸张浪费。通过 AI 动态订单匹配将行业整体设备开机率提升 10-15%，同步降低生产边角料损耗与单位碳排放。',
    highlight: '设备开机率+10-15%',
    color: '#2BAE6E',
    bg: 'from-[#0A2318] to-[#1A5C3A]',
  },
  {
    num: '03',
    title: '智印大脑 AI 预测',
    subtitle: 'Prophet + Transformer · DeepSeek',
    desc: '"智印大脑"采用 Prophet+Transformer 混合时序预测模型，实时抓取卓创资讯等权威数据源的纸张、油墨等原材料报价，搭配均值回归算法构建纸价预测与避险体系。',
    highlight: '预测精度 85%+',
    color: '#8B5CF6',
    bg: 'from-[#12082A] to-[#3A1C7C]',
  },
]

// 已验证的平台成效（试点企业数据）
const achievements = [
  { value: '8-15万', unit: '元/年', label: '帮助联盟成员降低成本', icon: TrendingUp, color: '#2BAE6E' },
  { value: '15-25%', unit: '↑', label: '提升产能利用率', icon: Factory, color: '#2A6CDB' },
  { value: '30%↓', unit: '', label: '创业失败率（行业均值60%）', icon: Target, color: '#F08035' },
  { value: '3085亿', unit: '', label: '服务广东省印刷产业集群', icon: Globe, color: '#8B5CF6' },
]

// 合作单位
const partners = [
  {
    name: '广州科技职业技术大学',
    role: '学术支撑单位',
    desc: '数字印刷技术专业，提供理论研究、实训基地与人才培养支持',
    logo: '/images/partners/university.png',
    key: 'university',
  },
  {
    name: '广州七色彩广告策划有限公司',
    role: '产业合作企业',
    desc: '扎根广告印刷行业近10年，拥有海德堡四色印刷机等完整生产线',
    logo: '/images/partners/qicai.png',
    key: 'qicai',
  },
  {
    name: '广州艺汇科技有限公司',
    role: '技术合作企业',
    desc: '设备资产约 2000 万元，6 家高校直营店，提供硬核实体产能',
    logo: '/images/partners/yihui.png',
    key: 'yihui',
  },
]

// 政策背书
const policies = [
  {
    title: '《印刷业数字化三年行动计划（2025-2027年）》',
    org: '国家新闻出版署',
    no: '国新出发〔2025〕11号',
    highlight: '推动印刷业与AI深度融合',
    color: '#2A6CDB',
  },
  {
    title: '《广东省印刷业发展"十四五"规划》',
    org: '广东省新闻出版局',
    no: '省级规划文件',
    highlight: '推动印刷业数字化、智能化、绿色化转型',
    color: '#2BAE6E',
  },
  {
    title: '《关于深化产教融合的若干意见》',
    org: '国务院办公厅',
    no: '产教融合政策',
    highlight: '鼓励职业院校与企业共建实训基地',
    color: '#8B5CF6',
  },
]

export default function AboutPage() {
  return (
    <main className="pb-20">
      {/* ===== Hero ===== */}
      <section
        className="relative overflow-hidden py-24 sm:py-32"
        style={{ background: 'linear-gradient(135deg, #061020 0%, #0D2040 50%, #1A3A8C 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #00B4D8, #D62246, #F5C518, #2A6CDB)' }} />
        {/* 光晕 */}
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #2A6CDB 0%, transparent 70%)' }} />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #2BAE6E 0%, transparent 70%)' }} />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(42,108,219,0.2)', border: '1px solid rgba(42,108,219,0.35)', color: '#7BA6F0' }}
          >
            <Star className="h-3.5 w-3.5" />
            职教赛能 · 产业赋能
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            以职教力量赋能
            <br />
            <span style={{ background: 'linear-gradient(135deg, #4A85E6 0%, #2BAE6E 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              印刷产业数字化转型
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            智印联创由广州科技职业技术大学数字印刷专业学生团队孵化，依托校企双师联合指导，
            历经"实训积淀→企业跟岗→真实孵化"的完整路径，精准解决中小印刷企业三大共性难题，
            让中小印刷企业不再孤单。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              免费入驻平台 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about/team"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              认识我们的团队
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== 调研数据 ===== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              基于 312 家企业实地调研的真实数据
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              印刷行业的真实痛点
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              2025年3月-6月，走访广东、浙江、山东等7省，深入调研 312 家中小印刷企业，以下是最关键的行业痛点
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {surveyStats.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.1)}
                  className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: s.color }} />
                  <Icon className="mb-3 h-6 w-6" style={{ color: s.color }} />
                  <div className="text-3xl font-black" style={{ color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-800">{s.label}</div>
                  <div className="mt-2 text-xs leading-relaxed text-slate-500">{s.desc}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== 四位一体产品体系 ===== */}
      <section className="py-16 sm:py-20" style={{ background: 'linear-gradient(180deg, #F8FAFF 0%, #EEF3FF 100%)' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" />
              四位一体联盟模式
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              全链条赋能中小印刷企业
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              行业资讯共享 + 订单分发协同 + 集中采购降本 + 创业孵化赋能，四个模块协同形成完整服务闭环
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.08)}
                  className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1.5 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                      <Icon className="h-5 w-5" style={{ color: p.color }} />
                    </div>
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                      style={{ background: p.color }}>
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{p.desc}</p>
                  <ul className="mt-4 space-y-1.5">
                    {p.metrics.map((m) => (
                      <li key={m} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: p.color }}>
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== 三大创新亮点 ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
              <Brain className="h-3.5 w-3.5" />
              职教特色创新成果
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              三大原创技术创新
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {innovations.map((v, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-7 text-white ${v.bg}`}
                style={{ border: `1px solid ${v.color}30` }}
              >
                <div className="absolute top-4 right-4 text-5xl font-black opacity-10" style={{ color: v.color }}>
                  {v.num}
                </div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest opacity-60">{v.subtitle}</div>
                <h3 className="text-lg font-bold">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-75">{v.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                  style={{ background: `${v.color}25`, border: `1px solid ${v.color}40`, color: v.color }}>
                  <Zap className="h-3 w-3" />
                  {v.highlight}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 平台已验证成效 ===== */}
      <section className="py-16 sm:py-20" style={{ background: 'linear-gradient(135deg, #061020 0%, #0D2040 100%)' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: 'rgba(43,174,110,0.2)', border: '1px solid rgba(43,174,110,0.3)', color: '#6EDAA8' }}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              试点企业已验证成效
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
              数据说话，成效显著
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              基于广州七色彩广告策划有限公司、广州艺汇科技有限公司试点验证
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {achievements.map((a, i) => {
              const Icon = a.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.1)}
                  className="rounded-2xl p-5 text-center"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${a.color}25` }}
                >
                  <Icon className="mx-auto mb-3 h-6 w-6" style={{ color: a.color }} />
                  <div className="text-2xl font-extrabold sm:text-3xl"
                    style={{ color: a.color, fontFamily: 'JetBrains Mono, monospace' }}>
                    {a.value}<span className="text-base">{a.unit}</span>
                  </div>
                  <div className="mt-1.5 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {a.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== 合作单位 ===== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              <Users className="h-3.5 w-3.5" />
              合作单位
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              校企协同，强强联合
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {partners.map((p, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="flex flex-col items-center rounded-2xl border border-slate-100 p-7 text-center shadow-sm hover:shadow-md transition-all"
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="h-16 w-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `<div class="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-2xl font-black text-primary">${p.name[0]}</div>`
                      }
                    }}
                  />
                </div>
                <span className="mb-2 rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {p.role}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 政策背书 ===== */}
      <section className="py-16 sm:py-20" style={{ background: '#F8FAFF' }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              <Award className="h-3.5 w-3.5" />
              政策支持
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              国家政策全力支持
            </h2>
          </motion.div>
          <div className="space-y-4">
            {policies.map((p, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}
                className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-100"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${p.color}15` }}>
                  <Shield className="h-5 w-5" style={{ color: p.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                    <span className="rounded px-1.5 py-0.5 text-xs font-medium text-white"
                      style={{ background: p.color }}>
                      {p.no}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">发布机构：{p.org}</p>
                  <p className="mt-1.5 text-xs font-semibold" style={{ color: p.color }}>核心要点：{p.highlight}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div {...fadeUp()}
            className="rounded-3xl p-10 shadow-xl"
            style={{ background: 'linear-gradient(135deg, #0D2040 0%, #1A5CC8 100%)' }}
          >
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              加入智印联创产业生态
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              无论您是印刷工厂、品牌客户还是行业创业者，都能在这里找到属于自己的价值
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-md transition-all hover:-translate-y-0.5">
                免费注册入驻 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about/team"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20">
                了解我们的团队
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20">
                商务合作咨询
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
