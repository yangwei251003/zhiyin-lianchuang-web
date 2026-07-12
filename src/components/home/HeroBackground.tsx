'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// 三色光晕：对应工业深蓝/CMYK青/CMYK品红
interface Halo {
  color: string
  size: number
  top: string
  left: string
  delay: number
  duration: number
}

const HALOS: Halo[] = [
  {
    color: 'rgba(42, 108, 219, 0.45)',
    size: 800,
    top: '-20%',
    left: '-15%',
    delay: 0,
    duration: 13,
  },
  {
    color: 'rgba(0, 180, 216, 0.22)',   // CMYK Cyan
    size: 600,
    top: '5%',
    left: '55%',
    delay: 2,
    duration: 11,
  },
  {
    color: 'rgba(214, 34, 70, 0.15)',   // CMYK Magenta
    size: 500,
    top: '50%',
    left: '75%',
    delay: 4,
    duration: 15,
  },
  {
    color: 'rgba(26, 92, 200, 0.35)',
    size: 700,
    top: '40%',
    left: '-5%',
    delay: 1.5,
    duration: 10,
  },
]

// 粒子配置
interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  angle: number
}

// 视频源列表（轮播）
const VIDEO_SOURCES = [
  '/videos/heidelberg.mp4',
  '/videos/manroland.mp4',
]

// 媒体查询钩子
function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [breakpoint])
  return isMobile
}

export function HeroBackground() {
  const prefersReduced = useReducedMotion()
  const isMobile       = useIsMobile()
  const [mounted, setMounted]       = useState(false)
  const [videoIdx, setVideoIdx]     = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)

  useEffect(() => { setMounted(true) }, [])

  const animate = mounted && !prefersReduced

  // 视频轮播：播放结束后切换到下一个
  const handleVideoEnd = () => {
    setVideoIdx((i) => (i + 1) % VIDEO_SOURCES.length)
    setVideoLoaded(false)
  }

  // 粒子Canvas动画（仅桌面端）
  useEffect(() => {
    if (!animate || isMobile || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // 生成粒子
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      size:    Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      speed:   Math.random() * 0.3 + 0.1,
      angle:   Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        // 缓慢漂移
        p.x += Math.cos(p.angle) * p.speed
        p.y += Math.sin(p.angle) * p.speed
        p.angle += 0.003

        // 边界回绕
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(122, 166, 240, ${p.opacity})`
        ctx.fill()
      })

      // 连线（距离 < 100px）
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(42, 108, 219, ${0.08 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [animate, isMobile])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* ===== 1. 深色工业底色 ===== */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #152240 0%, #0D1A30 40%, #061020 100%)',
        }}
      />

      {/* ===== 2. 背景视频（印刷机） ===== */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          key={VIDEO_SOURCES[videoIdx]}
          autoPlay
          muted
          playsInline
          loop={VIDEO_SOURCES.length === 1}
          onEnded={handleVideoEnd}
          onCanPlay={() => setVideoLoaded(true)}
          preload="auto"
          className="h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: videoLoaded ? 0.22 : 0 }}
        >
          <source src={VIDEO_SOURCES[videoIdx]} type="video/mp4" />
        </video>
      </div>

      {/* ===== 3. 视频遮罩（分层） ===== */}
      {/* 顶部渐变：确保标题可读 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(6,16,32,0.30) 0%, rgba(6,16,32,0.10) 30%, rgba(6,16,32,0.20) 70%, rgba(6,16,32,0.70) 100%)',
        }}
      />
      {/* 四周暗化 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(6,16,32,0.50) 100%)',
        }}
      />

      {/* ===== 4. 光晕呼吸动画 ===== */}
      {HALOS.map((halo, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full"
          style={{
            width:  `${halo.size}px`,
            height: `${halo.size}px`,
            top:    halo.top,
            left:   halo.left,
            background: `radial-gradient(circle, ${halo.color} 0%, transparent 70%)`,
            filter: 'blur(2px)',
          }}
          initial={animate ? { scale: 0.85, opacity: 0.4 } : { scale: 1, opacity: 0.6 }}
          animate={
            animate
              ? { scale: [0.85, 1.15, 0.85], opacity: [0.35, 0.65, 0.35] }
              : { scale: 1, opacity: 0.6 }
          }
          transition={{
            duration: halo.duration,
            delay:    halo.delay,
            repeat:   Infinity,
            ease:     'easeInOut',
          }}
        />
      ))}

      {/* ===== 5. 工业网格纹理 ===== */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ===== 6. 粒子Canvas（仅桌面端） ===== */}
      {!isMobile && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* ===== 7. CMYK 装饰光点 ===== */}
      {animate && (
        <>
          {/* 左侧 Cyan 光点 */}
          <motion.div
            className="absolute left-[8%] top-[25%] h-3 w-3 rounded-full"
            style={{ background: 'rgba(0,180,216,0.7)', boxShadow: '0 0 20px 6px rgba(0,180,216,0.3)' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* 右侧 Magenta 光点 */}
          <motion.div
            className="absolute right-[12%] top-[35%] h-2 w-2 rounded-full"
            style={{ background: 'rgba(214,34,70,0.8)', boxShadow: '0 0 16px 4px rgba(214,34,70,0.3)' }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 7, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* 底部 Yellow 光点 */}
          <motion.div
            className="absolute bottom-[20%] left-[20%] h-2 w-2 rounded-full"
            style={{ background: 'rgba(245,197,24,0.7)', boxShadow: '0 0 14px 3px rgba(245,197,24,0.25)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 9, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* ===== 8. 底部走势曲线流 ===== */}
      <svg
        className="absolute bottom-0 left-0 h-1/2 w-full"
        viewBox="0 0 1600 260"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="curve-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0" />
            <stop offset="15%"  stopColor="#ffffff" stopOpacity="1" />
            <stop offset="85%"  stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <mask id="curve-mask">
            <rect x="0" y="0" width="1600" height="260" fill="url(#curve-fade)" />
          </mask>
        </defs>
        <g mask="url(#curve-mask)">
          {/* 品牌蓝主曲线 */}
          <motion.path
            d="M0,150 C200,90 360,170 540,110 C720,50 900,130 1080,80 C1260,30 1440,100 1600,60"
            stroke="rgba(74,133,230,0.50)"
            strokeWidth={1.5}
            strokeLinecap="round"
            fill="none"
            initial={animate ? { strokeDashoffset: 0 } : false}
            animate={animate ? { strokeDashoffset: [0, -400] } : { strokeDashoffset: 0 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            style={{ strokeDasharray: '6 14' }}
          />
          {/* 品牌绿走势线 */}
          <motion.path
            d="M0,180 C220,140 380,190 560,150 C740,110 920,170 1100,140 C1280,110 1460,160 1600,130"
            stroke="rgba(43,174,110,0.40)"
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
            initial={animate ? { strokeDashoffset: 0 } : false}
            animate={animate ? { strokeDashoffset: [0, -350] } : { strokeDashoffset: 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ strokeDasharray: '4 16' }}
          />
          {/* CMYK Cyan 点线 */}
          <motion.path
            d="M0,210 C240,185 400,220 580,195 C760,170 940,215 1120,190 C1300,165 1480,205 1600,188"
            stroke="rgba(0,180,216,0.30)"
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
            initial={animate ? { strokeDashoffset: 0 } : false}
            animate={animate ? { strokeDashoffset: [0, -300] } : { strokeDashoffset: 0 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            style={{ strokeDasharray: '3 18' }}
          />
        </g>
      </svg>
    </div>
  )
}
