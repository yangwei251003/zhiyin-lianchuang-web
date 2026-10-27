import Link from 'next/link'
import { requireAuth } from '@/lib/auth/guard'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'

const STATUS: Record<string, string> = { pending: '待审核', shortlisted: '已入围', accepted: '已采纳', rejected: '未采纳', withdrawn: '已撤回' }

export default async function SupplyOffersPage() {
  const session = await requireAuth()
  const supabase = await createClient()
  const { data: offers } = await supabase.from('purchase_supply_offers').select('*').eq('supplier_user_id', session.user.id).order('updated_at', { ascending: false })

  return <main className="pb-16"><Container size="lg" className="pt-8">
    <Link href="/mine" className="text-sm text-primary">← 返回工作台</Link>
    <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-[#c84f20]">Material supply</p>
    <h1 className="mt-2 text-3xl font-bold text-[#14263d]">我的供货方案</h1>
    <p className="mt-2 text-sm text-ink-secondary">方案与真实集采活动关联；评审演示数据不会出现在这里。</p>
    <div className="mt-7 grid gap-3">
      {(offers ?? []).map((offer) => <Link key={offer.id} href={`/purchase/${offer.purchase_id}`} className="grid gap-3 rounded-xl border border-line bg-white p-5 sm:grid-cols-[1fr_auto]">
        <div><p className="font-semibold text-ink-primary">集采编号 {offer.purchase_id.slice(0, 8)}</p><p className="mt-2 text-sm text-ink-secondary">单价 ¥{offer.unit_price} · 起订量 {offer.minimum_quantity} · 交期 {offer.delivery_days} 天</p></div>
        <span className="text-sm font-semibold text-[#c84f20]">{STATUS[offer.status] ?? offer.status}</span>
      </Link>)}
      {!offers?.length && <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-secondary">还没有供货方案。前往集采活动查看可参与项目。</div>}
    </div>
  </Container></main>
}
