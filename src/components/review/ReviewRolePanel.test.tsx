import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ReviewRolePanel } from './ReviewRolePanel'

describe('ReviewRolePanel', () => {
  it('makes demo status and the active role action explicit', () => {
    const html = renderToStaticMarkup(
      <ReviewRolePanel
        role="requester"
        completedActions={[]}
        onComplete={() => undefined}
      />
    )

    expect(html).toContain('演示场景')
    expect(html).toContain('招生画册 2,000 册')
    expect(html).toContain('发布演示需求')
  })

  it('shows a completed state instead of another submission action', () => {
    const html = renderToStaticMarkup(
      <ReviewRolePanel
        role="printer"
        completedActions={['submit_bid']}
        onComplete={() => undefined}
      />
    )

    expect(html).toContain('本角色任务已完成')
    expect(html).not.toContain('提交演示报价</button>')
  })
})
