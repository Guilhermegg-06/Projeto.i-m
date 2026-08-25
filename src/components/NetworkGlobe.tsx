import type { COBEOptions, Globe } from 'cobe'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, type PointerEvent } from 'react'

type RenderState = Partial<COBEOptions>

type GlobeOptionsWithRender = COBEOptions & {
  onRender: (state: RenderState) => void
}

const markers: NonNullable<COBEOptions['markers']> = [
  { location: [-23.5505, -46.6333], size: 0.08, id: 'sao-paulo' },
  { location: [-22.9068, -43.1729], size: 0.055 },
  { location: [-19.9167, -43.9345], size: 0.045 },
  { location: [-25.4284, -49.2733], size: 0.045 },
  { location: [-27.5954, -48.548], size: 0.04 },
  { location: [-15.7939, -47.8828], size: 0.04 },
  { location: [-12.9777, -38.5016], size: 0.04 },
]

const arcs: NonNullable<COBEOptions['arcs']> = markers.slice(1).map((marker) => ({
  from: markers[0].location,
  to: marker.location,
}))

export function NetworkGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(-0.55)
  const targetPhiRef = useRef(-0.55)
  const dragRef = useRef({ active: false, startX: 0, startPhi: -0.55 })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    let globe: Globe | undefined
    let size = canvas.clientWidth
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resizeObserver = new ResizeObserver(([entry]) => {
      size = entry.contentRect.width
    })

    resizeObserver.observe(canvas)

    const startGlobe = async () => {
      const { default: createGlobe } = await import('cobe')
      if (disposed) return

      const options: GlobeOptionsWithRender = {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi: phiRef.current,
        theta: 0.08,
        dark: 1,
        diffuse: 1.35,
        scale: 0.93,
        mapSamples: 15000,
        mapBrightness: 5.2,
        mapBaseBrightness: 0.02,
        baseColor: [0.055, 0.16, 0.105],
        markerColor: [0.94, 0.44, 0.2],
        glowColor: [0.12, 0.3, 0.2],
        opacity: 0.97,
        markers,
        arcs,
        arcColor: [0.94, 0.44, 0.2],
        arcWidth: 0.72,
        arcHeight: 0.23,
        markerElevation: 0.025,
        onRender: (state) => {
          if (!reduceMotion && !dragRef.current.active) {
            targetPhiRef.current += 0.0014
          }

          phiRef.current += (targetPhiRef.current - phiRef.current) * 0.075
          state.phi = phiRef.current
          state.width = size * dpr
          state.height = size * dpr
        },
      }

      globe = createGlobe(canvas, options)
      canvas.dataset.ready = 'true'
    }

    void startGlobe()

    return () => {
      disposed = true
      resizeObserver.disconnect()
      globe?.destroy()
    }
  }, [reduceMotion])

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startPhi: targetPhiRef.current,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return
    targetPhiRef.current =
      dragRef.current.startPhi + (event.clientX - dragRef.current.startX) / 150
  }

  const handlePointerEnd = (event: PointerEvent<HTMLCanvasElement>) => {
    dragRef.current.active = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <figure className="network-globe">
      <div className="network-globe__stage">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        />
        <span className="network-globe__origin" aria-hidden="true">
          São Paulo
        </span>
      </div>
      <figcaption>
        <span>Presença nacional</span>
        <strong>Conexões que aproximam patrimônio e oportunidade.</strong>
      </figcaption>
    </figure>
  )
}
