import { describe, expect, it } from 'vitest'
import { buildRolePermissionContext } from './role-context'

describe('buildRolePermissionContext', () => {
  it('uses only active role rows and requires nickname, phone and email', () => {
    expect(buildRolePermissionContext({
      profile: { nickname: '张三', phone: '13800000000', email: 'a@example.com' },
      companyStatus: 'approved',
      roleRows: [
        { role: 'requester', status: 'active' },
        { role: 'printer', status: 'suspended' },
      ],
      appRole: null,
    })).toEqual({
      roles: ['requester'],
      profileComplete: true,
      companyApproved: true,
      isAdmin: false,
    })
  })

  it('trusts admin status only from app metadata', () => {
    expect(buildRolePermissionContext({
      profile: null,
      companyStatus: null,
      roleRows: [],
      appRole: 'admin',
    }).isAdmin).toBe(true)
  })
})
