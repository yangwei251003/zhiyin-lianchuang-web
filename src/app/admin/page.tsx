import { requireAdmin } from '@/lib/auth/guard'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { OperationsAdmin } from '@/components/admin/OperationsAdmin'

export default async function AdminPage() {
  await requireAdmin()
  const supabase = await createClient()
  const [{ data: content }, { data: companies }, { data: sources }, { data: audits }] = await Promise.all([
    supabase.from('public_content_snapshots').select('*').order('captured_at', { ascending: false }).limit(50),
    supabase.from('companies').select('*').in('status', ['pending', 'rejected']).order('created_at', { ascending: false }).limit(50),
    supabase.from('source_registry').select('*').order('source_name'),
    supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(50),
  ])
  return <main className="pb-20"><div className="border-b border-[#27384b] bg-[#14263d] text-white"><Container className="py-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f28b5c]">Competition operations</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">运营与可信内容后台</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">聚焦竞赛试运营所需的内容、主体、来源、评审与审计，不扩展为企业 ERP。</p></Container></div><Container size="lg" className="pt-10"><OperationsAdmin initialContent={content ?? []} initialCompanies={companies ?? []} sources={sources ?? []} audits={audits ?? []} /></Container></main>
}
