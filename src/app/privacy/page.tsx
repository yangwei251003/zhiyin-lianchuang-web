import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = { title: '隐私政策 · 智印联创', description: '了解智印联创测试预览阶段对个人信息的处理方式。' }

const SECTIONS = [
  { title: '一、适用范围', content: ['本政策适用于智印联创网站的测试预览服务。正式运营前，平台会根据实际业务、备案情况和适用法律更新本政策。', '使用本网站前，请阅读本政策及用户协议。'] },
  { title: '二、可能收集的信息', content: ['账户信息：注册时提交的邮箱、昵称和认证所需信息。', '企业资料：用户主动提交的企业名称、联系人、联系电话和资质文件。', '业务提交内容：需求、产能、报价、采购意向、预约和反馈中由用户主动填写的信息。', '必要技术信息：为提供网页服务产生的会话、请求和错误记录。'] },
  { title: '三、信息使用方式', content: ['用于账户登录、企业资料审核、展示用户主动公开的业务信息，以及支持相关沟通流程。', '用于处理用户主动提交的反馈、服务请求和数据权利申请。', '用于排查故障、维护服务安全及履行法律义务。'] },
  { title: '四、共享与公开', content: ['平台不会出售个人信息。', '用户主动发布的需求、产能或采购意向，仅在实现相关撮合沟通所需的范围内向相关用户展示。', '在法律法规要求或依法配合有权机关时，可能依照法定程序提供必要信息。'] },
  { title: '五、保存与安全', content: ['平台使用 HTTPS 传输，并依赖 Supabase 提供的身份认证和数据存储能力。平台不直接读取或保存用户的明文密码。', '任何网络系统都不能保证绝对安全。请妥善保管账号凭证，避免在反馈、需求描述和公开信息中提交不必要的敏感数据。'] },
  { title: '六、你的权利与联系', content: ['你可以在账户内更新可编辑的个人资料。', '如需更正、删除、导出个人信息或撤回相关同意，请登录后通过意见反馈页提交申请；平台会根据实际能力、法律义务和处理流程予以回应。'] },
] as const

export default function PrivacyPage() {
  return <main className="pb-12"><section className="border-b-2 border-primary bg-white"><Container className="py-8 sm:py-10"><nav className="mb-4 text-xs text-ink-tertiary" aria-label="面包屑"><Link href="/" className="hover:text-primary">首页</Link><span className="mx-1.5">/</span><span className="text-ink-secondary">隐私政策</span></nav><p className="text-xs font-semibold text-primary">数据处理说明</p><h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-ink-primary sm:text-3xl"><ShieldCheck className="h-6 w-6 text-primary" />隐私政策</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">本政策最后更新于 2026 年 7 月 12 日，适用于当前测试预览阶段。</p></Container></section><Container size="md" className="mt-8"><div className="divide-y divide-line rounded-lg border border-line bg-white">{SECTIONS.map((section) => <section key={section.title} className="p-5 sm:p-6"><h2 className="text-lg font-semibold text-ink-primary">{section.title}</h2><ul className="mt-3 space-y-2 text-sm leading-7 text-ink-secondary">{section.content.map((item) => <li key={item} className="border-l-2 border-primary/30 pl-3">{item}</li>)}</ul></section>)}</div><div className="mt-6 flex flex-wrap gap-3"><Link href="/terms" className="inline-flex h-10 items-center gap-1 rounded-md border border-line px-4 text-sm font-semibold text-ink-primary hover:border-primary hover:text-primary">查看用户协议<ArrowRight className="h-4 w-4" /></Link><Link href="/feedback" className="inline-flex h-10 items-center gap-1 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-light">提交隐私相关申请<ArrowRight className="h-4 w-4" /></Link></div></Container></main>
}
