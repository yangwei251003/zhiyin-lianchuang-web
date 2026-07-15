'use client'

import { useState } from 'react'
import type { Database } from '@/types/database'

type Snapshot = Database['public']['Tables']['public_content_snapshots']['Row']
type Company = Database['public']['Tables']['companies']['Row']
type Source = Database['public']['Tables']['source_registry']['Row']
type Audit = Database['public']['Tables']['admin_audit_logs']['Row']

export function OperationsAdmin({ initialContent, initialCompanies, sources, audits }: { initialContent: Snapshot[]; initialCompanies: Company[]; sources: Source[]; audits: Audit[] }) {
  const [content, setContent] = useState(initialContent)
  const [companies, setCompanies] = useState(initialCompanies)
  const [message, setMessage] = useState('')

  async function reviewContent(id: string, status: 'approved' | 'rejected' | 'archived') {
    const response = await fetch(`/api/admin/content/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) })
    const result = await response.json()
    setMessage(response.ok ? '内容审核状态已保存并写入审计日志。' : result.error)
    if (response.ok) setContent((items) => items.map((item) => item.id === id ? result.content : item))
  }

  async function reviewCompany(id: string, status: 'approved' | 'rejected') {
    const rejectReason = status === 'rejected' ? window.prompt('请输入驳回原因（将展示给申请方）', '资料不完整，请补充后重新提交') : null
    if (status === 'rejected' && rejectReason === null) return
    const response = await fetch(`/api/admin/companies/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status, rejectReason }) })
    const result = await response.json()
    setMessage(response.ok ? '主体认证状态已保存并写入审计日志。' : result.error)
    if (response.ok) setCompanies((items) => items.map((item) => item.id === id ? result.company : item))
  }

  async function resetReview() {
    await fetch('/api/review/session', { method: 'DELETE' })
    setMessage('本浏览器的评审会话已清除；评审故事本身不写入业务数据库。')
  }

  return <div className="space-y-10">
    {message && <p role="status" className="rounded-lg border border-[#edc7b6] bg-[#fff4ee] px-4 py-3 text-sm text-[#7b351b]">{message}</p>}
    <AdminSection eyebrow="Content review" title="采集审核与内容上下架" description="采集结果永远先进入待审区；批准后才会进入公开 RLS 视图。">
      <div className="grid gap-3">{content.map((item) => <article key={item.id} className="rounded-xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold text-[#c84f20]">{item.source_name} · {item.source_type}</p><h3 className="mt-1 font-semibold text-ink-primary">{item.title}</h3></div><span className="rounded-full bg-canvas px-3 py-1 text-xs">{item.review_status}</span></div>
        <p className="mt-3 text-sm leading-6 text-ink-secondary">{item.summary}</p>
        <a href={item.source_url.startsWith('http') ? item.source_url : undefined} target="_blank" rel="noreferrer" className="mt-2 block truncate text-xs text-primary">{item.source_url}</a>
        <div className="mt-4 flex flex-wrap gap-2"><Action onClick={() => reviewContent(item.id, 'approved')}>批准公开</Action><Action onClick={() => reviewContent(item.id, 'rejected')}>拒绝</Action><Action onClick={() => reviewContent(item.id, 'archived')}>下架</Action></div>
      </article>)}{!content.length && <Empty>暂无内容快照。可使用受保护采集接口导入白名单来源。</Empty>}</div>
    </AdminSection>

    <AdminSection eyebrow="Entity review" title="主体认证" description="平台运营审核企业资料；普通用户无权修改认证状态。">
      <div className="grid gap-3 sm:grid-cols-2">{companies.map((company) => <article key={company.id} className="rounded-xl border border-line bg-white p-5"><div className="flex justify-between gap-3"><h3 className="font-semibold text-ink-primary">{company.company_name}</h3><span className="text-xs text-[#c84f20]">{company.status}</span></div><p className="mt-2 text-sm text-ink-secondary">联系人：{company.contact_name} · {company.contact_phone}</p><p className="mt-1 text-xs text-ink-tertiary">统一信用代码：{company.credit_code}</p><div className="mt-4 flex gap-2"><Action onClick={() => reviewCompany(company.id, 'approved')}>通过认证</Action><Action onClick={() => reviewCompany(company.id, 'rejected')}>驳回</Action></div></article>)}{!companies.length && <Empty>暂无待处理主体。</Empty>}</div>
    </AdminSection>

    <AdminSection eyebrow="Source ledger" title="来源与许可台账" description="当前仅允许项目自有、官方公开与许可清晰媒体来源。">
      <div className="overflow-x-auto rounded-xl border border-line bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-canvas text-xs text-ink-tertiary"><tr><th className="p-3">来源</th><th className="p-3">类别</th><th className="p-3">许可</th><th className="p-3">状态</th></tr></thead><tbody>{sources.map((source) => <tr key={source.id} className="border-t border-line"><td className="p-3 font-medium">{source.source_name}</td><td className="p-3">{source.source_type}</td><td className="p-3">{source.license_name ?? '按来源规则'}</td><td className="p-3">{source.is_allowed ? '已列入白名单' : '暂停'}</td></tr>)}</tbody></table></div>
    </AdminSection>

    <AdminSection eyebrow="Review isolation" title="评审演示重置" description="只清除本浏览器签名会话与内存进度，不触碰订单、报价、集采或统计。"><Action onClick={resetReview}>清除本机评审会话</Action></AdminSection>

    <AdminSection eyebrow="Audit trail" title="最近操作审计" description="保留采集、内容审核和主体认证操作。"><div className="rounded-xl border border-line bg-white">{audits.map((audit) => <div key={audit.id} className="grid gap-1 border-b border-line p-4 text-sm last:border-0 sm:grid-cols-[160px_1fr_auto]"><span className="font-mono text-xs text-ink-tertiary">{new Date(audit.created_at).toLocaleString('zh-CN')}</span><span>{audit.action} · {audit.entity_type}</span><span className="text-xs text-ink-tertiary">{audit.entity_id.slice(0, 12)}</span></div>)}{!audits.length && <Empty>暂无审计记录。</Empty>}</div></AdminSection>
  </div>
}

function AdminSection({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) { return <section><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c84f20]">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold text-[#14263d]">{title}</h2><p className="mb-5 mt-2 text-sm text-ink-secondary">{description}</p>{children}</section> }
function Action({ onClick, children }: { onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className="rounded-md border border-[#14263d] px-3 py-2 text-xs font-semibold text-[#14263d] hover:bg-[#14263d] hover:text-white">{children}</button> }
function Empty({ children }: { children: React.ReactNode }) { return <div className="p-6 text-center text-sm text-ink-secondary">{children}</div> }
