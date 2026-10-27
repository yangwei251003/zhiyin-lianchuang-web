import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getServerRoleContext } from '@/lib/auth/server-role-context'
import { canPerformRoleAction } from '@/lib/auth/roles'

const input = z.object({ status: z.enum(['accepted', 'rejected']) })

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })
  const parsed = input.safeParse(await request.json().catch(() => null))
  const { id } = await params
  if (!parsed.success || !z.string().uuid().safeParse(id).success) return NextResponse.json({ error: '报价审核请求无效' }, { status: 400 })
  const context = await getServerRoleContext(user.id, user.app_metadata?.role)
  if (!canPerformRoleAction('publish_requirement', context)) return NextResponse.json({ error: '请启用需求方身份并完善资料' }, { status: 403 })
  const { data: bid } = await supabase.from('bids').select('id, order_id, status').eq('id', id).maybeSingle()
  if (!bid || bid.status !== 'pending') return NextResponse.json({ error: '报价不存在或已处理' }, { status: 409 })
  const { data: order } = await supabase.from('orders').select('id, user_id, status').eq('id', bid.order_id).maybeSingle()
  if (!order || order.user_id !== user.id || order.status !== 'open') return NextResponse.json({ error: '只有需求发布者可处理当前报价' }, { status: 403 })

  const service = createServiceClient()
  const { error } = await service.from('bids').update({ status: parsed.data.status }).eq('id', id)
  if (error) return NextResponse.json({ error: '报价状态保存失败' }, { status: 500 })
  if (parsed.data.status === 'accepted') {
    await service.from('bids').update({ status: 'rejected' }).eq('order_id', order.id).neq('id', id).eq('status', 'pending')
    await service.from('orders').update({ status: 'in_progress' }).eq('id', order.id)
  }
  await service.from('admin_audit_logs').insert({ admin_user_id: user.id, action: `bid_${parsed.data.status}`, entity_type: 'bid', entity_id: id, details: { order_id: order.id } })
  return NextResponse.json({ ok: true })
}
