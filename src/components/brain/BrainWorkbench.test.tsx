import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

import { BrainWorkbench } from './BrainWorkbench'

describe('BrainWorkbench', () => {
  it('renders the selected industrial decision workspace rather than a generic chat shell', () => {
    const html = renderToStaticMarkup(<BrainWorkbench initialContext="order" />)

    expect(html).toContain('智印大脑')
    expect(html).toContain('需求方')
    expect(html).toContain('印刷厂')
    expect(html).toContain('原料供应商')
    expect(html).toContain('证据与边界')
    expect(html).toContain('待确认草稿')
    expect(html).not.toContain('预测价格')
  })
})
