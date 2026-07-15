import { describe, expect, it } from 'vitest'
import { canPerformRoleAction } from './roles'

describe('role permissions', () => {
  it('allows a requester with a complete profile to publish a requirement', () => {
    expect(canPerformRoleAction('publish_requirement', {
      roles: ['requester'],
      profileComplete: true,
      companyApproved: false,
      isAdmin: false,
    })).toBe(true)
  })

  it('requires an approved company for printer and material supplier writes', () => {
    expect(canPerformRoleAction('submit_bid', {
      roles: ['printer'],
      profileComplete: true,
      companyApproved: false,
      isAdmin: false,
    })).toBe(false)
    expect(canPerformRoleAction('submit_supply_offer', {
      roles: ['material_supplier'],
      profileComplete: true,
      companyApproved: true,
      isAdmin: false,
    })).toBe(true)
  })

  it('lets administrators review content without assigning a business role', () => {
    expect(canPerformRoleAction('review_content', {
      roles: [],
      profileComplete: false,
      companyApproved: false,
      isAdmin: true,
    })).toBe(true)
  })
})
