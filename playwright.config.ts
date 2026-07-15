import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: 'output/playwright/results',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm exec next dev -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      REVIEW_ACCESS_CODE: 'campus-print-2026',
      REVIEW_SESSION_SECRET: 'review-secret-at-least-thirty-two-characters',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'test-anon-key',
    },
  },
})
