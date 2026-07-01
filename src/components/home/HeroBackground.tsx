'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// 三色光晕：对应经济(蓝)/环境(绿)/社会(橙) 三大价值色
// 通过 scale + opacity 缓慢呼吸，营造大屏沉浸氛围
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
    color: 'rgba(42, 108, 219, 0.55)',
    size: 640,
    top: '-12%',
    left: '-10%',
    delay: 0,
    duration: 11,
  },
  {
    color: 'rgba(43, 174, 110, 0.40)',
    size: 540,
    top: '6%',
    left: '58%',
    delay: 1.8,
    duration: 9.5,
  },
  {
    color: 'rgba(240, 128, 53, 0.36)',
    size: 580,
    top: '48%',
    left: '14%',
    delay: 3.2,
    duration: 12,
  },
]

// 底部价格曲线流：3 条抽象走势线，stroke-dashoffset 流动
// 模拟纸价预测曲线，呼应"AI 纸价预测"主题
interface Curve {
  d: string
  stroke: string
  width: number
  duration: number
}

const CURVES: Curve[] = [
  {
    d: 'M0,150 C200,90 360,170 540,110 C720,50 900,130 1080,80 C1260,30 1440,100 1600,60',
    stroke: 'rgba(122, 166, 240, 0.55)',
    width: 2,
    duration: 16,
  },
  {
    d: 'M0,180 C220,140 380,190 560,150 C740,110 920,170 1100,140 C1280,110 1460,160 1600,130',
    stroke: 'rgba(78, 203, 158, 0.45)',
    width: 1.5,
    duration: 20,
  },
  {
    d: 'M0,205 C240,175 400,215 580,185 C760,155 940,205 1120,175 C1300,145 1480,195 1600,175',
    stroke: 'rgba(245, 166, 107, 0.40)',
    width: 1.5,
    duration: 24,
  },
]

// 媒体查询钩子：移动端关闭动画以省电
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
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 移动端或用户偏好减少动效时，以及挂载前，关闭动画
  const animate = mounted && !prefersReduced && !isMobile

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* 基础深色径向渐变：深蓝 → 品牌蓝 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, #1A4A9C 0%, #0F172A 60%, #0B1120 100%)',
        }}
      />

      {/* 三色光晕呼吸 */}
      {HALOS.map((halo, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full"
          style={{
            width: `${halo.size}px`,
            height: `${halo.size}px`,
            top: halo.top,
            left: halo.left,
            background: `radial-gradient(circle, ${halo.color} 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          initial={animate ? { scale: 0.9, opacity: 0.55 } : { scale: 1, opacity: 0.7 }}
          animate={
            animate
              ? {
                  scale: [0.9, 1.12, 0.9],
                  opacity: [0.45, 0.75, 0.45],
                }
              : { scale: 1, opacity: 0.7 }
          }
          transition={{
            duration: halo.duration,
            delay: halo.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 底部价格曲线流 */}
      <svg
        className="absolute bottom-0 left-0 h-2/3 w-full"
        viewBox="0 0 1600 260"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="hero-curve-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="20%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <mask id="hero-curve-mask">
            <rect
              x="0"
              y="0"
              width="1600"
              height="260"
              fill="url(#hero-curve-fade)"
            />
          </mask>
        </defs>
        <g mask="url(#hero-curve-mask)">
          {CURVES.map((curve, idx) => (
            <motion.path
              key={idx}
              d={curve.d}
              stroke={curve.stroke}
              strokeWidth={curve.width}
              strokeLinecap="round"
              fill="none"
              initial={animate ? { strokeDashoffset: 0 } : false}
              animate={
                animate
                  ? { strokeDashoffset: [0, -400] }
                  : { strokeDashoffset: 0 }
              }
              transition={{
                duration: curve.duration,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                strokeDasharray: '8 12',
              }}
            />
          ))}
        </g>
      </svg>

      {/* 顶部 → 底部渐变蒙层：保证 Hero 文字可读性 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(15,23,42,0.10) 0%, rgba(15,23,42,0.05) 35%, rgba(15,23,42,0.35) 80%, rgba(15,23,42,0.65) 100%)',
        }}
      />
    </div>
  )
}
