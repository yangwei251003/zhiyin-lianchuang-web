import { expect, test } from '@playwright/test'

for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
  test(`home has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  })
}

test('reduced motion pauses the hero video and keeps controls usable', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const video = page.locator('video').first()
  await expect(video).toBeVisible()
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true)
  await expect(page.getByRole('button', { name: /播放|暂停/ })).toBeVisible()
  expect(consoleErrors.filter((message) => /hydration|uncaught/i.test(message))).toEqual([])
})

test('brain keeps role guidance and business drafts in a confirmation-only boundary', async ({ page }) => {
  const businessWrites: string[] = []
  page.on('request', (request) => {
    if (request.method() !== 'GET' && request.url().includes('/api/business/')) businessWrites.push(request.url())
  })

  await page.goto('/brain', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: '智印大脑' })).toBeVisible()
  await page.getByRole('button', { name: /印刷厂/ }).click()
  await expect(page.getByLabel('向智印大脑提出问题')).toHaveValue(/印刷厂视角/)
  await page.getByRole('tab', { name: '供需协同' }).click()
  await expect(page.getByRole('heading', { name: '需求信息核对' })).toBeVisible()
  await page.getByRole('button', { name: '把当前需求整理成一张待确认草稿' }).click()
  await expect(page.getByRole('heading', { name: '需求草稿' })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByRole('button', { name: '登录后保存并前往表单' })).toBeVisible()
  expect(businessWrites).toEqual([])
})

for (const route of ['/brain', '/review', '/orders', '/purchase', '/startup', '/training', '/cookies', '/sources']) {
  test(`${route} remains usable on a 390px viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
  })
}
