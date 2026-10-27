'use client'

import type { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'

export function MotionProvider({ children }: { children: ReactNode }) {
  // Individual motion components apply a hydration-safe reduced-motion hook.
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>
}
