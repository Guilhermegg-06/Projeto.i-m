import { motion, useReducedMotion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

type RevealProps = PropsWithChildren<{
  className?: string
  delay?: number
  distance?: number
}>

export function Reveal({
  children,
  className = '',
  delay = 0,
  distance = 26,
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -8% 0px' }}
      transition={{
        duration: 0.78,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

