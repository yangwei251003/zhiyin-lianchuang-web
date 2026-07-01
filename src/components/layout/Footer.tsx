import Link from 'next/link'
import { Container } from './Container'

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

// 底部页脚：三栏链接 + 品牌色装饰条 + 版权备案信息
export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      {/* 经济/环境/社会三色装饰条 */}
      <div className="flex h-1 w-full" aria-hidden>
        <div className="flex-1 bg-primary" />
        <div className="flex-1 bg-success" />
        <div className="flex-1 bg-accent" />
      </div>
      <Container className="py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-gradient">
                <span className="text-sm font-bold text-white">智</span>
              </span>
              <span className="text-base font-bold text-ink-primary">
                智印联创
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-tertiary">
              印刷行业 AI 智能撮合与纸价预测平台，连接经济、环境、社会三重价值。
            </p>
          </div>
          {sections.map((sec) => (
            <div key={sec.title}>
              <h3 className="mb-3 text-sm font-semibold text-ink-primary">
                {sec.title}
              </h3>
              <ul className="space-y-2">
                {sec.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs text-ink-secondary transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-line pt-5 sm:flex-row">
          <p className="text-xs text-ink-tertiary">
            © 2026 智印联创 - 印刷行业 AI 智能撮合与纸价预测平台
          </p>
          <p className="text-xs text-ink-tertiary">京ICP备XXXXXXXX号</p>
        </div>
      </Container>
    </footer>
  )
}
