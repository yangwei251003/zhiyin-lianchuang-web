import type { BusinessRole, ReviewAction, ReviewScenarioState } from '@/types/platform'

export type { BusinessRole } from '@/types/platform'
export type { ReviewAction, ReviewScenarioState } from '@/types/platform'

export type ReviewScenarioEvent =
  | { type: 'switch_role'; role: BusinessRole }
  | { type: 'complete_action'; action: ReviewAction }
  | { type: 'reset' }

const NEXT_ROLE: Partial<Record<ReviewAction, BusinessRole>> = {
  publish_requirement: 'printer',
  submit_bid: 'material_supplier',
  submit_supply_offer: 'requester',
}

export function createInitialReviewScenario(): ReviewScenarioState {
  return { activeRole: 'requester', completedActions: [] }
}

export function reviewScenarioReducer(
  state: ReviewScenarioState,
  event: ReviewScenarioEvent
): ReviewScenarioState {
  if (event.type === 'reset') return createInitialReviewScenario()
  if (event.type === 'switch_role') return { ...state, activeRole: event.role }

  const completedActions = state.completedActions.includes(event.action)
    ? state.completedActions
    : [...state.completedActions, event.action]

  return {
    activeRole: NEXT_ROLE[event.action] ?? state.activeRole,
    completedActions,
  }
}
