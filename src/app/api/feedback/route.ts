import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const feedbackSchema = z.object({
  category: z.enum(['建议', '问题反馈', '合作联系', '其他']),
  module: z.string().trim().max(40).default(''),
  rating: z.number().int().min(1).max(5).nullable().default(null),
  content: z.string().trim().min(1, '请填写反馈内容。').max(2000, '反馈内容不能超过 2000 字。'),
  contact: z.string().trim().max(120, '联系方式不能超过 120 个字符。').default(''),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = feedbackSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? '反馈内容格式不正确。' },
      { status: 400 },
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '请先登录后再提交反馈。' }, { status: 401 })
  }

  const { error } = await supabase.from('feedback_entries').insert({
    user_id: user.id,
    ...parsed.data,
  })
  if (error) {
    console.error('[feedback]', error.message)
    return NextResponse.json({ error: '反馈保存失败，请稍后重试。' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
