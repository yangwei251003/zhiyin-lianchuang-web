import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { HomeHeroMedia } from './HomeHeroMedia'

describe('HomeHeroMedia', () => {
  it('uses local video and poster assets with an explicit playback control', () => {
    const html = renderToStaticMarkup(<HomeHeroMedia />)

    expect(html).toContain('/videos/heidelberg.mp4')
    expect(html).toContain('/images/external/press-studio.jpg')
    expect(html).toContain('播放背景视频')
    expect(html).not.toContain('autoplay')
    expect(html).not.toMatch(/(?:src|poster)="https?:\/\//)
  })
})
