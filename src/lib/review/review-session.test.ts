import { describe, expect, it } from 'vitest'
import { createReviewToken, verifyReviewToken } from './review-session'

describe('review session tokens', () => {
  const secret = 'test-secret-with-enough-entropy'
  const now = new Date('2026-07-15T08:00:00.000Z')

  it('verifies a signed token before it expires', () => {
    const token = createReviewToken({ secret, now, ttlSeconds: 3600 })

    expect(verifyReviewToken(token, { secret, now })).toMatchObject({
      version: 1,
      expiresAt: '2026-07-15T09:00:00.000Z',
    })
  })

  it('rejects a token whose payload was changed', () => {
    const token = createReviewToken({ secret, now, ttlSeconds: 3600 })
    const [payload, signature] = token.split('.')
    const changedPayload = `${payload.slice(0, -1)}${payload.endsWith('a') ? 'b' : 'a'}`

    expect(verifyReviewToken(`${changedPayload}.${signature}`, { secret, now })).toBeNull()
  })

  it('rejects an expired token', () => {
    const token = createReviewToken({ secret, now, ttlSeconds: 60 })
    const later = new Date('2026-07-15T08:01:01.000Z')

    expect(verifyReviewToken(token, { secret, now: later })).toBeNull()
  })
})
