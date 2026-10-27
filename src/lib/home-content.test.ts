import { describe, expect, it } from 'vitest'
import { HOME_BRAIN, HOME_CAPABILITIES, HOME_FAQ, HOME_ROLES } from './home-content'

describe('home content', () => {
  it('routes the agreed three business roles', () => {
    expect(HOME_ROLES.map((role) => role.id)).toEqual([
      'requester',
      'printer',
      'material_supplier',
    ])
  })

  it('focuses the public product on demand, procurement and price intelligence', () => {
    expect(HOME_CAPABILITIES.map((item) => item.title)).toEqual([
      '供需协同',
      '集中采购',
      '纸价情报',
    ])
  })

  it('does not promise unsupported predictions or business outcomes', () => {
    const text = JSON.stringify({ HOME_BRAIN, HOME_ROLES, HOME_CAPABILITIES, HOME_FAQ })
    expect(text).not.toMatch(/精准预测|预计帮助|保证成交|降低\d+%/)
  })

  it('positions 智印大脑 as the confirmation layer rather than a fourth business role', () => {
    expect(HOME_BRAIN.href).toBe('/brain')
    expect(HOME_BRAIN.steps).toEqual(['证据边界', '协同判断', '待确认草稿'])
  })
})
