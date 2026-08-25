import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import type { PointerEvent } from 'react'

type BrandProps = {
  className?: string
}

export function Brand({ className = '' }: BrandProps) {
  const pointerX = useMotionValue(112)
  const pointerY = useMotionValue(20)
  const smoothX = useSpring(pointerX, { stiffness: 260, damping: 30, mass: 0.4 })
  const smoothY = useSpring(pointerY, { stiffness: 260, damping: 30, mass: 0.4 })
  const reduceMotion = useReducedMotion()
  const colorField = useMotionTemplate`radial-gradient(circle 64px at ${smoothX}px ${smoothY}px, #f39a69 0%, #e9783d 34%, #6ea083 62%, transparent 100%)`

  const updatePointer = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(event.clientX - bounds.left)
    pointerY.set(event.clientY - bounds.top)
  }

  const resetPointer = (event: PointerEvent<HTMLSpanElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(bounds.width * 0.72)
    pointerY.set(bounds.height * 0.48)
  }

  return (
    <span
      className={`brand ${className}`.trim()}
      onPointerDown={updatePointer}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <img
        className="brand__image"
        src="/assets/imvester-logo.png"
        alt="IMvester"
        width="1920"
        height="381"
      />
      <motion.span
        className="brand__color"
        aria-hidden="true"
        style={reduceMotion ? undefined : { backgroundImage: colorField }}
      />
    </span>
  )
}
