import { NextResponse } from 'next/server'
import { parseBrainRequest } from '@/lib/brain/request'
import { BrainRequestError, runBrainRequest } from '@/lib/brain/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const input = parseBrainRequest(await request.json().catch(() => null))
  if (!input.success) {
    return NextResponse.json({ error: '请填写问题并选择当前业务场景。' }, { status: 400 })
  }

  try {
    const result = await runBrainRequest(input.data)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof BrainRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: '智印大脑暂时不可用，请稍后再试。' }, { status: 500 })
  }
}
