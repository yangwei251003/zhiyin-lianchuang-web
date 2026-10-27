import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const sql = readFileSync(resolve(process.cwd(), 'supabase/migrations/0011_company_review_security.sql'), 'utf8').toLowerCase()

describe('company review security', () => {
  it('prevents ordinary authenticated users from writing review fields', () => {
    expect(sql).toContain('revoke update on public.companies from authenticated')
    expect(sql).toMatch(/grant update\s*\(\s*company_name[\s\S][^;]+contact_phone\s*\)/)
    expect(sql).not.toMatch(/grant update\s*\([^)]*status/)
  })
  it('keeps company records readable by owners and administrators through RLS', () => {
    expect(sql).toContain('companies_select')
    expect(sql).toContain('public.is_admin()')
  })
})
