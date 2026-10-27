import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

import { ReviewAccessForm } from './ReviewAccessForm'

describe('ReviewAccessForm', () => {
  it('keeps the review code input disabled until React hydration completes', () => {
    const html = renderToStaticMarkup(<ReviewAccessForm />)

    expect(html).toMatch(/<input[^>]+id="review-code"[^>]+disabled=""/)
  })
})
