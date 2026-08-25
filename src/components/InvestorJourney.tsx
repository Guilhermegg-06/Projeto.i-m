import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { investorSteps } from '../content'

export function InvestorJourney() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const objectY = useTransform(scrollYProgress, [0, 1], [-34, 34])
  const objectRotate = useTransform(scrollYProgress, [0, 1], [-18, 34])
  const currentStep = investorSteps[activeStep]

  return (
    <div ref={sectionRef} className="journey-layout">
      <div className="journey-visual" aria-hidden="true">
        <div className="journey-visual__frame">
          <motion.div
            className="journey-object"
            style={reduceMotion ? undefined : { y: objectY, rotate: objectRotate }}
          >
            <span className="journey-object__shell" />
            <span className="journey-object__orbit journey-object__orbit--one" />
            <span className="journey-object__orbit journey-object__orbit--two" />
          </motion.div>

          <div className="journey-visual__copy">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep.number}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.34 }}
              >
                <span>{currentStep.number}</span>
                <strong>{currentStep.title}</strong>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="journey-steps">
        {investorSteps.map((step, index) => (
          <motion.article
            className={index === activeStep ? 'is-active' : ''}
            key={step.number}
            onViewportEnter={() => setActiveStep(index)}
            viewport={{ amount: 0.6, margin: '-18% 0px -18% 0px' }}
          >
            <span>{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
