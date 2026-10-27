import { describe, expect, it } from 'vitest'
import { bidInput, capacityInput, companyApplicationInput, orderInput, supplyOfferInput } from './inputs'

describe('supplyOfferInput', () => {
  it('accepts a complete positive supplier offer', () => {
    expect(supplyOfferInput.safeParse({ purchaseId: crypto.randomUUID(), unitPrice: 6480, minimumQuantity: 1, deliveryDays: 3, note: '含税到厂价' }).success).toBe(true)
  })

  it('rejects non-positive prices and delivery windows', () => {
    expect(supplyOfferInput.safeParse({ purchaseId: crypto.randomUUID(), unitPrice: 0, minimumQuantity: 1, deliveryDays: 0, note: '' }).success).toBe(false)
  })
})

describe('orderInput', () => {
  const valid = { title: '校园开放日画册', category: '画册', craft: '胶印', budgetMin: 1000, budgetMax: 2000, region: '浙江省', description: '需要二十四页骑马钉画册共两千册', mode: 'publish' }
  it('accepts publish and draft modes with a valid budget range', () => {
    expect(orderInput.safeParse(valid).success).toBe(true)
    expect(orderInput.safeParse({ ...valid, mode: 'draft' }).success).toBe(true)
  })
  it('rejects an inverted budget range', () => {
    expect(orderInput.safeParse({ ...valid, budgetMin: 3000 }).success).toBe(false)
  })
})

describe('printer write inputs', () => {
  it('rejects invalid bid and capacity ranges', () => {
    expect(bidInput.safeParse({ orderId: crypto.randomUUID(), price: 0, deliveryDays: 2, note: '' }).success).toBe(false)
    expect(capacityInput.safeParse({ deviceType: '胶印机', capacity: '月产十万印', region: '浙江省', priceMin: 2000, priceMax: 1000, availableDate: '2026-08-01' }).success).toBe(false)
  })
})

describe('companyApplicationInput', () => {
  it('accepts a complete application but no client-controlled review status', () => {
    const result = companyApplicationInput.safeParse({ companyName: '广州测试印刷有限公司', creditCode: '91440101MA5TEST001', licenseImageUrl: 'https://example.com/license.jpg', contactName: '张三', contactPhone: '13800000000', status: 'approved' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).not.toHaveProperty('status')
  })
})
