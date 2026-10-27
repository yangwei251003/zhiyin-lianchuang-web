import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { companyApplicationInput } from '@/lib/business/inputs'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })
  const parsed = companyApplicationInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: '企业资料不完整或格式无效' }, { status: 400 })
  const service = createServiceClient()
  const payload = { user_id: user.id, company_name: parsed.data.companyName, credit_code: parsed.data.creditCode, license_image_url: parsed.data.licenseImageUrl, contact_name: parsed.data.contactName, contact_phone: parsed.data.contactPhone, status: 'pending', reject_reason: null }
  const { data: existing } = await service.from('companies').select('id, status').eq('user_id', user.id).maybeSingle()
  if (existing?.status === 'approved') return NextResponse.json({ error: '已认证主体如需变更请联系平台复核' }, { status: 409 })
  const query = existing ? service.from('companies').update(payload).eq('id', existing.id) : service.from('companies').insert(payload)
  const { data, error } = await query.select('*').single()
  if (error) return NextResponse.json({ error: '认证申请保存失败' }, { status: 500 })
  await service.from('admin_audit_logs').insert({ admin_user_id: null, action: existing ? 'company_resubmitted' : 'company_submitted', entity_type: 'company', entity_id: data.id, details: { user_id: user.id } })
  return NextResponse.json({ company: data }, { status: 201 })
}
