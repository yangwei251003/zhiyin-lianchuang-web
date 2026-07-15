import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { createServiceClient } from '@/lib/supabase/service'
import { normalizeSnapshotInput } from '@/lib/content/governance'
import { collectCcgpAnnouncements, collectProjectResearch } from '@/lib/content/sources'

function validSecret(request: Request) {
  const expected = process.env.INGEST_CRON_SECRET ?? ''
  const provided = request.headers.get('x-ingest-secret') ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  if (!expected || expected.length !== provided.length) return false
  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided))
}

export async function POST(request: Request) {
  if (!validSecret(request)) return NextResponse.json({ error: '未授权的采集请求' }, { status: 401 })
  const body = await request.json().catch(() => ({})) as { source?: string }
  const sourceKey = body.source ?? 'project_research'
  if (!['project_research', 'ccgp'].includes(sourceKey)) return NextResponse.json({ error: '来源不在白名单' }, { status: 400 })

  const service = createServiceClient()
  const { data: registry } = await service.from('source_registry').select('is_allowed').eq('source_key', sourceKey).maybeSingle()
  if (!registry?.is_allowed) return NextResponse.json({ error: '来源尚未获准采集' }, { status: 403 })

  let rawItems = collectProjectResearch()
  if (sourceKey === 'ccgp') {
    const response = await fetch('https://www.ccgp.gov.cn/cggg/dfgg/gkzb/', { cache: 'no-store', headers: { 'user-agent': 'ZhiyinLianchuangContentReview/1.0' } })
    if (!response.ok) return NextResponse.json({ error: '官方来源暂时不可访问' }, { status: 502 })
    rawItems = collectCcgpAnnouncements(await response.text())
  }

  const rows = rawItems.map(normalizeSnapshotInput).map((item) => ({
    module: item.module, display_label: item.displayLabel, title: item.title, summary: item.summary, cover_image: item.coverImage,
    source_name: item.sourceName, source_url: item.sourceUrl, source_type: item.sourceType, license_name: item.licenseName,
    license_url: item.licenseUrl, published_at: item.publishedAt, expires_at: item.expiresAt, raw_excerpt: item.rawExcerpt,
    review_status: item.reviewStatus, content_hash: item.contentHash, is_demo: false,
  }))
  const { error } = rows.length ? await service.from('public_content_snapshots').upsert(rows, { onConflict: 'content_hash', ignoreDuplicates: true }) : { error: null }
  if (error) return NextResponse.json({ error: '待审内容写入失败' }, { status: 500 })
  await service.from('admin_audit_logs').insert({ admin_user_id: null, action: 'ingest_run', entity_type: 'source', entity_id: sourceKey, details: { collected: rows.length } })
  return NextResponse.json({ source: sourceKey, collected: rows.length, published: 0, reviewStatus: 'pending' })
}
