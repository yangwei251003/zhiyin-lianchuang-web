import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const publicFiles = [
  'src/app/page.tsx',
  'src/app/prediction/[paperType]/page.tsx',
  'src/app/startup/page.tsx',
  'src/lib/home-content.ts',
].map((file) => readFileSync(resolve(process.cwd(), file), 'utf8')).join('\n')

describe('public claims audit', () => {
  it('does not advertise unsupported precise AI paper-price forecasts', () => {
    expect(publicFiles).not.toMatch(/ai\s*纸价预测|预测未来\s*30\s*天|全网印刷原材料数据|精准预测纸价/i)
  })
  it('labels the education module as practice rather than startup success', () => {
    expect(publicFiles).toContain('产教实践')
    expect(publicFiles).not.toMatch(/保证收益|成功率|年营收\s*\d/)
  })
})
