import { NextResponse } from 'next/server'
import { authorizeBusinessAction } from '@/lib/auth/server-role-context'
import { capacityInput } from '@/lib/business/inputs'

export async function POST(request: Request) {
  const access = await authorizeBusinessAction('publish_capacity')
  if (!access.allowed) return NextResponse.json({ error: access.reason }, { status: access.status })
  const parsed = capacityInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: '产能字段无效' }, { status: 400 })
  const { error } = await access.supabase.from('capacities').insert({ user_id: access.user.id, device_type: parsed.data.deviceType, capacity: parsed.data.capacity, region: parsed.data.region, price_min: parsed.data.priceMin, price_max: parsed.data.priceMax, available_date: parsed.data.availableDate, status: 'available' })
  if (error) return NextResponse.json({ error: '产能保存失败' }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}
