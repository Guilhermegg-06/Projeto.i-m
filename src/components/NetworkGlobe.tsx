import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import type {
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import type ThreeGlobe from 'three-globe'
import type { GeometryCollection, Topology } from 'topojson-specification'

type GlobeStatus = 'loading' | 'ready' | 'fallback'

type Connection = {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  colors: string[]
  order: number
}

type Hub = {
  lat: number
  lng: number
  color: string
  size: number
}

const saoPaulo = { lat: -23.5505, lng: -46.6333 }

const destinations = [
  { lat: -22.9068, lng: -43.1729 },
  { lat: -19.9167, lng: -43.9345 },
  { lat: -15.7939, lng: -47.8828 },
  { lat: -25.4284, lng: -49.2733 },
  { lat: -27.5954, lng: -48.548 },
  { lat: -30.0346, lng: -51.2177 },
  { lat: -12.9777, lng: -38.5016 },
  { lat: -8.0476, lng: -34.877 },
  { lat: -3.119, lng: -60.0217 },
  { lat: -3.7319, lng: -38.5267 },
]

const palette = [
  ['#e9783d', '#ffb07c'],
  ['#4f9a70', '#b8d8c3'],
  ['#dce7df', '#e9783d'],
]

const connections: Connection[] = destinations.map((destination, index) => ({
  startLat: saoPaulo.lat,
  startLng: saoPaulo.lng,
  endLat: destination.lat,
  endLng: destination.lng,
  colors: palette[index % palette.length],
  order: index,
}))

const hubs: Hub[] = [
  { ...saoPaulo, color: '#ff8b4f', size: 0.72 },
  ...destinations.map((destination, index) => ({
    ...destination,
    color: index % 2 === 0 ? '#f2f5ef' : '#70b68b',
    size: 0.34,
  })),
]

export function NetworkGlobe() {
  const rendererMountRef = useRef<HTMLDivElement>(null)
  const targetRotationRef = useRef({ x: 0.08, y: -0.82 })
  const [status, setStatus] = useState<GlobeStatus>('loading')
  const [shouldLoad, setShouldLoad] = useState(false)
  const reduceMotion = Boolean(useReducedMotion())

  useEffect(() => {
    const mount = rendererMountRef.current
    if (!mount) return

    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setShouldLoad(true))
      return () => cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '640px 0px' },
    )

    observer.observe(mount)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mount = rendererMountRef.current
    if (!mount || !shouldLoad) return

    let disposed = false
    let animationFrame = 0
    let renderer: WebGLRenderer | undefined
    let camera: PerspectiveCamera | undefined
    let scene: Scene | undefined
    let globe: ThreeGlobe | undefined
    let resizeObserver: ResizeObserver | undefined
    const currentRotation = { ...targetRotationRef.current }
    const pointer = {
      active: false,
      id: -1,
      startX: 0,
      startY: 0,
      startRotationX: 0,
      startRotationY: 0,
    }

    setStatus('loading')
    mount.replaceChildren()

    const initialise = async () => {
      try {
        const probe = document.createElement('canvas')
        if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) {
          throw new Error('WebGL indisponível')
        }

        const [
          THREE,
          { default: ThreeGlobeConstructor },
          { feature },
          { default: atlas },
        ] = await Promise.all([
          import('three'),
          import('three-globe'),
          import('topojson-client'),
          import('world-atlas/countries-110m.json'),
        ])

        if (disposed) return

        const countries = feature(
          atlas as unknown as Topology,
          atlas.objects.countries as unknown as GeometryCollection<{ name?: string }>,
        )
        const countryFeatures = countries.features.filter(
          (country) => country.properties?.name !== 'Antarctica',
        )
        const isCompact = window.matchMedia('(max-width: 760px)').matches

        globe = new ThreeGlobeConstructor({
          waitForGlobeReady: false,
          animateIn: false,
        })
          .showGlobe(true)
          .showAtmosphere(true)
          .atmosphereColor('#3f8b63')
          .atmosphereAltitude(0.16)
          .hexPolygonsData(countryFeatures)
          .hexPolygonResolution(isCompact ? 3 : 3)
          .hexPolygonMargin(0.68)
          .hexPolygonUseDots(true)
          .hexPolygonDotResolution(isCompact ? 6 : 8)
          .hexPolygonAltitude(0.0045)
          .hexPolygonColor((country) => {
            const name = (country as { properties?: { name?: string } }).properties?.name
            return name === 'Brazil' ? 'rgba(224, 151, 108, 0.92)' : 'rgba(175, 196, 183, 0.72)'
          })
          .hexPolygonsTransitionDuration(reduceMotion ? 0 : 900)
          .arcsData(connections)
          .arcStartLat('startLat')
          .arcStartLng('startLng')
          .arcEndLat('endLat')
          .arcEndLng('endLng')
          .arcColor('colors')
          .arcAltitudeAutoScale(0.42)
          .arcStroke(isCompact ? 0.46 : 0.38)
          .arcDashLength(reduceMotion ? 1 : 0.38)
          .arcDashGap(reduceMotion ? 0 : 0.22)
          .arcDashInitialGap((arc) =>
            reduceMotion ? 0 : (arc as Connection).order * 0.07,
          )
          .arcDashAnimateTime(reduceMotion ? 0 : 2400)
          .arcsTransitionDuration(reduceMotion ? 0 : 900)
          .pointsData(hubs)
          .pointLat('lat')
          .pointLng('lng')
          .pointColor('color')
          .pointRadius((point) => (point as Hub).size)
          .pointAltitude(0.018)
          .pointResolution(isCompact ? 8 : 12)
          .pointsMerge(true)
          .ringsData(reduceMotion ? [] : hubs)
          .ringLat('lat')
          .ringLng('lng')
          .ringColor((ring: object) => {
            const color = (ring as Hub).color
            return [color, 'rgba(233, 120, 61, 0)']
          })
          .ringMaxRadius((ring) => ((ring as Hub).size > 0.5 ? 3.2 : 1.8))
          .ringPropagationSpeed(reduceMotion ? 0 : 1.8)
          .ringRepeatPeriod(reduceMotion ? 0 : 1550)

        const globeMaterial = globe.globeMaterial() as MeshPhongMaterial
        globeMaterial.color.set('#07120d')
        globeMaterial.emissive.set('#0a2417')
        globeMaterial.emissiveIntensity = 0.62
        globeMaterial.shininess = 0.8
        globeMaterial.transparent = true
        globeMaterial.opacity = 0.96

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !isCompact,
          powerPreference: 'high-performance',
        })
        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio || 1, isCompact ? 1.6 : 2),
        )
        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.18
        renderer.domElement.className = 'network-globe__canvas'
        renderer.domElement.setAttribute('aria-hidden', 'true')
        mount.appendChild(renderer.domElement)

        scene = new THREE.Scene()
        scene.add(globe)
        scene.add(new THREE.AmbientLight(0xb9d2c2, Math.PI * 0.78))

        const keyLight = new THREE.DirectionalLight(0xffeadf, Math.PI * 1.08)
        keyLight.position.set(-1.8, 1.4, 2.4)
        scene.add(keyLight)

        const rimLight = new THREE.DirectionalLight(0x3f9d6a, Math.PI * 0.72)
        rimLight.position.set(2.6, -0.8, -1.4)
        scene.add(rimLight)

        camera = new THREE.PerspectiveCamera(isCompact ? 43 : 40, 1, 0.1, 1000)
        camera.position.set(0, 0, isCompact ? 294 : 282)

        const resize = () => {
          if (!renderer || !camera) return
          const width = Math.max(mount.clientWidth, 280)
          const height = Math.max(mount.clientHeight, 280)
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
        }

        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(mount)
        resize()

        const handlePointerDown = (event: PointerEvent) => {
          if (event.button !== 0) return
          pointer.active = true
          pointer.id = event.pointerId
          pointer.startX = event.clientX
          pointer.startY = event.clientY
          pointer.startRotationX = targetRotationRef.current.x
          pointer.startRotationY = targetRotationRef.current.y
          mount.dataset.dragging = 'true'
          mount.setPointerCapture?.(event.pointerId)
        }

        const handlePointerMove = (event: PointerEvent) => {
          if (!pointer.active || event.pointerId !== pointer.id) return
          const deltaX = event.clientX - pointer.startX
          const deltaY = event.clientY - pointer.startY
          targetRotationRef.current.y = pointer.startRotationY + deltaX * 0.0065
          targetRotationRef.current.x = THREE.MathUtils.clamp(
            pointer.startRotationX + deltaY * 0.0035,
            -0.28,
            0.34,
          )
        }

        const handlePointerEnd = (event: PointerEvent) => {
          if (event.pointerId !== pointer.id) return
          pointer.active = false
          pointer.id = -1
          delete mount.dataset.dragging
          if (mount.hasPointerCapture?.(event.pointerId)) {
            mount.releasePointerCapture(event.pointerId)
          }
        }

        mount.addEventListener('pointerdown', handlePointerDown)
        mount.addEventListener('pointermove', handlePointerMove)
        mount.addEventListener('pointerup', handlePointerEnd)
        mount.addEventListener('pointercancel', handlePointerEnd)

        const animate = () => {
          if (!renderer || !camera || !scene || !globe || disposed) return

          if (!reduceMotion && !pointer.active) {
            targetRotationRef.current.y += 0.00072
          }

          currentRotation.x += (targetRotationRef.current.x - currentRotation.x) * 0.075
          currentRotation.y += (targetRotationRef.current.y - currentRotation.y) * 0.075
          globe.rotation.x = currentRotation.x
          globe.rotation.y = currentRotation.y
          renderer.render(scene, camera)

          if (mount.dataset.ready !== 'true') {
            mount.dataset.ready = 'true'
            setStatus('ready')
          }
          animationFrame = window.requestAnimationFrame(animate)
        }

        animate()

        return () => {
          mount.removeEventListener('pointerdown', handlePointerDown)
          mount.removeEventListener('pointermove', handlePointerMove)
          mount.removeEventListener('pointerup', handlePointerEnd)
          mount.removeEventListener('pointercancel', handlePointerEnd)
        }
      } catch {
        if (!disposed) setStatus('fallback')
        return undefined
      }
    }

    let removePointerListeners: (() => void) | undefined
    void initialise().then((cleanup) => {
      removePointerListeners = cleanup
      if (disposed) cleanup?.()
    })

    return () => {
      disposed = true
      removePointerListeners?.()
      resizeObserver?.disconnect()
      window.cancelAnimationFrame(animationFrame)
      globe?._destructor()
      scene?.clear()
      renderer?.dispose()
      renderer?.forceContextLoss()
      mount.replaceChildren()
      delete mount.dataset.ready
      delete mount.dataset.dragging
    }
  }, [reduceMotion, shouldLoad])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      targetRotationRef.current.y += event.key === 'ArrowLeft' ? -0.22 : 0.22
    }
  }

  return (
    <figure className="network-globe" data-status={status}>
      <div className="network-globe__stage">
        <div
          className="network-globe__renderer"
          ref={rendererMountRef}
          role="img"
          aria-label="Globo 3D interativo com conexões partindo de São Paulo. Arraste ou use as setas para girar."
          tabIndex={status === 'ready' ? 0 : -1}
          onKeyDown={handleKeyDown}
        />
        {status === 'loading' && (
          <div className="network-globe__loading" aria-hidden="true">
            <span />
          </div>
        )}
        {status === 'fallback' && (
          <div className="network-globe__fallback" aria-hidden="true">
            <span />
          </div>
        )}
        <span className="network-globe__gesture" aria-hidden="true">
          Arraste para girar
        </span>
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
