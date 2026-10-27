import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/0009_business_role_guards.sql'),
  'utf8',
).toLowerCase()

describe('business role guards migration', () => {
  it('adds private drafts without exposing them to the public order feed', () => {
    expect(sql).toContain("'draft'")
    expect(sql).toMatch(/status\s*<>\s*'draft'/)
    expect(sql).toMatch(/auth\.uid\(\)\)\s*=\s*user_id/)
  })

  it('requires the requester role and a complete profile for public requirements', () => {
    expect(sql).toMatch(/role\s*=\s*'requester'/)
    expect(sql).toContain('nickname')
    expect(sql).toContain('phone')
  })

  it('requires approved printer companies for bids and capacities', () => {
    expect(sql).toMatch(/role\s*=\s*'printer'/)
    expect(sql).toContain('companies')
    expect(sql).toMatch(/status\s*=\s*'approved'/)
  })
})
