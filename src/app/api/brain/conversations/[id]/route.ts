import { NextResponse } from 'next/server'
import { z } from 'zod'
import { BrainRequestError, getBrainConversation } from '@/lib/brain/server'

const paramsSchema = z.object({ id: z.string().uuid() })

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = paramsSchema.safeParse(await context.params)
  if (!params.success) return NextResponse.json({ error: '会话标识无效。' }, { status: 400 })

  try {
    return NextResponse.json(await getBrainConversation(params.data.id))
  } catch (error) {
    if (error instanceof BrainRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: '智印大脑会话暂时不可用。' }, { status: 500 })
  }
}
