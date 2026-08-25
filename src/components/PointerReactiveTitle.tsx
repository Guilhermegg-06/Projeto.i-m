import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import type { PointerEvent, ReactNode } from 'react'

type PointerReactiveTitleProps = {
  children: ReactNode
}

export function PointerReactiveTitle({ children }: PointerReactiveTitleProps) {
  const pointerX = useMotionValue(420)
  const pointerY = useMotionValue(90)
  const smoothX = useSpring(pointerX, { stiffness: 220, damping: 28, mass: 0.45 })
  const smoothY = useSpring(pointerY, { stiffness: 220, damping: 28, mass: 0.45 })
  const reduceMotion = useReducedMotion()
  const colorField = useMotionTemplate`radial-gradient(circle 190px at ${smoothX}px ${smoothY}px, #f39a69 0%, #e9783d 23%, #91bca1 48%, #f0f2ed 78%)`

  const updatePointer = (event: PointerEvent<HTMLHeadingElement>) => {
    if (reduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(event.clientX - bounds.left)
    pointerY.set(event.clientY - bounds.top)
  }

  const resetPointer = (event: PointerEvent<HTMLHeadingElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(bounds.width * 0.72)
    pointerY.set(bounds.height * 0.42)
  }

  return (
    <motion.h1
      className="pointer-title"
      style={reduceMotion ? undefined : { backgroundImage: colorField }}
      onPointerDown={updatePointer}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      {children}
    </motion.h1>
  )
}
