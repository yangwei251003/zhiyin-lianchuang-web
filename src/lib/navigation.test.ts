import { describe, expect, it } from 'vitest'
import { PRIMARY_NAV_ITEMS } from './navigation'

describe('primary navigation', () => {
  it('makes 智印大脑 a first-class public destination beside the business flow', () => {
    expect(PRIMARY_NAV_ITEMS.map((item) => item.label)).toEqual([
      '首页',
      '智印大脑',
      '供需协同',
      '集中采购',
      '纸价情报',
      '产教实践',
      '项目介绍',
    ])
  })

  it('does not promote the retired startup-first label', () => {
    const labels = PRIMARY_NAV_ITEMS.map((item) => item.label).join('')
    expect(labels).not.toMatch(/创业孵化/)
  })
})
