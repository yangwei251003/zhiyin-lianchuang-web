import { NextResponse } from 'next/server'
import { BrainRequestError, listBrainConversations } from '@/lib/brain/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json({ conversations: await listBrainConversations() })
  } catch (error) {
    if (error instanceof BrainRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: '智印大脑历史暂时不可用。' }, { status: 500 })
  }
}
