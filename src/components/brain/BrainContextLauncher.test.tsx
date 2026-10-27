import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BrainContextLauncher } from './BrainContextLauncher'

describe('BrainContextLauncher', () => {
  it('links a business page to the matching brain workspace context', () => {
    const html = renderToStaticMarkup(
      <BrainContextLauncher context="purchase" label="整理采购核对项" />,
    )

    expect(html).toContain('/brain?context=purchase')
    expect(html).toContain('整理采购核对项')
    expect(html).toContain('智印大脑')
  })
})
