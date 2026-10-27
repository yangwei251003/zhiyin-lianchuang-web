import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authorizeBusinessAction } from '@/lib/auth/server-role-context'
import { orderInput } from '@/lib/business/inputs'

export async function POST(request: Request) {
  const parsed = orderInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: '需求字段不完整或预算区间无效' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })

  if (parsed.data.mode === 'publish') {
    const access = await authorizeBusinessAction('publish_requirement')
    if (!access.allowed) return NextResponse.json({ error: access.reason }, { status: access.status })
  }

  const { data, error } = await supabase.from('orders').insert({
    user_id: user.id,
    title: parsed.data.title,
    category: parsed.data.category,
    craft: parsed.data.craft,
    budget_min: parsed.data.budgetMin,
    budget_max: parsed.data.budgetMax,
    region: parsed.data.region,
    description: parsed.data.description,
    status: parsed.data.mode === 'draft' ? 'draft' : 'open',
  }).select('id, status').single()

  if (error) return NextResponse.json({ error: '需求保存失败，请检查身份与资料完整度' }, { status: 500 })
  return NextResponse.json({ order: data }, { status: 201 })
}
