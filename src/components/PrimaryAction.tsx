import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PointerEvent,
  ReactNode,
} from 'react'

type PrimaryActionContentProps = {
  children: ReactNode
  icon?: ReactNode
}

type PrimaryLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  PrimaryActionContentProps

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  PrimaryActionContentProps

function useMagneticAction() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 280, damping: 24, mass: 0.32 })
  const smoothY = useSpring(y, { stiffness: 280, damping: 24, mass: 0.32 })
  const reduceMotion = useReducedMotion()

  const move = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const localX = event.clientX - bounds.left
    const localY = event.clientY - bounds.top

    event.currentTarget.style.setProperty('--pointer-x', `${localX}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${localY}px`)

    if (reduceMotion) return
    x.set((localX - bounds.width / 2) * 0.08)
    y.set((localY - bounds.height / 2) * 0.12)
  }

  const reset = (element: HTMLElement) => {
    x.set(0)
    y.set(0)
    element.style.setProperty('--pointer-x', '78%')
    element.style.setProperty('--pointer-y', '36%')
  }

  return { move, reset, smoothX, smoothY }
}

function PrimaryActionContent({
  children,
  icon,
  x,
  y,
}: PrimaryActionContentProps & {
  x: ReturnType<typeof useSpring>
  y: ReturnType<typeof useSpring>
}) {
  return (
    <motion.span className="uiverse-button__motion" style={{ x, y }}>
      <span className="uiverse-button__label">{children}</span>
      {icon && <span className="uiverse-button__icon">{icon}</span>}
    </motion.span>
  )
}

export function PrimaryLink({
  children,
  icon,
  className = '',
  onPointerMove,
  onPointerLeave,
  ...props
}: PrimaryLinkProps) {
  const magnetic = useMagneticAction()

  return (
    <a
      {...props}
      className={`uiverse-button ${className}`.trim()}
      onPointerMove={(event) => {
        magnetic.move(event)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        magnetic.reset(event.currentTarget)
        onPointerLeave?.(event)
      }}
    >
      <PrimaryActionContent icon={icon} x={magnetic.smoothX} y={magnetic.smoothY}>
        {children}
      </PrimaryActionContent>
    </a>
  )
}

export function PrimaryButton({
  children,
  icon,
  className = '',
  onPointerMove,
  onPointerLeave,
  ...props
}: PrimaryButtonProps) {
  const magnetic = useMagneticAction()

  return (
    <button
      {...props}
      className={`uiverse-button ${className}`.trim()}
      onPointerMove={(event) => {
        magnetic.move(event)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        magnetic.reset(event.currentTarget)
        onPointerLeave?.(event)
      }}
    >
      <PrimaryActionContent icon={icon} x={magnetic.smoothX} y={magnetic.smoothY}>
        {children}
      </PrimaryActionContent>
    </button>
  )
}
