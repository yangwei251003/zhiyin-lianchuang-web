import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const migration = readFileSync(
  new URL('./0013_brain_private_workspace.sql', import.meta.url),
  'utf8',
)
const grantHardeningMigrationPath = new URL('./0014_brain_private_workspace_grants.sql', import.meta.url)
const usageLogPolicyMigrationPath = new URL('./0015_brain_usage_log_service_policy.sql', import.meta.url)
const functionHardeningMigrationPath = new URL('./0016_database_function_hardening.sql', import.meta.url)

describe('brain private workspace migration', () => {
  it('creates private conversations, messages and confirmation drafts with RLS', () => {
    expect(migration).toContain('create table if not exists public.brain_conversations')
    expect(migration).toContain('create table if not exists public.brain_messages')
    expect(migration).toContain('create table if not exists public.brain_drafts')
    expect(migration).toContain('alter table public.brain_conversations enable row level security')
    expect(migration).toContain('alter table public.brain_messages enable row level security')
    expect(migration).toContain('alter table public.brain_drafts enable row level security')
    expect(migration).toContain('execute function public.update_updated_at_column()')
  })

  it('scopes every user-facing record to auth.uid and keeps usage logs service-only', () => {
    expect(migration).toMatch(/conversation[\s\S]*auth\.uid\(\)/i)
    expect(migration).toMatch(/brain_messages[\s\S]*brain_conversations/i)
    expect(migration).toMatch(/brain_drafts[\s\S]*auth\.uid\(\)/i)
    expect(migration).toContain('create table if not exists public.brain_usage_logs')
    expect(migration).not.toMatch(/grant\s+select\s+on\s+public\.brain_usage_logs\s+to\s+anon/i)
  })

  it('revokes inherited anonymous access while preserving only required authenticated grants', () => {
    const grantHardeningMigration = readFileSync(grantHardeningMigrationPath, 'utf8')

    expect(grantHardeningMigration).toMatch(/revoke\s+all\s+on\s+table\s+public\.brain_conversations\s+from\s+anon/i)
    expect(grantHardeningMigration).toMatch(/revoke\s+all\s+on\s+table\s+public\.brain_usage_logs\s+from\s+anon,\s*authenticated/i)
    expect(grantHardeningMigration).toMatch(/grant\s+select,\s*insert,\s*update,\s*delete\s+on\s+table\s+public\.brain_conversations\s+to\s+authenticated/i)
  })

  it('declares that only the service role can operate on usage logs', () => {
    const usageLogPolicyMigration = readFileSync(usageLogPolicyMigrationPath, 'utf8')

    expect(usageLogPolicyMigration).toMatch(/create policy\s+"brain_usage_logs_service_only"[\s\S]*for all to service_role/i)
    expect(usageLogPolicyMigration).toMatch(/using\s+\(true\)\s+with check\s+\(true\)/i)
  })

  it('hardens the shared trigger function and removes client execution from the DDL event trigger', () => {
    const functionHardeningMigration = readFileSync(functionHardeningMigrationPath, 'utf8')

    expect(functionHardeningMigration).toMatch(/alter function public\.update_updated_at_column\(\) set search_path = pg_catalog, public/i)
    expect(functionHardeningMigration).toMatch(/revoke all on function public\.rls_auto_enable\(\) from public, anon, authenticated/i)
  })
})
