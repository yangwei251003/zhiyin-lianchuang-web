import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import type { Database } from '@/types/database'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const paperTypes = ['铜版纸', '双胶纸', '白卡纸', '哑粉铜版纸', '轻涂纸', '新闻纸'] as const

const marketPriceSchema = z.object({
  paperType: z.enum(paperTypes),
  region: z.string().trim().min(1).max(40),
  market: z.string().trim().max(60).default(''),
  specification: z.string().trim().min(1).max(120),
  price: z.coerce.number().positive(),
  unit: z.literal('元/吨').default('元/吨'),
  observedAt: z.string().datetime({ offset: true }),
  source: z.string().trim().min(1).max(80),
  sourceReference: z.string().trim().max(120).optional(),
  sourceUrl: z.url().max(500).optional(),
})

const importPayloadSchema = z.object({
  records: z.array(marketPriceSchema).min(1).max(500),
})

function hasValidImportToken(request: NextRequest) {
  const configuredToken = process.env.PRICE_IMPORT_TOKEN
  const receivedToken = request.headers.get('x-price-import-token')

  if (!configuredToken || !receivedToken) return false

  const configured = Buffer.from(configuredToken)
  const received = Buffer.from(receivedToken)
  return configured.length === received.length && timingSafeEqual(configured, received)
}

/**
 * Imports only source-attributed market prices. It deliberately does not accept
 * generated forecasts, which are stored and governed separately.
 */
export async function POST(request: NextRequest) {
  if (!process.env.PRICE_IMPORT_TOKEN) {
    return NextResponse.json(
      { error: '价格导入未配置，请设置 PRICE_IMPORT_TOKEN。' },
      { status: 503 },
    )
  }

  if (!hasValidImportToken(request)) {
    return NextResponse.json({ error: '未授权的价格导入请求。' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = importPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: '价格数据格式无效。', details: parsed.error.issues },
      { status: 400 },
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: '服务端数据库配置缺失。' }, { status: 503 })
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey)
  const rows = parsed.data.records.map((record) => ({
    paper_type: record.paperType,
    region: record.region,
    market: record.market,
    specification: record.specification,
    price: record.price,
    unit: record.unit,
    observed_at: record.observedAt,
    source: record.source,
    source_reference: record.sourceReference ?? null,
    source_url: record.sourceUrl ?? null,
    verification_status: 'verified' as const,
    verified_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('market_prices')
    .upsert(rows, {
      onConflict: 'source,paper_type,region,market,specification,observed_at',
      ignoreDuplicates: false,
    })

  if (error) {
    console.error('[market-prices/import]', error.message)
    return NextResponse.json({ error: '价格数据写入失败。' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, imported: rows.length })
}
