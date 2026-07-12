import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Prevents generated price series from being mistaken for market evidence. */
export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      code: 'SYNTHETIC_PRICE_SEED_DISABLED',
      message: '模拟纸价初始化已停用。请通过已授权市场价格导入接口写入可验证数据。',
    },
    { status: 410 },
  )
}
