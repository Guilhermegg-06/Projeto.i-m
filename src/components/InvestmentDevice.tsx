import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  useRef,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

type JourneyStep = {
  number: string
  title: string
  description: string
}

type InvestmentDeviceProps = {
  steps: JourneyStep[]
  activeIndex: number
  onChange: (index: number) => void
}

type GestureState = {
  active: boolean
  pointerId: number
  startX: number
  startY: number
  lastX: number
  lastY: number
  startIndex: number
}

export function InvestmentDevice({
  steps,
  activeIndex,
  onChange,
}: InvestmentDeviceProps) {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [12, -12]), {
    stiffness: 260,
    damping: 24,
    mass: 0.72,
  })
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 260,
    damping: 24,
    mass: 0.72,
  })
  const shiftX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-9, 9]), {
    stiffness: 245,
    damping: 25,
  })
  const shiftY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-7, 7]), {
    stiffness: 245,
    damping: 25,
  })
  const glareX = useTransform(pointerX, [-0.5, 0.5], ['18%', '82%'])
  const glareY = useTransform(pointerY, [-0.5, 0.5], ['18%', '76%'])
  const reduceMotion = Boolean(useReducedMotion())
  const step = steps[activeIndex]
  const total = steps.length
  const gestureRef = useRef<GestureState>({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    startIndex: 0,
  })

  const requestIndex = (index: number) => {
    const wrappedIndex = ((index % total) + total) % total
    onChange(wrappedIndex)
  }

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5)
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    updatePointer(event)
    gestureRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      startIndex: activeIndex,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    updatePointer(event)
    if (!gestureRef.current.active || gestureRef.current.pointerId !== event.pointerId) {
      return
    }
    gestureRef.current.lastX = event.clientX
    gestureRef.current.lastY = event.clientY
  }

  const finishGesture = (
    event: PointerEvent<HTMLDivElement>,
    shouldNavigate: boolean,
  ) => {
    const gesture = gestureRef.current
    if (!gesture.active || gesture.pointerId !== event.pointerId) return

    gesture.lastX = event.clientX
    gesture.lastY = event.clientY
    const deltaX = gesture.lastX - gesture.startX
    const deltaY = gesture.lastY - gesture.startY
    const horizontalSwipe =
      Math.abs(deltaX) >= 30 && Math.abs(deltaX) > Math.abs(deltaY) * 1.12
    const shortTap = Math.hypot(deltaX, deltaY) < 10

    if (shouldNavigate && horizontalSwipe) {
      requestIndex(gesture.startIndex + (deltaX < 0 ? 1 : -1))
    } else if (shouldNavigate && shortTap) {
      const bounds = event.currentTarget.getBoundingClientRect()
      const tappedRightSide = event.clientX >= bounds.left + bounds.width / 2
      requestIndex(gesture.startIndex + (tappedRightSide ? 1 : -1))
    }

    gestureRef.current.active = false
    gestureRef.current.pointerId = -1
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    resetPointer()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      requestIndex(activeIndex - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      requestIndex(activeIndex + 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      onChange(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      onChange(total - 1)
    }
  }

  return (
    <div className="investment-device-stage">
      <motion.div
        className="investment-device"
        role="group"
        aria-label="Guia do investidor interativo. Toque nos indicadores, arraste para os lados ou use as setas do teclado."
        tabIndex={0}
        style={reduceMotion ? undefined : { rotateX, rotateY, x: shiftX, y: shiftY }}
        whileHover={reduceMotion ? undefined : { scale: 1.018 }}
        whileTap={reduceMotion ? undefined : { scale: 0.988 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishGesture(event, true)}
        onPointerCancel={(event) => finishGesture(event, false)}
        onPointerLeave={() => {
          if (!gestureRef.current.active) resetPointer()
        }}
      >
        <div className="investment-device__screen">
          {!reduceMotion && (
            <motion.span
              className="investment-device__glare"
              style={{ left: glareX, top: glareY }}
              aria-hidden="true"
            />
          )}

          <div className="investment-device__topline">
            <span>imvester</span>
            <span>
              {String(activeIndex + 1).padStart(2, '0')}/
              {String(total).padStart(2, '0')}
            </span>
          </div>

          <div className="investment-device__progress" aria-label="Etapas do guia">
            {steps.map((journeyStep, index) => (
              <button
                type="button"
                className={index <= activeIndex ? 'is-complete' : ''}
                aria-label={'Ver etapa ' + (index + 1) + ': ' + journeyStep.title}
                aria-pressed={index === activeIndex}
                key={journeyStep.number}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onChange(index)}
              >
                <span />
              </button>
            ))}
          </div>

          <div className="investment-device__content" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step.number}
                initial={reduceMotion ? false : { opacity: 0, x: 18, filter: 'blur(7px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -14, filter: 'blur(5px)' }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                }
              >
                <span className="investment-device__number">{step.number}</span>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="investment-device__footer">
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => requestIndex(activeIndex - 1)}
            >
              Anterior
            </button>
            <span aria-hidden="true">toque ou arraste</span>
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => requestIndex(activeIndex + 1)}
            >
              Próximo
            </button>
          </div>
        </div>
      </motion.div>
      <span className="investment-device-stage__shadow" aria-hidden="true" />
    </div>
  )
}
