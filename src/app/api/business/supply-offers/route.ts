import { NextResponse } from 'next/server'
import { authorizeBusinessAction } from '@/lib/auth/server-role-context'
import { supplyOfferInput } from '@/lib/business/inputs'

export async function POST(request: Request) {
  const access = await authorizeBusinessAction('submit_supply_offer')
  if (!access.allowed) return NextResponse.json({ error: access.reason }, { status: access.status })

  const parsed = supplyOfferInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: '供货方案字段不完整或超出允许范围' }, { status: 400 })

  const { data: purchase } = await access.supabase.from('purchases').select('id, status, end_time').eq('id', parsed.data.purchaseId).maybeSingle()
  if (!purchase || purchase.status !== 'active' || new Date(purchase.end_time).getTime() <= Date.now()) {
    return NextResponse.json({ error: '该集采活动当前不可提交供货方案' }, { status: 409 })
  }

  const { data, error } = await access.supabase.from('purchase_supply_offers').upsert({
    purchase_id: parsed.data.purchaseId,
    supplier_user_id: access.user.id,
    unit_price: parsed.data.unitPrice,
    minimum_quantity: parsed.data.minimumQuantity,
    delivery_days: parsed.data.deliveryDays,
    note: parsed.data.note,
    status: 'pending',
  }, { onConflict: 'purchase_id,supplier_user_id' }).select('*').single()

  if (error) return NextResponse.json({ error: '供货方案保存失败' }, { status: 500 })
  return NextResponse.json({ offer: data }, { status: 201 })
}
