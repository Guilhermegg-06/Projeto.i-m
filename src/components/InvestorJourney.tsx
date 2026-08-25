import { motion } from 'framer-motion'
import { useState } from 'react'
import { investorSteps } from '../content'
import { InvestmentDevice } from './InvestmentDevice'

export function InvestorJourney() {
  const [activeStep, setActiveStep] = useState(0)
  const currentStep = investorSteps[activeStep]

  return (
    <div className="journey-layout">
      <div className="journey-visual" aria-hidden="true">
        <div className="journey-visual__frame">
          <InvestmentDevice
            step={currentStep}
            activeIndex={activeStep}
            total={investorSteps.length}
          />
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
