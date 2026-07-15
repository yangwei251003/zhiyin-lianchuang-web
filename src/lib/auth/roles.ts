import type {
  RolePermissionAction,
  RolePermissionContext,
} from '@/types/platform'

export function canPerformRoleAction(
  action: RolePermissionAction,
  context: RolePermissionContext
): boolean {
  if (context.isAdmin) return true

  switch (action) {
    case 'publish_requirement':
      return context.profileComplete && context.roles.includes('requester')
    case 'submit_bid':
    case 'publish_capacity':
      return context.companyApproved && context.roles.includes('printer')
    case 'submit_supply_offer':
      return context.companyApproved && context.roles.includes('material_supplier')
    case 'review_content':
    case 'manage_purchase':
      return false
  }
}
