import { PUBLIC_RESEARCH_FACTS } from '@/lib/public-content'
import type { SnapshotIngestInput } from './governance'

export function collectProjectResearch(): SnapshotIngestInput[] {
  return PUBLIC_RESEARCH_FACTS.map((fact) => ({
    module: 'training',
    displayLabel: '项目自有调研',
    title: `${fact.label}：${fact.value}`,
    summary: fact.detail,
    sourceName: '智印联创 2025 年企业调研',
    sourceUrl: `project://research/${encodeURIComponent(fact.label)}`,
    sourceType: 'project_owned',
    licenseName: '项目自有内容',
    rawExcerpt: `${fact.label} ${fact.value} ${fact.detail}`,
  }))
}

function decodeBasicEntities(value: string) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

export function collectCcgpAnnouncements(html: string): SnapshotIngestInput[] {
  const items: SnapshotIngestInput[] = []
  const anchorPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*(?:title=["']([^"']+)["'])?[^>]*>([\s\S]*?)<\/a>/gi
  for (const match of html.matchAll(anchorPattern)) {
    const href = match[1]
    const title = decodeBasicEntities((match[2] || match[3].replace(/<[^>]+>/g, '')).trim())
    let url: URL
    try { url = new URL(href, 'https://www.ccgp.gov.cn/') } catch { continue }
    if (url.hostname !== 'www.ccgp.gov.cn' || !url.pathname.includes('/cggg/')) continue
    if (!title || title.length < 4) continue
    items.push({
      module: 'orders',
      displayLabel: '官方采购信息',
      title: title.slice(0, 150),
      summary: '来自中国政府采购网公开公告目录。平台仅保留标题与原始链接，详细内容及有效期请以官方页面为准。',
      sourceName: '中国政府采购网',
      sourceUrl: url.toString(),
      sourceType: 'official',
      licenseName: '政府网站公开信息',
      licenseUrl: 'https://www.ccgp.gov.cn/',
      rawExcerpt: title,
    })
    if (items.length >= 20) break
  }
  return items
}
