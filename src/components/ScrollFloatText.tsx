import { useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef } from 'react'

type ScrollFloatTextProps = {
  children: string
  className?: string
}

export function ScrollFloatText({ children, className = '' }: ScrollFloatTextProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduceMotion = useReducedMotion()
  const characters = useMemo(() => Array.from(children), [children])

  useEffect(() => {
    const heading = headingRef.current
    if (!heading || reduceMotion) return

    let disposed = false
    let context: { revert: () => void } | undefined

    const startAnimation = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (disposed) return

      gsap.registerPlugin(ScrollTrigger)
      context = gsap.context(() => {
        gsap.fromTo(
          heading.querySelectorAll<HTMLElement>('.scroll-float__char'),
          {
            opacity: 0.08,
            yPercent: 108,
            scaleY: 1.7,
            scaleX: 0.82,
            transformOrigin: '50% 0%',
            willChange: 'transform, opacity',
          },
          {
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            stagger: 0.022,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 94%',
              end: 'bottom 62%',
              scrub: 0.7,
            },
          },
        )
      }, heading)
    }

    void startAnimation()

    return () => {
      disposed = true
      context?.revert()
    }
  }, [reduceMotion])

  return (
    <h2 ref={headingRef} className={`scroll-float ${className}`.trim()} aria-label={children}>
      <span className="scroll-float__text" aria-hidden="true">
        {characters.map((character, index) => (
          <span className="scroll-float__char" key={`${character}-${index}`}>
            {character === ' ' ? '\u00a0' : character}
          </span>
        ))}
      </span>
    </h2>
  )
}
