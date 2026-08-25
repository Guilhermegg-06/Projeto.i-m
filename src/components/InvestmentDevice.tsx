import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import type { PointerEvent } from 'react'

type InvestmentDeviceProps = {
  step: {
    number: string
    title: string
    description: string
  }
  activeIndex: number
  total: number
}

export function InvestmentDevice({ step, activeIndex, total }: InvestmentDeviceProps) {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [6, -6]), {
    stiffness: 180,
    damping: 22,
  })
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 180,
    damping: 22,
  })
  const shiftX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 180,
    damping: 22,
  })
  const shiftY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-4, 4]), {
    stiffness: 180,
    damping: 22,
  })
  const reduceMotion = useReducedMotion()

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

  return (
    <div className="investment-device-stage" onPointerMove={updatePointer} onPointerLeave={resetPointer}>
      <motion.div
        className="investment-device"
        style={reduceMotion ? undefined : { rotateX, rotateY, x: shiftX, y: shiftY }}
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      >
        <div className="investment-device__screen">
          <div className="investment-device__topline">
            <span>imvester</span>
            <span>{String(activeIndex + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
          </div>

          <div className="investment-device__progress" aria-hidden="true">
            {Array.from({ length: total }, (_, index) => (
              <span className={index <= activeIndex ? 'is-complete' : ''} key={index} />
            ))}
          </div>

          <div className="investment-device__content">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step.number}
                initial={reduceMotion ? false : { opacity: 0, y: 18, filter: 'blur(7px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12, filter: 'blur(5px)' }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="investment-device__number">{step.number}</span>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="investment-device__footer">
            <span>Estratégia personalizada</span>
            <span aria-hidden="true">↗</span>
          </div>
        </div>
      </motion.div>
      <span className="investment-device-stage__shadow" aria-hidden="true" />
    </div>
  )
}
