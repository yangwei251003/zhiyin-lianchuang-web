import Link from 'next/link'
import { FileCheck2, LockKeyhole, MessageCircle } from 'lucide-react'
import { Container } from './Container'
import { PUBLIC_PLATFORM_PROFILE } from '@/lib/public-content'

interface FooterSection {
  title: string
  links: { label: string; href: string }[]
}

const sections: FooterSection[] = [
  {
    title: '平台服务',
    links: [
      { label: '供需协同', href: '/orders' },
      { label: '集中采购', href: '/purchase' },
      { label: '纸价情报', href: '/prediction/白卡纸' },
      { label: '产教实践', href: '/startup' },
    ],
  },
  {
    title: '了解智印',
    links: [
      { label: '平台介绍', href: '/about' },
      { label: '团队介绍', href: '/about/team' },
      { label: '学习资源', href: '/training' },
      { label: '帮助中心', href: '/help' },
    ],
  },
  {
    title: '支持与规则',
    links: [
      { label: '联系我们', href: '/contact' },
      { label: '意见反馈', href: '/feedback' },
      { label: '隐私政策', href: '/privacy' },
      { label: '用户协议', href: '/terms' },
      { label: 'Cookie 说明', href: '/cookies' },
      { label: '数据与媒体来源', href: '/sources' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-[#173B63] bg-[#173B63] text-white">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <p className="text-xl font-bold">{PUBLIC_PLATFORM_PROFILE.name}</p>
            <p className="mt-2 text-sm font-semibold text-[#DCE6F0]">{PUBLIC_PLATFORM_PROFILE.tagline}</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#D6E5F0]">
              {PUBLIC_PLATFORM_PROFILE.description}
            </p>
            <p className="mt-4 text-sm leading-6 text-[#B8CBDD]">{PUBLIC_PLATFORM_PROFILE.launchNotice}</p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-white">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#D6E5F0] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 border-t border-white/20 pt-6 sm:grid-cols-3">
          <p className="inline-flex items-center gap-2 text-sm text-[#D6E5F0]"><LockKeyhole className="size-4" aria-hidden />HTTPS 加密传输</p>
          <p className="inline-flex items-center gap-2 text-sm text-[#D6E5F0]"><FileCheck2 className="size-4" aria-hidden />企业资料按流程审核</p>
          <p className="inline-flex items-center gap-2 text-sm text-[#D6E5F0]"><MessageCircle className="size-4" aria-hidden />实际合作以双方确认的条款为准</p>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/20 pt-6 text-xs text-[#B8CBDD] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 智印联创</p>
          <p>备案信息将在正式上线前按实际情况配置；当前不提供在线支付或资金监管服务。</p>
        </div>
      </Container>
    </footer>
  )
}
