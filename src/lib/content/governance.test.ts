import { describe, expect, it } from 'vitest'
import { contentFingerprint, isPublicSnapshotCurrent, normalizeSnapshotInput } from './governance'

describe('content governance', () => {
  it('deduplicates equivalent normalized source content', () => {
    const first = contentFingerprint({ sourceUrl: 'https://example.com/a', title: '  测试 标题 ', summary: '内容\n摘要' })
    const second = contentFingerprint({ sourceUrl: 'https://example.com/a', title: '测试 标题', summary: '内容 摘要' })
    expect(first).toBe(second)
  })
  it('requires approved, non-expired content for public display', () => {
    expect(isPublicSnapshotCurrent({ reviewStatus: 'approved', expiresAt: '2099-01-01T00:00:00Z' }, new Date('2026-01-01'))).toBe(true)
    expect(isPublicSnapshotCurrent({ reviewStatus: 'pending', expiresAt: null }, new Date())).toBe(false)
    expect(isPublicSnapshotCurrent({ reviewStatus: 'approved', expiresAt: '2020-01-01T00:00:00Z' }, new Date())).toBe(false)
  })
  it('always creates pending snapshots from ingestion', () => {
    expect(normalizeSnapshotInput({ module: 'orders', displayLabel: '官方采购', title: '公告', summary: '摘要', sourceName: '中国政府采购网', sourceUrl: 'https://www.ccgp.gov.cn/', sourceType: 'official' }).reviewStatus).toBe('pending')
  })
})
