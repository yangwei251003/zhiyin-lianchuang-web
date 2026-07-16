import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDraftConfirmationTarget } from '@/lib/brain/draft-redirect'
import { BrainRequestError, confirmBrainDraft } from '@/lib/brain/server'

const paramsSchema = z.object({ id: z.string().uuid() })

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = paramsSchema.safeParse(await context.params)
  if (!params.success) return NextResponse.json({ error: '草稿标识无效。' }, { status: 400 })

  try {
    const draft = await confirmBrainDraft(params.data.id)
    return NextResponse.json({ target: getDraftConfirmationTarget(draft.contextKind, draft.id) })
  } catch (error) {
    if (error instanceof BrainRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: '草稿确认失败，请稍后再试。' }, { status: 500 })
  }
}
