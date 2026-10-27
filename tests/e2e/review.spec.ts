import { expect, test } from '@playwright/test'

test('review code unlocks the isolated three-role campus story', async ({ page }) => {
  const businessWrites: string[] = []
  page.on('request', (request) => {
    if (request.method() !== 'GET' && request.url().includes('/api/business/')) businessWrites.push(request.url())
  })

  await page.goto('/review', { waitUntil: 'domcontentloaded' })
  await expect(page.getByLabel('评审码')).toBeEnabled()
  await page.getByLabel('评审码').fill('campus-print-2026')
  await expect(page.getByRole('button', { name: '进入评审演示' })).toBeEnabled()
  await page.getByRole('button', { name: '进入评审演示' }).click()
  await expect(page).toHaveURL(/\/review\/workspace/, { timeout: 20_000 })
  await expect(page.getByRole('heading', { name: '需求方工作台' })).toBeVisible()

  await page.locator('aside button').click()
  await expect(page.getByRole('heading', { name: '印刷厂工作台' })).toBeVisible()
  await page.locator('aside button').click()
  await expect(page.getByRole('heading', { name: '原料供应商工作台' })).toBeVisible()
  await page.locator('aside button').click()

  await expect(page.getByText('已完成')).toHaveCount(3)
  expect(businessWrites).toEqual([])
})

test('invalid review code stays outside the workspace', async ({ page }) => {
  await page.goto('/review', { waitUntil: 'domcontentloaded' })
  await expect(page.getByLabel('评审码')).toBeEnabled()
  await page.getByLabel('评审码').fill('wrong-code')
  await expect(page.getByRole('button', { name: '进入评审演示' })).toBeEnabled()
  await page.getByRole('button', { name: '进入评审演示' }).click()
  await expect(page.getByText('评审码无效，请重新输入。')).toBeVisible()
  await expect(page).toHaveURL(/\/review$/)
})
