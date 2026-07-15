import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const sql = readFileSync(
  resolve(__dirname, '0008_roles_and_supply_offers.sql'),
  'utf8'
).toLowerCase()

describe('roles and supply offers migration', () => {
  it('creates both exposed tables with row level security', () => {
    expect(sql).toContain('create table if not exists public.user_roles')
    expect(sql).toContain('create table if not exists public.purchase_supply_offers')
    expect(sql).toContain('alter table public.user_roles enable row level security')
    expect(sql).toContain('alter table public.purchase_supply_offers enable row level security')
  })

  it('grants Data API access explicitly and scopes writes to authenticated users', () => {
    expect(sql).toContain('grant select, insert, update on public.user_roles to authenticated')
    expect(sql).toContain('grant select, insert, update on public.purchase_supply_offers to authenticated')
    expect(sql).toContain('to authenticated')
    expect(sql).not.toContain('user_metadata')
  })

  it('indexes role and purchase ownership lookups', () => {
    expect(sql).toMatch(/create index[^;]+user_roles_user_id/)
    expect(sql).toMatch(/create index[^;]+purchase_supply_offers_purchase_id/)
    expect(sql).toMatch(/create index[^;]+purchase_supply_offers_supplier_user_id/)
  })

  it('prevents suppliers from promoting their own offer to an accepted state', () => {
    expect(sql).toContain('supply_offers_update_own_pending')
    expect(sql).toMatch(/status\s+in\s+\('pending',\s*'withdrawn'\)/)
    expect(sql).toContain('supply_offers_update_admin')
  })
})
