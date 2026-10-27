export type BusinessRole = 'requester' | 'printer' | 'material_supplier'
export type RoleStatus = 'requested' | 'active' | 'suspended'
export type SupplyOfferStatus =
  | 'pending'
  | 'shortlisted'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'
export type ContentReviewStatus = 'pending' | 'approved' | 'rejected' | 'archived'

export type RolePermissionAction =
  | 'publish_requirement'
  | 'submit_bid'
  | 'publish_capacity'
  | 'submit_supply_offer'
  | 'review_content'
  | 'manage_purchase'

export interface RolePermissionContext {
  roles: BusinessRole[]
  profileComplete: boolean
  companyApproved: boolean
  isAdmin: boolean
}

export type ReviewAction =
  | 'publish_requirement'
  | 'submit_bid'
  | 'submit_supply_offer'
  | 'confirm_collaboration'

export interface ReviewScenarioState {
  activeRole: BusinessRole
  completedActions: ReviewAction[]
}
