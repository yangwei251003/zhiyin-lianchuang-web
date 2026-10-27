import { NextResponse } from 'next/server'
import { authorizeBusinessAction } from '@/lib/auth/server-role-context'
import { bidInput } from '@/lib/business/inputs'

export async function POST(request: Request) {
  const access = await authorizeBusinessAction('submit_bid')
  if (!access.allowed) return NextResponse.json({ error: access.reason }, { status: access.status })
  const parsed = bidInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: '报价字段无效' }, { status: 400 })
  const { data: order } = await access.supabase.from('orders').select('id, user_id, status').eq('id', parsed.data.orderId).maybeSingle()
  if (!order || order.status !== 'open' || order.user_id === access.user.id) return NextResponse.json({ error: '该需求当前不可报价' }, { status: 409 })
  const { error } = await access.supabase.from('bids').insert({ order_id: order.id, user_id: access.user.id, price: parsed.data.price, delivery_days: parsed.data.deliveryDays, note: parsed.data.note || null, status: 'pending' })
  if (error) return NextResponse.json({ error: '报价保存失败' }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}
