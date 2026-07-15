import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth/guard'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { OrderPublishForm } from '@/components/order/OrderPublishForm'

export default async function EditOrderDraftPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  const { id } = await params
  const supabase = await createClient()
  const { data: order } = await supabase.from('orders').select('*').eq('id', id).eq('user_id', session.user.id).eq('status', 'draft').maybeSingle()
  if (!order) notFound()
  return <main className="pb-16"><Container size="md" className="pt-8"><Link href="/mine/orders" className="text-sm text-primary">← 返回我的需求</Link><p className="mt-7 text-xs font-semibold uppercase tracking-[.16em] text-[#c84f20]">Requirement draft</p><h1 className="mt-2 text-3xl font-bold text-[#14263d]">继续编辑需求草稿</h1><p className="mb-7 mt-2 text-sm text-ink-secondary">草稿仅你可见；公开发布前会在服务端重新检查需求方身份与资料完整度。</p><OrderPublishForm orderId={order.id} initialValues={{ title: order.title, category: order.category, craft: order.craft, budget_min: order.budget_min, budget_max: order.budget_max, region: order.region, description: order.description }} /></Container></main>
}
