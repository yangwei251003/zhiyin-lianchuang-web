import { createHash } from 'node:crypto'
import type { ContentReviewStatus } from '@/types/platform'

type SnapshotFingerprintInput = { sourceUrl: string; title: string; summary: string }

function clean(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function contentFingerprint(input: SnapshotFingerprintInput) {
  return createHash('sha256').update([clean(input.sourceUrl), clean(input.title), clean(input.summary)].join('|')).digest('hex')
}

export function isPublicSnapshotCurrent(snapshot: { reviewStatus: ContentReviewStatus; expiresAt: string | null }, now = new Date()) {
  return snapshot.reviewStatus === 'approved' && (!snapshot.expiresAt || new Date(snapshot.expiresAt).getTime() > now.getTime())
}

export interface SnapshotIngestInput {
  module: 'orders' | 'purchase' | 'startup' | 'training'
  displayLabel: string
  title: string
  summary: string
  coverImage?: string | null
  sourceName: string
  sourceUrl: string
  sourceType: 'project_owned' | 'official' | 'licensed_media'
  licenseName?: string | null
  licenseUrl?: string | null
  publishedAt?: string | null
  expiresAt?: string | null
  rawExcerpt?: string | null
}

export function normalizeSnapshotInput(input: SnapshotIngestInput) {
  const normalized = {
    module: input.module,
    displayLabel: clean(input.displayLabel),
    title: clean(input.title),
    summary: clean(input.summary),
    coverImage: input.coverImage ?? null,
    sourceName: clean(input.sourceName),
    sourceUrl: clean(input.sourceUrl),
    sourceType: input.sourceType,
    licenseName: input.licenseName ?? null,
    licenseUrl: input.licenseUrl ?? null,
    publishedAt: input.publishedAt ?? null,
    expiresAt: input.expiresAt ?? null,
    rawExcerpt: input.rawExcerpt ? clean(input.rawExcerpt).slice(0, 2000) : null,
    reviewStatus: 'pending' as const,
  }
  return { ...normalized, contentHash: contentFingerprint({ sourceUrl: normalized.sourceUrl, title: normalized.title, summary: normalized.summary }) }
}
