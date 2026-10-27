import type { BusinessRole, RolePermissionContext, RoleStatus } from '@/types/platform'

type RoleRow = { role: BusinessRole; status: RoleStatus }

interface BuildRoleContextInput {
  profile: { nickname: string | null; phone: string | null; email: string | null } | null
  companyStatus: string | null
  roleRows: RoleRow[]
  appRole: unknown
}

export function buildRolePermissionContext(input: BuildRoleContextInput): RolePermissionContext {
  const roles = input.roleRows
    .filter((row) => row.status === 'active')
    .map((row) => row.role)

  return {
    roles: [...new Set(roles)],
    profileComplete: Boolean(
      input.profile?.nickname?.trim()
      && input.profile.phone?.trim()
      && input.profile.email?.trim(),
    ),
    companyApproved: input.companyStatus === 'approved',
    isAdmin: input.appRole === 'admin',
  }
}
