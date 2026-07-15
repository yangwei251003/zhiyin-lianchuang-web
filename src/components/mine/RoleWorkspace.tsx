'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Building2, Factory, PackageSearch, Plus, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import type { BusinessRole } from '@/types/platform'

const ROLE_CONTENT: Record<BusinessRole, {
  label: string
  eyebrow: string
  description: string
  icon: typeof Building2
  actions: { label: string; href: string }[]
}> = {
  requester: {
    label: '需求方工作台',
    eyebrow: '把规格、预算与交期一次说清',
    description: '保存需求草稿、公开发布印刷需求，并集中查看来自认证印刷厂的报价。',
    icon: PackageSearch,
    actions: [
      { label: '新建需求 / 草稿', href: '/orders/publish' },
      { label: '管理我的需求', href: '/mine/orders' },
      { label: '参与平台集采', href: '/purchase' },
    ],
  },
  printer: {
    label: '印刷厂工作台',
    eyebrow: '让闲置产能匹配真实需求',
    description: '认证通过后可提交报价、发布可用产能，并从订单到消息持续跟进。',
    icon: Factory,
    actions: [
      { label: '浏览可报价需求', href: '/orders' },
      { label: '发布可用产能', href: '/orders/publish-capacity' },
      { label: '查看我的报价', href: '/mine/bids' },
    ],
  },
  material_supplier: {
    label: '原料供应商工作台',
    eyebrow: '用供货条件参与集采协同',
    description: '认证通过后可针对管理员发布的集采活动提交价格、起订量与交期方案。',
    icon: Building2,
    actions: [
      { label: '查看集采活动', href: '/purchase' },
      { label: '管理供货方案', href: '/mine/supply-offers' },
      { label: '查看纸价情报', href: '/prediction/铜版纸' },
    ],
  },
}

export function RoleWorkspace({ initialRoles, companyApproved }: { initialRoles: BusinessRole[]; companyApproved: boolean }) {
  const user = useAuthStore((state) => state.user)
  const addToast = useUIStore((state) => state.addToast)
  const [roles, setRoles] = useState(initialRoles)
  const [activeRole, setActiveRole] = useState<BusinessRole>(initialRoles[0] ?? 'requester')
  const [adding, setAdding] = useState<BusinessRole | null>(null)
  const content = ROLE_CONTENT[activeRole]
  const availableRoles = useMemo(() => (Object.keys(ROLE_CONTENT) as BusinessRole[]).filter((role) => !roles.includes(role)), [roles])

  async function addRole(role: BusinessRole) {
    if (!user || adding) return
    setAdding(role)
    const { error } = await createClient().from('user_roles').insert({ user_id: user.id, role, status: 'active' })
    setAdding(null)
    if (error) {
      addToast({ type: 'error', message: '身份启用失败，请稍后重试' })
      return
    }
    setRoles((current) => [...current, role])
    setActiveRole(role)
    addToast({ type: 'success', message: `已启用${ROLE_CONTENT[role].label}` })
  }

  const Icon = content.icon
  return (
    <section aria-labelledby="role-workspace-title" className="overflow-hidden rounded-2xl border border-[#cfd5dc] bg-[#f3f1eb]">
      <div className="border-b border-[#cfd5dc] px-5 py-5 sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c84f20]">Business roles</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="role-workspace-title" className="text-xl font-bold text-[#14263d] sm:text-2xl">三角色协同工作台</h2>
            <p className="mt-1 text-sm text-[#5c6672]">一个账号可启用多个身份；切换只改变当前视图，不改变已提交业务数据。</p>
          </div>
          {!companyApproved && roles.some((role) => role !== 'requester') && (
            <Link href="/mine/auth" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c84f20]">
              <ShieldCheck className="h-4 w-4" /> 完成企业认证以解锁业务写入
            </Link>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="业务身份">
          {roles.map((role) => (
            <button key={role} type="button" role="tab" aria-selected={activeRole === role} onClick={() => setActiveRole(role)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${activeRole === role ? 'border-[#14263d] bg-[#14263d] text-white' : 'border-[#aeb6bf] bg-white text-[#344454] hover:border-[#14263d]'}`}>
              {ROLE_CONTENT[role].label.replace('工作台', '')}
            </button>
          ))}
          {availableRoles.map((role) => (
            <button key={role} type="button" disabled={Boolean(adding)} onClick={() => addRole(role)} className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#aeb6bf] bg-transparent px-4 py-2 text-sm font-medium text-[#5c6672] hover:border-[#c84f20] hover:text-[#c84f20] disabled:opacity-50">
              <Plus className="h-3.5 w-3.5" /> {adding === role ? '启用中…' : `启用${ROLE_CONTENT[role].label.replace('工作台', '')}`}
            </button>
          ))}
        </div>
      </div>

      <motion.div data-motion-safe key={activeRole} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#14263d] text-white"><Icon className="h-6 w-6" /></span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#c84f20]">{content.eyebrow}</p>
          <h3 className="mt-2 text-2xl font-bold text-[#14263d]">{content.label}</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#5c6672]">{content.description}</p>
        </div>
        <div className="grid gap-3">
          {content.actions.map((action, index) => (
            <Link key={action.href} href={action.href} className="group flex items-center justify-between border-b border-[#c8cdd2] bg-white px-4 py-4 text-sm font-semibold text-[#14263d] transition-transform hover:-translate-y-0.5">
              <span><span className="mr-3 font-mono text-xs text-[#c84f20]">0{index + 1}</span>{action.label}</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
