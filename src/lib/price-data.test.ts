import { describe, expect, it } from 'vitest'
import { isMarketPriceFresh } from './price-data'

describe('market price validity window', () => {
  it('accepts quotes up to seven days old and rejects older records', () => {
    const now = new Date('2026-07-15T00:00:00Z')
    expect(isMarketPriceFresh('2026-07-09T00:00:01Z', now)).toBe(true)
    expect(isMarketPriceFresh('2026-07-07T23:59:59Z', now)).toBe(false)
  })
  it('rejects invalid and future timestamps', () => {
    const now = new Date('2026-07-15T00:00:00Z')
    expect(isMarketPriceFresh('invalid', now)).toBe(false)
    expect(isMarketPriceFresh('2026-07-16T00:00:00Z', now)).toBe(false)
  })
})
