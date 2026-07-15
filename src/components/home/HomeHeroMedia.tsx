'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'

export function HomeHeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  // Keep server and first client render identical. Playback is decided after
  // hydration so system reduced-motion never causes a markup mismatch.
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reduceMotion) {
      video.pause()
      return
    }
    void video.play().catch(() => undefined)
  }, [reduceMotion])

  async function togglePlayback() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      await video.play().catch(() => undefined)
      setPlaying(!video.paused)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="relative min-h-[360px] overflow-hidden bg-[#DDE3E9] sm:min-h-[480px] lg:min-h-[560px]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        poster="/images/external/press-studio.jpg"
        aria-label="印刷设备生产现场"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/videos/heidelberg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#102A43]/20" aria-hidden />
      <div className="absolute bottom-0 left-0 max-w-[78%] bg-white p-4 sm:p-5">
        <p className="text-sm font-bold text-[#172033]">从真实生产场景出发</p>
        <p className="mt-1 text-xs leading-5 text-[#526174]">设备、工艺、原料和交期共同决定一笔印刷业务。</p>
      </div>
      <button
        type="button"
        onClick={togglePlayback}
        className="absolute bottom-4 right-4 inline-flex size-11 items-center justify-center bg-white text-[#173B63] transition duration-150 ease-out hover:bg-[#F6F7F8] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
        aria-label={playing ? '暂停背景视频' : '播放背景视频'}
      >
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
      </button>
    </div>
  )
}
