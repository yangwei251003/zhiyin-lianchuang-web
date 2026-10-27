import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const sql = readFileSync(resolve(process.cwd(), 'supabase/migrations/0012_bid_review_security.sql'), 'utf8').toLowerCase()

describe('bid review security', () => {
  it('does not grant ordinary users permission to update bid status', () => {
    expect(sql).toContain('revoke update on public.bids from authenticated')
    expect(sql).toMatch(/grant update\s*\(price, delivery_days, note\)/)
    expect(sql).not.toMatch(/grant update\s*\([^)]*status/)
  })
  it('limits bidder edits to pending quotes', () => {
    expect(sql).toMatch(/status\s*=\s*'pending'/)
    expect(sql).toContain('auth.uid()')
  })
})
