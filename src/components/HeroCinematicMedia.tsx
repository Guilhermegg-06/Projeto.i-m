import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function HeroCinematicMedia() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ['start start', 'end start'],
  })

  const cameraY = useTransform(scrollYProgress, [0, 1], ['0%', '13%'])
  const cameraScale = useTransform(scrollYProgress, [0, 1], [1.01, 1.085])

  return (
    <div ref={mediaRef} className="hero__media" aria-hidden="true">
      <motion.div
        className="hero__camera"
        style={reduceMotion ? undefined : { y: cameraY, scale: cameraScale }}
      >
        <motion.img
          className="hero__drone-image"
          src="/assets/imvester-hero-architecture.webp"
          alt=""
          width="1536"
          height="1024"
          fetchPriority="high"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: ['-2.6%', '1.1%', '3.2%', '-0.4%', '-2.6%'],
                  y: ['-1.2%', '-2.7%', '0.4%', '1.8%', '-1.2%'],
                  scale: [1.12, 1.18, 1.215, 1.17, 1.12],
                  rotate: [-0.32, 0.12, 0.42, -0.08, -0.32],
                  rotateY: [0.9, -0.35, -1.15, 0.25, 0.9],
                }
          }
          transition={{
            duration: 22,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            times: [0, 0.24, 0.52, 0.78, 1],
          }}
        />
      </motion.div>

      {!reduceMotion && (
        <motion.div
          className="hero__drone-light"
          animate={{ x: ['-42%', '46%', '-42%'], opacity: [0.18, 0.34, 0.18] }}
          transition={{
            duration: 16,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      )}

      <div className="hero__veil" />
    </div>
  )
}
