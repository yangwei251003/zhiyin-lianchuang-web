import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const sql = readFileSync(resolve(process.cwd(), 'supabase/migrations/0010_content_review_and_audit.sql'), 'utf8').toLowerCase()

describe('content review and audit migration', () => {
  it('adds provenance, licensing, hashing and review fields', () => {
    for (const field of ['content_hash', 'source_type', 'license_name', 'license_url', 'review_status', 'reviewed_by', 'expires_at', 'raw_excerpt']) expect(sql).toContain(field)
    expect(sql).toContain('unique index')
    expect(sql).toContain('content_hash')
  })
  it('only exposes approved and unexpired content publicly', () => {
    expect(sql).toMatch(/review_status\s*=\s*'approved'/)
    expect(sql).toMatch(/expires_at\s+is\s+null|expires_at\s*>\s*now/)
    expect(sql).not.toMatch(/using\s*\(true\)/)
  })
  it('creates an allowlist and immutable admin audit records', () => {
    expect(sql).toContain('create table if not exists public.source_registry')
    expect(sql).toContain('create table if not exists public.admin_audit_logs')
    expect(sql).toContain('public.is_admin()')
    expect(sql).toContain('grant select')
  })
})
