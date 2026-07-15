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

for (const route of ['/review', '/orders', '/purchase', '/startup', '/training', '/cookies', '/sources']) {
  test(`${route} remains usable on a 390px viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
  })
}
