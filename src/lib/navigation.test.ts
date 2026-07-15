import { describe, expect, it } from 'vitest'
import { PRIMARY_NAV_ITEMS } from './navigation'

describe('primary navigation', () => {
  it('keeps the competition story focused on six public destinations', () => {
    expect(PRIMARY_NAV_ITEMS.map((item) => item.label)).toEqual([
      '首页',
      '供需协同',
      '集中采购',
      '纸价情报',
      '产教实践',
      '项目介绍',
    ])
  })

  it('does not promote the retired AI-first or startup-first labels', () => {
    const labels = PRIMARY_NAV_ITEMS.map((item) => item.label).join('')
    expect(labels).not.toMatch(/智印大脑|创业孵化/)
  })
})
