import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { DELETE, POST } from './route'

const originalEnv = { ...process.env }

describe('/api/review/session', () => {
  beforeEach(() => {
    process.env.REVIEW_ACCESS_CODE = 'campus-print-2026'
    process.env.REVIEW_SESSION_SECRET = 'review-secret-at-least-thirty-two-characters'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('rejects an incorrect review code without revealing configuration details', async () => {
    const request = new NextRequest('http://localhost/api/review/session', {
      method: 'POST',
      body: JSON.stringify({ code: 'wrong-code' }),
      headers: { 'content-type': 'application/json' },
    })

    const response = await POST(request)

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: '评审码无效，请重新输入。' })
  })

  it('sets a signed HTTP-only cookie for a valid review code', async () => {
    const request = new NextRequest('http://localhost/api/review/session', {
      method: 'POST',
      body: JSON.stringify({ code: 'campus-print-2026' }),
      headers: { 'content-type': 'application/json' },
    })

    const response = await POST(request)
    const cookie = response.headers.get('set-cookie') ?? ''

    expect(response.status).toBe(200)
    expect(cookie).toContain('review_session=')
    expect(cookie.toLowerCase()).toContain('httponly')
    expect(cookie.toLowerCase()).toContain('samesite=lax')
  })

  it('clears the review cookie when the session is reset', async () => {
    const response = await DELETE()
    const cookie = response.headers.get('set-cookie') ?? ''

    expect(response.status).toBe(200)
    expect(cookie).toContain('review_session=')
    expect(cookie).toContain('Max-Age=0')
  })
})
