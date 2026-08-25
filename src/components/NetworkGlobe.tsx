import type { Arc, COBEOptions, Globe, Marker } from 'cobe'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent } from 'react'

type RenderState = Partial<COBEOptions>

type GlobeOptionsWithRender = COBEOptions & {
  onRender: (state: RenderState) => void
}

type GlobeStatus = 'loading' | 'ready' | 'fallback'

const saoPaulo: [number, number] = [-23.5505, -46.6333]

const destinations: Array<{ location: [number, number]; size: number }> = [
  { location: [-22.9068, -43.1729], size: 0.055 },
  { location: [-19.9167, -43.9345], size: 0.05 },
  { location: [-15.7939, -47.8828], size: 0.048 },
  { location: [-25.4284, -49.2733], size: 0.046 },
  { location: [-27.5954, -48.548], size: 0.044 },
  { location: [-30.0346, -51.2177], size: 0.045 },
  { location: [-12.9777, -38.5016], size: 0.043 },
  { location: [-8.0476, -34.877], size: 0.042 },
  { location: [-3.119, -60.0217], size: 0.04 },
  { location: [-3.7319, -38.5267], size: 0.04 },
]

const markers: Marker[] = [
  { location: saoPaulo, size: 0.095, color: [1, 0.42, 0.16], id: 'sao-paulo' },
  ...destinations.map((destination) => ({
    ...destination,
    color: [0.92, 0.96, 0.93] as [number, number, number],
  })),
]

const connections: Arc[] = destinations.map((destination, index) => ({
  from: saoPaulo,
  to: destination.location,
  color:
    index % 3 === 0
      ? [1, 0.42, 0.16]
      : [0.28, 0.78, 0.5],
}))

const connectionCycles = [
  connections.slice(0, 4),
  connections.slice(3, 8),
  [...connections.slice(7), ...connections.slice(0, 2)],
]

export function NetworkGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(-0.56)
  const targetPhiRef = useRef(-0.56)
  const dragRef = useRef({ active: false, startX: 0, startPhi: -0.56 })
  const [status, setStatus] = useState<GlobeStatus>('loading')
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    let globe: Globe | undefined
    let activeCycle = 0
    let lastCycleAt = performance.now()
    let size = Math.max(canvas.clientWidth, 280)
    const isCompact = window.matchMedia('(max-width: 760px)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, isCompact ? 1.75 : 2)
    const resizeObserver = new ResizeObserver(([entry]) => {
      size = Math.max(entry.contentRect.width, 280)
    })

    setStatus('loading')
    resizeObserver.observe(canvas)

    const startGlobe = async () => {
      try {
        const probe = document.createElement('canvas')
        const supportsWebGl = probe.getContext('webgl2') || probe.getContext('webgl')
        if (!supportsWebGl) throw new Error('WebGL unavailable')

        const { default: createGlobe } = await import('cobe')
        if (disposed) return

        const options: GlobeOptionsWithRender = {
          devicePixelRatio: dpr,
          width: size * dpr,
          height: size * dpr,
          phi: phiRef.current,
          theta: 0.12,
          dark: 1,
          diffuse: 1.85,
          scale: 0.98,
          mapSamples: isCompact ? 17000 : 26000,
          mapBrightness: 8.4,
          mapBaseBrightness: 0.055,
          baseColor: [0.3, 0.36, 0.33],
          markerColor: [1, 0.42, 0.16],
          glowColor: [0.08, 0.28, 0.17],
          opacity: 1,
          markers,
          arcs: reduceMotion ? connections : connectionCycles[0],
          arcColor: [1, 0.42, 0.16],
          arcWidth: 0.86,
          arcHeight: 0.2,
          markerElevation: 0.035,
          onRender: (state) => {
            const now = performance.now()

            if (!reduceMotion && !dragRef.current.active) {
              targetPhiRef.current += 0.00175
            }

            if (!reduceMotion && now - lastCycleAt > 2400) {
              activeCycle = (activeCycle + 1) % connectionCycles.length
              lastCycleAt = now
            }

            phiRef.current += (targetPhiRef.current - phiRef.current) * 0.075
            state.phi = phiRef.current
            state.width = size * dpr
            state.height = size * dpr
            state.arcs = reduceMotion ? connections : connectionCycles[activeCycle]
            state.arcHeight = reduceMotion ? 0.2 : 0.2 + Math.sin(now / 820) * 0.025
          },
        }

        globe = createGlobe(canvas, options)
        canvas.dataset.ready = 'true'
        setStatus('ready')
      } catch {
        if (!disposed) setStatus('fallback')
      }
    }

    void startGlobe()

    return () => {
      disposed = true
      resizeObserver.disconnect()
      globe?.destroy()
      delete canvas.dataset.ready
    }
  }, [reduceMotion])

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0 || status !== 'ready') return
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
      dragRef.current.startPhi + (event.clientX - dragRef.current.startX) / 145
  }

  const handlePointerEnd = (event: PointerEvent<HTMLCanvasElement>) => {
    dragRef.current.active = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <figure className="network-globe" data-status={status}>
      <div className="network-globe__stage">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        />
        {status === 'fallback' && (
          <div className="network-globe__fallback" aria-hidden="true">
            <span />
          </div>
        )}
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
