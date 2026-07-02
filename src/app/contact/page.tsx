'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, MapPin, Phone, Building2, Users, CheckCircle2, ArrowRight, Handshake, GraduationCap, BarChart3, Send } from 'lucide-react'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] as any },
})

const cooperationTypes = [
  {
    icon: Building2,
    color: '#2A6CDB',
    title: '产业园区合作',
    desc: '与印刷产业园区整体合作，批量赋能入驻企业，实现园区整体数字化升级',
    features: ['园区企业批量入驻', '定制化培训服务', '园区品牌联合推广', '专属数据分析报告'],
  },
  {
    icon: GraduationCap,
    color: '#2BAE6E',
    title: '职业院校合作',
    desc: '与全国职业院校印刷专业深度合作，共建实训基地，输出数字化印刷人才',
    features: ['共建校企实训基地', '纳入专业实训课题', '双向人才输送机制', '产学研科研合作'],
  },
  {
    icon: Handshake,
    color: '#F08035',
    title: '行业协会合作',
    desc: '与印刷行业协会、商会战略合作，共同推动行业标准制定与数字化转型进程',
    features: ['行业标准共同制定', '展会活动联合参与', '行业报告联合发布', '会员企业优惠资源'],
  },
  {
    icon: BarChart3,
    color: '#8B5CF6',
    title: '供应链金融合作',
    desc: '与金融机构、供应链金融平台合作，为联盟印刷企业提供账期支持和融资渠道',
    features: ['企业授信评估对接', '应收账款融资服务', '供应链金融产品设计', '风控数据共享'],
  },
]

const contactInfo = [
  { icon: Mail, label: '商务邮箱', value: 'bd@zhiyinlianchuang.com', href: 'mailto:bd@zhiyinlianchuang.com' },
  { icon: MapPin, label: '办公地址', value: '广东省广州市印刷行业数字创新中心', href: null },
  { icon: Phone, label: '联系电话', value: '（请发邮件，我们48小时内回复）', href: null },
]

const partners = [
  { name: '广州七色彩广告策划有限公司', logo: '/images/partners/qicai.png', role: '深度合作', desc: '海德堡印刷机生产线，首批试点企业' },
  { name: '广州艺汇科技有限公司', logo: '/images/partners/yihui.png', role: '技术合作', desc: '设备资产约2000万，6家高校直营店' },
  { name: '广州科技职业技术大学', logo: '/images/partners/university.png', role: '学术支撑', desc: '数字印刷技术专业，校企共建实训' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', type: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

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
            <Handshake className="h-3.5 w-3.5" />
            商务合作
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
            className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            携手智印联创<br />
            <span style={{ background: 'linear-gradient(135deg, #4A85E6, #2BAE6E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              共建印刷产业数字生态
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>
            我们欢迎印刷产业园区、职业院校、行业协会、金融机构与我们开展多元化战略合作，
            共同推动全国 10.9 万家印刷企业的数字化转型
          </motion.p>
        </div>
      </section>

      {/* 合作模式 */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">四种合作模式</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">我们根据不同合作方的需求，提供定制化的战略合作方案</p>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {cooperationTypes.map((c, i) => {
              const Icon = c.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.08)}
                  className="group rounded-2xl border border-slate-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                      <Icon className="h-5 w-5" style={{ color: c.color }} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">{c.desc}</p>
                  <ul className="mt-4 space-y-1.5">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: c.color }}>
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 表单 + 联系信息 */}
      <section className="py-16 sm:py-20" style={{ background: '#F8FAFF' }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* 表单 */}
            <div className="lg:col-span-3">
              <motion.div {...fadeUp()}>
                <h2 className="text-xl font-extrabold text-slate-900">发起合作洽谈</h2>
                <p className="mt-2 text-sm text-slate-500">填写以下信息，我们的商务团队将在 48 小时内与您联系</p>
              </motion.div>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
                  <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-500" />
                  <h3 className="text-base font-bold text-green-800">提交成功！</h3>
                  <p className="mt-2 text-sm text-green-600">感谢您的信任，我们将在48小时内通过邮件与您联系。</p>
                </motion.div>
              ) : (
                <motion.form {...fadeUp(0.1)} onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">您的姓名 *</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="请输入姓名"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">公司/机构名称 *</label>
                      <input type="text" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="请输入公司名称"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">联系邮箱 *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="请输入邮箱地址"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">合作意向 *</label>
                    <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white">
                      <option value="">请选择合作类型</option>
                      <option value="park">产业园区合作</option>
                      <option value="school">职业院校合作</option>
                      <option value="association">行业协会合作</option>
                      <option value="finance">供应链金融合作</option>
                      <option value="other">其他合作意向</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">详细说明</label>
                    <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="请简要描述您的合作需求和期望..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                    />
                  </div>
                  <button type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90">
                    提交洽谈申请 <Send className="h-4 w-4" />
                  </button>
                </motion.form>
              )}
            </div>

            {/* 联系信息 */}
            <div className="lg:col-span-2 space-y-5">
              <motion.div {...fadeUp(0.1)}>
                <h3 className="text-sm font-bold text-slate-900 mb-4">联系方式</h3>
                <div className="space-y-3">
                  {contactInfo.map((c, i) => {
                    const Icon = c.icon
                    return (
                      <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/8">
                          <Icon className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">{c.label}</div>
                          {c.href ? (
                            <a href={c.href} className="mt-0.5 text-sm font-semibold text-primary hover:underline">{c.value}</a>
                          ) : (
                            <div className="mt-0.5 text-sm font-semibold text-slate-800">{c.value}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              <motion.div {...fadeUp(0.2)}>
                <h3 className="text-sm font-bold text-slate-900 mb-4">现有合作伙伴</h3>
                <div className="space-y-3">
                  {partners.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                        <img src={p.logo} alt={p.name} className="h-10 w-10 object-contain"
                          onError={(e) => {
                            const t = e.target as HTMLImageElement; t.style.display='none'
                            if(t.parentElement) t.parentElement.innerHTML=`<div class="flex h-12 w-12 items-center justify-center text-lg font-black text-primary">${p.name[0]}</div>`
                          }} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{p.name}</div>
                        <div className="mt-0.5 text-xs text-slate-400">{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
