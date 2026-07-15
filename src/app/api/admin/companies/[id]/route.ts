import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authorizeBusinessAction } from '@/lib/auth/server-role-context'
import { createServiceClient } from '@/lib/supabase/service'

const input = z.object({ status: z.enum(['approved', 'rejected']), rejectReason: z.string().trim().max(500).nullable().optional() })

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await authorizeBusinessAction('review_content')
  if (!access.allowed) return NextResponse.json({ error: access.reason }, { status: access.status })
  const { id } = await params
  const parsed = input.safeParse(await request.json().catch(() => null))
  if (!z.string().uuid().safeParse(id).success || !parsed.success) return NextResponse.json({ error: '审核请求无效' }, { status: 400 })
  const service = createServiceClient()
  const { data, error } = await service.from('companies').update({ status: parsed.data.status, reject_reason: parsed.data.status === 'rejected' ? parsed.data.rejectReason || '资料未通过审核' : null }).eq('id', id).select('*').single()
  if (error) return NextResponse.json({ error: '企业审核保存失败' }, { status: 500 })
  await service.from('admin_audit_logs').insert({ admin_user_id: access.user.id, action: `company_${parsed.data.status}`, entity_type: 'company', entity_id: id, details: { company_name: data.company_name } })
  return NextResponse.json({ company: data })
}
