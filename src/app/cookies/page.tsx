import Link from 'next/link'
import { Container } from '@/components/layout/Container'

const items = [
  ['必要会话 Cookie', '用于维持 Supabase 登录状态、保护服务端请求以及保存评审演示的签名会话。关闭后登录和评审入口可能无法工作。'],
  ['偏好信息', '界面可读取系统的“减少动态”偏好，以关闭视差、大幅位移和视频自动播放。当前不使用广告画像 Cookie。'],
  ['评审演示隔离', '评审会话 Cookie 为 HttpOnly 签名令牌；演示进度保存在浏览器运行状态，不写入真实订单、报价、集采或运营统计。'],
  ['管理方式', '你可以通过浏览器设置删除 Cookie。退出登录或在评审工作台重置，也会清除对应会话。'],
] as const

export default function CookiesPage() { return <main className="pb-20"><Container size="md" className="pt-10"><Link href="/" className="text-sm text-primary">← 返回首页</Link><p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-[#c84f20]">Cookie notice</p><h1 className="mt-3 text-3xl font-bold text-[#14263d]">Cookie 与本地偏好说明</h1><p className="mt-3 text-sm text-ink-secondary">最后更新：2026 年 7 月 15 日。当前测试预览仅使用提供核心功能所需的会话和偏好信息。</p><div className="mt-8 divide-y divide-line border-y border-line">{items.map(([title, body]) => <section key={title} className="py-6"><h2 className="font-bold text-[#14263d]">{title}</h2><p className="mt-2 text-sm leading-7 text-ink-secondary">{body}</p></section>)}</div><p className="mt-6 text-sm text-ink-secondary">如需提出访问、更正或删除请求，请前往 <Link href="/feedback" className="font-semibold text-primary">意见反馈</Link>。</p></Container></main> }
