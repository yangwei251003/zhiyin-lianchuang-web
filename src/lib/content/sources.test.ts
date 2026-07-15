import { describe, expect, it } from 'vitest'
import { collectCcgpAnnouncements, collectProjectResearch } from './sources'

describe('allowlisted sources', () => {
  it('turns project-owned research into pending snapshot inputs', () => {
    const items = collectProjectResearch()
    expect(items.length).toBeGreaterThan(0)
    expect(items.every((item) => item.sourceType === 'project_owned')).toBe(true)
  })
  it('extracts only official ccgp links and strips markup', () => {
    const html = '<a href="/cggg/dfgg/gkzb/202607/t20260715_1.htm" title="某高校印刷服务采购公告">某高校印刷服务采购公告</a><a href="https://evil.example/a">跳转</a>'
    const items = collectCcgpAnnouncements(html)
    expect(items).toHaveLength(1)
    expect(items[0].sourceUrl).toMatch(/^https:\/\/www\.ccgp\.gov\.cn\//)
  })
})
