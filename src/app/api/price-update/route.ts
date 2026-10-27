import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Historical compatibility endpoint. Price data must now enter through the
 * attributed market-price import route instead of derived futures values.
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      code: 'MARKET_DATA_AUTHORIZATION_REQUIRED',
      message: '市场价格服务等待授权数据接入，未执行任何模拟或推算更新。',
    },
    { status: 503 },
  )
}
