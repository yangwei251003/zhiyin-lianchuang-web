import { describe, expect, it } from 'vitest'
import {
  createInitialReviewScenario,
  reviewScenarioReducer,
  type ReviewScenarioState,
} from './scenario'

describe('review scenario', () => {
  it('starts with the requester and no completed actions', () => {
    expect(createInitialReviewScenario()).toEqual({
      activeRole: 'requester',
      completedActions: [],
    })
  })

  it('switches roles without losing completed actions', () => {
    const started: ReviewScenarioState = {
      activeRole: 'requester',
      completedActions: ['publish_requirement'],
    }

    expect(
      reviewScenarioReducer(started, { type: 'switch_role', role: 'printer' })
    ).toEqual({
      activeRole: 'printer',
      completedActions: ['publish_requirement'],
    })
  })

  it('records each action only once and unlocks the next role', () => {
    let state = createInitialReviewScenario()
    state = reviewScenarioReducer(state, {
      type: 'complete_action',
      action: 'publish_requirement',
    })
    state = reviewScenarioReducer(state, {
      type: 'complete_action',
      action: 'publish_requirement',
    })

    expect(state).toEqual({
      activeRole: 'printer',
      completedActions: ['publish_requirement'],
    })
  })

  it('resets to the initial deterministic scenario', () => {
    const state: ReviewScenarioState = {
      activeRole: 'material_supplier',
      completedActions: ['publish_requirement', 'submit_bid', 'submit_supply_offer'],
    }

    expect(reviewScenarioReducer(state, { type: 'reset' })).toEqual(
      createInitialReviewScenario()
    )
  })
})
