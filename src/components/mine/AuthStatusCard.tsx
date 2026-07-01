'use client'

import {
  Clock,
  ShieldCheck,
  XCircle,
  Building2,
  Hash,
  User,
  Phone,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react'
import type { Database } from '@/types/database'
import { cn } from '@/lib/utils'

type Company = Database['public']['Tables']['companies']['Row']

export interface AuthStatusCardProps {
  status: 'pending' | 'approved' | 'rejected'
  company?: Company | null
  onResubmit?: () => void
}

interface StatusConfig {
  icon: LucideIcon
  title: string
  desc: string
  cardCls: string
  iconCls: string
  titleCls: string
}

const STATUS_CONFIG: Record<AuthStatusCardProps['status'], StatusConfig> = {
  pending: {
    icon: Clock,
    title: '审核中',
    desc: '我们正在审核您的企业资料，通常 1-3 个工作日内完成，请耐心等待。',
    cardCls: 'border-warning/30 bg-warning-bg',
    iconCls: 'bg-warning text-white',
    titleCls: 'text-warning',
  },
  approved: {
    icon: ShieldCheck,
    title: '已认证',
    desc: '您的企业已完成实名认证，可享受平台全部交易与服务功能。',
    cardCls: 'border-success/30 bg-success-bg',
    iconCls: 'bg-success text-white',
    titleCls: 'text-success',
  },
  rejected: {
    icon: XCircle,
    title: '已驳回',
    desc: '您的认证申请未通过审核，请根据驳回原因修改后重新提交。',
    cardCls: 'border-danger/30 bg-danger-bg',
    iconCls: 'bg-danger text-white',
    titleCls: 'text-danger',
  },
}

// 认证状态展示卡：根据 status 渲染审核中 / 已认证 / 已驳回三种样式
// pending/approved 展示提交信息预览，rejected 展示驳回原因与"重新提交"按钮
export function AuthStatusCard({
  status,
  company,
  onResubmit,
}: AuthStatusCardProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <div className={cn('rounded-xl border p-5 sm:p-6', config.cardCls)}>
      {/* 状态头部 */}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
            config.iconCls,
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className={cn('text-lg font-bold', config.titleCls)}>
            {config.title}
          </h3>
          <p className="mt-1 text-sm text-ink-secondary">{config.desc}</p>
        </div>
      </div>

      {/* 驳回原因 */}
      {status === 'rejected' && company?.reject_reason && (
        <div className="mt-4 rounded-lg border border-danger/20 bg-white/60 p-4">
          <p className="text-xs font-medium text-danger">驳回原因</p>
          <p className="mt-1 text-sm text-ink-primary">
            {company.reject_reason}
          </p>
        </div>
      )}

      {/* 企业信息预览 */}
      {company && (
        <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg border border-line/60 bg-white/60 p-4 sm:grid-cols-2">
          <InfoRow
            icon={Building2}
            label="企业名称"
            value={company.company_name}
          />
          <InfoRow icon={Hash} label="信用代码" value={company.credit_code} />
          <InfoRow
            icon={User}
            label="联系人"
            value={company.contact_name}
          />
          <InfoRow
            icon={Phone}
            label="联系电话"
            value={company.contact_phone}
          />
        </div>
      )}

      {/* 重新提交按钮 */}
      {status === 'rejected' && onResubmit && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onResubmit}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-danger px-4 text-sm font-medium text-white shadow-sm transition-all duration-fast ease-out-expo hover:-translate-y-0.5 hover:brightness-110"
          >
            <RefreshCw className="h-4 w-4" />
            重新提交认证
          </button>
        </div>
      )}
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-ink-tertiary" />
      <span className="text-xs text-ink-tertiary">{label}</span>
      <span className="truncate text-sm font-medium text-ink-primary">
        {value}
      </span>
    </div>
  )
}
