'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Users, Brain, Code2, TrendingUp, Briefcase, Palette, ArrowRight, Star, Zap, GraduationCap, Building2 } from 'lucide-react'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] as any },
})

// 导师团队
const mentors = [
  {
    name: '叶佐龙',
    role: '校内专业导师',
    org: '广州科技职业技术大学',
    title: '数字印刷技术专业讲师',
    desc: '研究方向：数字印刷技术、色彩管理、印刷工艺优化。指导过多届学生参加省级/国家级创新创业大赛，负责学术指导、技术支持与项目专业把关。',
    photo: '/images/team/yezuolong.jpg',
    tag: '学术导师',
    color: '#2A6CDB',
    initial: '叶',
  },
  {
    name: '邹均长',
    role: '企业产业导师',
    org: '广州七色彩广告策划有限公司',
    title: '法定代表人 · 从业15年+',
    desc: '深耕广告印刷行业15年以上，专业领域：企业管理、市场开拓、供应链整合。负责全量产业资源、客户资源、线下运营渠道对接，保障项目商业落地。',
    photo: '/images/team/zoujunchang.jpg',
    tag: '产业导师',
    color: '#F08035',
    initial: '邹',
  },
]

// 核心团队（数字印刷技术专业）
const coreTeam = [
  {
    name: '何子杰',
    role: '项目负责人 / 产品',
    major: '数字印刷技术',
    class: '24级数字印刷本科3班',
    skills: ['数字印前处理', '色彩管理', '项目管理'],
    desc: '负责项目整体规划、产品功能设计、用户需求分析、原型设计和交互优化，推动平台从0到1落地。',
    photo: '/images/team/hezijie.jpg',
    icon: Star,
    color: '#2A6CDB',
    initial: '何',
  },
  {
    name: '凌广源',
    role: '技术开发',
    major: '数字印刷技术',
    class: '24级数字印刷本科3班',
    skills: ['编程开发', '数据分析', '小程序开发'],
    desc: '负责智印联创小程序前端开发、后端架构、数据处理，确保平台功能的技术实现与性能稳定。',
    photo: '/images/team/lingguangyuan.jpg',
    icon: Code2,
    color: '#2BAE6E',
    initial: '凌',
  },
  {
    name: '张韵',
    role: '市场运营',
    major: '数字印刷技术',
    class: '24级数字印刷本科3班',
    skills: ['市场调研', '用户运营', '内容创作'],
    desc: '负责市场调研（参与312家企业走访）、用户获取策略、品牌内容运营和数据分析工作。',
    photo: '/images/team/zhangyun.jpg',
    icon: TrendingUp,
    color: '#8B5CF6',
    initial: '张',
  },
  {
    name: '于睿',
    role: '商务拓展',
    major: '数字印刷技术',
    class: '24级数字印刷本科3班',
    skills: ['商务谈判', '资源整合', '供应链建设'],
    desc: '负责企业客户对接、供应商关系维护、合作协议洽谈，推动平台商务合作落地。',
    photo: '/images/team/yurui.jpg',
    icon: Briefcase,
    color: '#F08035',
    initial: '于',
  },
  {
    name: '蓝慧慧',
    role: '产品策划',
    major: '数字印刷技术',
    class: '24级数字印刷本科3班',
    skills: ['产品设计', '用户体验', '品牌推广'],
    desc: '负责产品功能策划、用户体验优化、品牌推广和渠道建设，提升平台整体用户满意度。',
    photo: '/images/team/lanhuihui.jpg',
    icon: Palette,
    color: '#D62246',
    initial: '蓝',
  },
]

// AI 研发团队（电气工程及其自动化专业）
const aiTeam = [
  {
    name: '杨炜晨',
    role: 'AI 模型开发 · 组长',
    major: '电气工程及其自动化',
    class: '24电气工程本科5班',
    skills: ['信号处理', '系统建模', 'Python开发'],
    desc: '负责 Prophet+Transformer 混合时序模型训练与优化，将电气工程系统建模思维应用于纸价预测，构建"智印大脑"核心算法。',
    photo: '/images/team/yangweichen.jpg',
    icon: Brain,
    color: '#2A6CDB',
    initial: '杨',
  },
  {
    name: '郑钰莹',
    role: '数据处理与分析',
    major: '电气工程及其自动化',
    class: '24电气工程本科5班',
    skills: ['数据清洗', '特征工程', '数据可视化'],
    desc: '负责历史纸价数据预处理、特征提取、效果评估，构建了完整的数据预处理 Pipeline，为AI模型提供高质量数据基础。',
    photo: '/images/team/zhengyuying.jpg',
    icon: TrendingUp,
    color: '#2BAE6E',
    initial: '郑',
  },
  {
    name: '林纳川',
    role: '系统架构设计',
    major: '电气工程及其自动化',
    class: '24电气工程本科5班',
    skills: ['系统架构', 'API 设计', '云服务部署'],
    desc: '负责 AI 服务架构设计、DeepSeek API 集成、微信云开发平台云端部署，设计了高性能低成本的云原生架构方案。',
    photo: '/images/team/linnachuan.jpg',
    icon: Code2,
    color: '#8B5CF6',
    initial: '林',
  },
  {
    name: '龚文柳',
    role: 'API 集成与测试',
    major: '电气工程及其自动化',
    class: '24电气工程本科5班',
    skills: ['接口开发', '自动化测试', 'CI/CD'],
    desc: '负责 DeepSeek API 封装、系统集成测试、性能监控，实现了完整的 API 监控和告警机制，保障 AI 服务可靠性。',
    photo: '/images/team/gongwenliu.jpg',
    icon: Zap,
    color: '#F08035',
    initial: '龚',
  },
]

// 成长路径时间轴
const journey = [
  { stage: '第一阶段', period: '大一', title: '专业课程学习', desc: '数字印刷工艺、印刷材料学、印刷质量检测等核心课程，奠定专业基础。', color: '#2A6CDB' },
  { stage: '第二阶段', period: '大二上', title: '实训课题立项', desc: '《中小印刷厂纸张损耗优化》实训课题立项，获实训指导老师优秀评价。', color: '#2BAE6E' },
  { stage: '第三阶段', period: '大二寒假', title: '企业跟岗验证', desc: '在合作企业广州七色彩广告策划有限公司、广州艺汇科技有限公司车间实操验证方案。', color: '#F08035' },
  { stage: '第四阶段', period: '大二下', title: '项目孵化升级', desc: '实训课题升级为创业项目，组建团队参加2026中国国际大学生创新大赛。', color: '#D62246' },
]

function MemberCard({ m, i }: { m: (typeof coreTeam)[0], i: number }) {
  return (
    <motion.div {...fadeUp(i * 0.08)}
      className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* 头像 - 直接使用姓氏彩色头像 */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-black"
          style={{ background: `${m.color}18`, border: `1.5px solid ${m.color}35` }}
        >
          <span style={{ color: m.color }}>{m.initial}</span>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">{m.name}</div>
          <div className="text-xs text-slate-500">{m.role}</div>
          <div className="mt-0.5 text-xs" style={{ color: m.color }}>{m.major}</div>
        </div>
      </div>
      <p className="flex-1 text-xs leading-relaxed text-slate-500">{m.desc}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {m.skills.map((s) => (
          <span key={s} className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ background: `${m.color}12`, color: m.color }}>
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function TeamPage() {
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
            专创融合 · 产教协同
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
            className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            一群懂印刷的人<br />
            <span style={{ background: 'linear-gradient(135deg, #4A85E6, #2BAE6E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              做印刷行业的平台
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>
            9 名来自广州科技职业技术大学的学生，数字印刷专业核心团队 + 电气工程AI研发团队，
            在校企双导师联合指导下，历经车间实训→企业跟岗→项目孵化的完整成长路径
          </motion.p>

          {/* 团队概况 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              { label: '团队总人数', value: '9人' },
              { label: '指导老师', value: '2位' },
              { label: '合作企业', value: '2家' },
              { label: '调研企业', value: '312家' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</div>
                <div className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 双导师 */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              双导师联合指导
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">校内导师 + 产业导师</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">每月一次校企联合研讨会，重大决策双导师共同把关</p>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {mentors.map((m, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="flex gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex-shrink-0">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black"
                    style={{ background: `${m.color}18`, border: `1.5px solid ${m.color}35` }}
                  >
                    <span style={{ color: m.color }}>{m.name[0]}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{m.name}</span>
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                      style={{ background: m.color }}>{m.tag}</span>
                  </div>
                  <div className="mt-0.5 text-xs font-medium" style={{ color: m.color }}>{m.title}</div>
                  <div className="mt-0.5 text-xs text-slate-400 flex items-center gap-1">
                    <Building2 className="h-3 w-3" />{m.org}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心团队 */}
      <section className="py-16 sm:py-20" style={{ background: '#F8FAFF' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              <Users className="h-3.5 w-3.5" />
              核心团队
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">数字印刷技术专业 · 5人核心层</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              覆盖产品、技术、市场、运营、商务五大职能维度，形成完整闭环团队
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {coreTeam.map((m, i) => <MemberCard key={m.name} m={m} i={i} />)}
          </div>
        </div>
      </section>

      {/* AI 研发团队 */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
              <Brain className="h-3.5 w-3.5" />
              AI 研发团队
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">电气工程及其自动化 · AI研发4人组</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              负责"智印大脑"Prophet+Transformer混合时序预测模型的开发、部署与维护
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aiTeam.map((m, i) => <MemberCard key={m.name} m={m} i={i} />)}
          </div>
        </div>
      </section>

      {/* 成长路径 */}
      <section className="py-16 sm:py-20" style={{ background: 'linear-gradient(135deg, #061020 0%, #0D2040 100%)' }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: 'rgba(42,108,219,0.2)', border: '1px solid rgba(42,108,219,0.35)', color: '#7BA6F0' }}>
              <Star className="h-3.5 w-3.5" />
              专创融合成长路径
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
              从课堂到产业的完整成长
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              "做中学、学中做"——真实问题驱动，完整项目历练
            </p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary to-transparent sm:left-1/2" />
            <div className="space-y-6">
              {journey.map((j, i) => (
                <motion.div key={i} {...fadeUp(i * 0.1)}
                  className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                >
                  <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white z-10 shadow-lg"
                    style={{ background: j.color }}>
                    <span className="text-xs font-bold text-white">{i + 1}</span>
                  </div>
                  <div className={`ml-16 sm:ml-0 w-full sm:w-5/12 ${i % 2 !== 0 ? 'sm:text-right' : ''}`}>
                    <div className="rounded-2xl bg-white/8 p-5" style={{ border: `1px solid ${j.color}30` }}>
                      <div className="text-xs font-bold uppercase tracking-widest" style={{ color: j.color }}>
                        {j.stage} · {j.period}
                      </div>
                      <h3 className="mt-1 text-sm font-bold text-white">{j.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{j.desc}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block sm:w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">想加入我们的团队？</h2>
            <p className="mt-3 text-sm text-slate-500">我们正在寻找对印刷行业数字化充满热情的伙伴</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/about/join"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5">
                查看加入方式 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50">
                商务合作咨询
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
