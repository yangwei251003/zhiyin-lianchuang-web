import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authorizeBusinessAction } from '@/lib/auth/server-role-context'

const reviewInput = z.object({ status: z.enum(['approved', 'rejected', 'archived']), expiresAt: z.string().datetime().nullable().optional() })

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await authorizeBusinessAction('review_content')
  if (!access.allowed) return NextResponse.json({ error: access.reason }, { status: access.status })
  const { id } = await params
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: '内容编号无效' }, { status: 400 })
  const parsed = reviewInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: '审核状态无效' }, { status: 400 })

  const { data, error } = await access.supabase.from('public_content_snapshots').update({ review_status: parsed.data.status, reviewed_by: access.user.id, reviewed_at: new Date().toISOString(), expires_at: parsed.data.expiresAt }).eq('id', id).select('*').single()
  if (error) return NextResponse.json({ error: '审核状态保存失败' }, { status: 500 })
  await access.supabase.from('admin_audit_logs').insert({ admin_user_id: access.user.id, action: `content_${parsed.data.status}`, entity_type: 'public_content_snapshot', entity_id: id, details: { source: data.source_name } })
  return NextResponse.json({ content: data })
}
