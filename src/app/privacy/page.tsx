'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Lock, Eye, Database, Share2, ArrowRight, CheckCircle2 } from 'lucide-react'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: i * 0.06 },
})

const sections = [
  {
    icon: Database,
    color: '#2A6CDB',
    title: '一、我们收集的信息',
    content: [
      '**账户信息**：注册时提供的姓名、企业名称、邮箱、手机号等。',
      '**企业资质信息**：企业认证时提交的营业执照、资质证书等。',
      '**交易信息**：平台上发布的订单、集采参与记录、交易记录等。',
      '**使用数据**：访问记录、点击行为、搜索记录等匿名使用数据，用于改善产品体验。',
      '**设备信息**：设备标识符、浏览器类型、IP地址等，用于安全保护。',
    ],
  },
  {
    icon: Eye,
    color: '#2BAE6E',
    title: '二、我们如何使用信息',
    content: [
      '提供、维护和改进智印联创平台的各项服务。',
      '处理交易、发送服务通知和客服沟通。',
      '推送纸价行情、AI预测报告等您订阅的资讯内容。',
      '进行平台安全风险监测，防范欺诈和滥用行为。',
      '在征得您同意的情况下，开展产品调研和用户访谈。',
      '履行法律义务及监管要求。',
    ],
  },
  {
    icon: Share2,
    color: '#F08035',
    title: '三、信息的共享与披露',
    content: [
      '**我们不会出售您的个人信息。**',
      '与合作服务商共享：在提供服务必要范围内，与云计算、支付处理等合作方共享最少必要信息，合作方受保密义务约束。',
      '法律要求：在法院命令、监管要求等法律义务下必要的信息披露。',
      '企业实名信息（企业名称、联系方式）在平台内部向交易对手展示，以保障交易透明度。',
    ],
  },
  {
    icon: Lock,
    color: '#8B5CF6',
    title: '四、数据安全保障',
    content: [
      '所有数据传输均使用 TLS/SSL 加密协议保护。',
      '用户密码经过 bcrypt 哈希加密存储，我们的员工无法查看您的密码。',
      '定期进行安全审计和渗透测试，及时修复安全漏洞。',
      '建立完整的数据备份和灾难恢复机制。',
      '严格的内部数据访问控制，按最小权限原则管理。',
    ],
  },
  {
    icon: Shield,
    color: '#D62246',
    title: '五、您的权利',
    content: [
      '**访问权**：您可以随时查看我们持有的您的个人信息。',
      '**更正权**：如发现信息不准确，您可以申请更正。',
      '**删除权**：在特定情形下，您可以申请删除您的账户和相关数据。',
      '**数据携带权**：您可以申请导出您的交易记录等数据。',
      '**撤回同意**：对于基于同意进行的数据处理，您可以随时撤回同意。',
      '如需行使以上权利，请发送邮件至 bd@zhiyinlianchuang.com。',
    ],
  },
]

export default function PrivacyPage() {
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(42,108,219,0.2)', border: '1px solid rgba(42,108,219,0.35)', color: '#7BA6F0' }}>
            <Shield className="h-3.5 w-3.5" />
            隐私政策
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold text-white sm:text-4xl">
            您的隐私，我们认真对待
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-xl text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            本隐私政策说明智印联创如何收集、使用和保护您的个人信息
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            最后更新日期：2025年6月1日 ｜ 版本号：v1.0
          </motion.div>
        </div>
      </section>

      {/* 核心承诺 */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()}
            className="rounded-2xl border border-green-100 bg-green-50 p-6">
            <h2 className="mb-4 text-sm font-bold text-green-800">我们的核心隐私承诺</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                '我们绝不出售您的个人信息',
                '数据收集最小化，仅用于服务目的',
                '您对自己的数据拥有完整控制权',
                '数据传输和存储全程加密保护',
                '符合《数据安全法》《个人信息保护法》',
                '任何时候您都可以申请删除账户',
              ].map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                  {c}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 详细条款 */}
      <section className="py-10" style={{ background: '#F8FAFF' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sections.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.07)}
                  className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: `${s.color}12` }}>
                      <Icon className="h-5 w-5" style={{ color: s.color }} />
                    </div>
                    <h2 className="text-sm font-bold text-slate-900">{s.title}</h2>
                  </div>
                  <ul className="space-y-2">
                    {s.content.map((c, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: s.color }} />
                        <span dangerouslySetInnerHTML={{ __html: c.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}

            {/* 联系我们 */}
            <motion.div {...fadeUp()} className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
              <h2 className="mb-3 text-sm font-bold text-slate-900">六、联系我们</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                如果您对本隐私政策有任何疑问，或者需要行使您的数据权利，
                请通过以下方式联系我们的数据保护负责人：
              </p>
              <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="font-semibold text-slate-800">智印联创数据保护团队</div>
                <div className="mt-1 text-slate-500">邮箱：bd@zhiyinlianchuang.com</div>
                <div className="text-slate-500">地址：广东省广州市印刷行业数字创新中心</div>
                <div className="text-slate-500">响应时间：5个工作日内</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <motion.div {...fadeUp()}>
            <p className="text-sm text-slate-500">如有任何疑问，请查阅帮助中心或联系客服</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href="/help" className="inline-flex items-center gap-1.5 rounded-xl bg-primary/8 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/15">
                帮助中心 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact/service" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50">
                联系客服
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
