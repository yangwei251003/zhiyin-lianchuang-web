import Link from 'next/link'
import { Container } from './Container'
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Printer,
  Shield,
  Award,
  Zap,
} from 'lucide-react'

interface FooterSection {
  title: string
  links: { label: string; href: string }[]
}

const sections: FooterSection[] = [
  {
    title: '关于平台',
    links: [
      { label: '平台介绍', href: '/about' },
      { label: '团队故事', href: '/about/team' },
      { label: '加入我们', href: '/about/join' },
      { label: '新闻动态', href: '/about/news' },
    ],
  },
  {
    title: '服务支持',
    links: [
      { label: '订单大厅', href: '/orders' },
      { label: '集采商城', href: '/purchase' },
      { label: '创业孵化', href: '/startup' },
      { label: 'AI 纸价预测', href: '/prediction/铜版纸' },
      { label: '帮助中心', href: '/help' },
    ],
  },
  {
    title: '联系我们',
    links: [
      { label: '商务合作', href: '/contact' },
      { label: '客户服务', href: '/contact/service' },
      { label: '意见反馈', href: '/feedback' },
      { label: '隐私政策', href: '/privacy' },
    ],
  },
]

// 平台信任指标（演示数据）
const trustMetrics = [
  { icon: Shield,  value: 'ISO认证',   desc: '安全可信' },
  { icon: Award,   value: '5星评级',   desc: '行业口碑' },
  { icon: Zap,     value: '99.9%',     desc: '服务稳定性' },
  { icon: Printer, value: '2000+',     desc: '合作企业' },
]

// 底部页脚：深色工业风格，CMYK色谱装饰，品牌叙事
export function Footer() {
  return (
    <footer className="mt-auto" style={{ background: 'linear-gradient(180deg, #0D1A30 0%, #061020 100%)' }}>

      {/* ===== CMYK 色谱装饰条 ===== */}
      <div className="h-1 w-full" aria-hidden>
        <div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(90deg, #00B4D8 0%, #D62246 33%, #F5C518 66%, #2A6CDB 100%)',
          }}
        />
      </div>

      {/* ===== 信任指标横条 ===== */}
      <div
        className="border-b"
        style={{ borderColor: 'rgba(42, 108, 219, 0.15)' }}
      >
        <Container className="py-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trustMetrics.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.value}
                  className="flex items-center gap-3"
                >
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: 'rgba(42, 108, 219, 0.15)', border: '1px solid rgba(42, 108, 219, 0.2)' }}
                  >
                    <Icon className="h-4 w-4 text-primary-light" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{m.value}</p>
                    <p className="text-xs text-industrial-text" style={{ color: '#94A3B8' }}>{m.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </div>

      {/* ===== 主体内容 ===== */}
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* 品牌介绍区（占2列） */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'linear-gradient(135deg, #1A75E8, #0D4FC4)' }}
              >
                <span className="text-lg font-black text-white" style={{ letterSpacing: '-0.04em' }}>智</span>
              </div>
              <div>
                <div className="text-base font-bold text-white">智印联创</div>
                <div className="text-xs" style={{ color: '#64748B' }}>印刷产业协同平台</div>
              </div>
            </div>

            {/* 品牌标语 */}
            <p className="mt-5 max-w-xs text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
              印刷行业领先的 AI 智能协同平台，连接产业上下游，
              驱动数字化转型与智能制造升级。
            </p>

            {/* 品牌定位关键词 */}
            <div className="mt-5 flex flex-wrap gap-2">
              {['Industrial AI', 'Printing Cloud', 'Smart Supply Chain'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    background: 'rgba(42, 108, 219, 0.12)',
                    border: '1px solid rgba(42, 108, 219, 0.2)',
                    color: '#7BA6F0',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 联系信息 */}
            <div className="mt-6 space-y-2.5">
              <a
                href="mailto:bd@zhiyinlianchuang.com"
                className="flex items-center gap-2.5 text-sm transition-colors hover:text-primary-light"
                style={{ color: '#64748B' }}
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                bd@zhiyinlianchuang.com
              </a>
              <div className="flex items-center gap-2.5 text-sm" style={{ color: '#64748B' }}>
                <MapPin className="h-4 w-4 flex-shrink-0" />
                广东省广州市印刷行业数字创新中心
              </div>
            </div>
          </div>

          {/* 导航链接区（各占1列）*/}
          {sections.map((sec) => (
            <div key={sec.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">{sec.title}</h3>
              <ul className="space-y-2.5">
                {sec.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group flex items-center gap-1 text-sm transition-colors hover:text-primary-light"
                      style={{ color: '#64748B' }}
                    >
                      {l.label}
                      <ArrowUpRight
                        className="h-3 w-3 opacity-0 transition-all duration-fast group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ===== 底部版权区 ===== */}
        <div
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: 'rgba(42, 108, 219, 0.12)' }}
        >
          <div className="flex flex-col gap-1">
            <p className="text-xs" style={{ color: '#475569' }}>
              © {new Date().getFullYear()} 智印联创 · 印刷产业 AI 协同平台
            </p>
            <p className="text-xs" style={{ color: '#334155' }}>
              京ICP备XXXXXXXX号 · 增值电信业务经营许可证：京B2-XXXXXXXX
            </p>
          </div>

          {/* 三大价值色条 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs" style={{ color: '#475569' }}>经济价值</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-environment" />
              <span className="text-xs" style={{ color: '#475569' }}>环境价值</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-society" />
              <span className="text-xs" style={{ color: '#475569' }}>社会价值</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
