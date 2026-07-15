import { describe, expect, it } from 'vitest'
import { REVIEW_ROLES, REVIEW_STORY } from './review-content'

describe('review story content', () => {
  it('uses the agreed campus collateral story and labels it as demo content', () => {
    expect(REVIEW_STORY.title).toContain('校园开放日')
    expect(REVIEW_STORY.isDemo).toBe(true)
    expect(REVIEW_STORY.requirement.items).toHaveLength(3)
  })

  it('provides one guided action for each agreed business role', () => {
    expect(REVIEW_ROLES.map((role) => role.id)).toEqual([
      'requester',
      'printer',
      'material_supplier',
    ])
    expect(REVIEW_ROLES.map((role) => role.action)).toEqual([
      'publish_requirement',
      'submit_bid',
      'submit_supply_offer',
    ])
  })
})
