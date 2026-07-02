import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendMessage, welcomeMessage } from '@/lib/messages'
import type { Database } from '@/types/database'

export const dynamic = 'force-static'
export const runtime = 'nodejs'

// POST /api/messages/welcome
// 注册成功后，客户端调用此接口向新用户发送欢迎消息
// 使用 service_role key 绕过 RLS（新用户还未有会话时）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { userId?: string }
    const userId = body.userId

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    await sendMessage(supabaseAdmin, welcomeMessage(userId))

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[/api/messages/welcome]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
