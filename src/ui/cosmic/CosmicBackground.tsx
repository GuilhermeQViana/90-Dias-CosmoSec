import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Fundo cosmico em three.js, inspirado na prova visual: starfield procedural
// com blending aditivo, nebulosas e leve parallax no mouse. Mantido leve para
// abrir rapido e rodar em Safari e iOS (Definition of Done).

function glowTexture(rgb: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, `rgba(${rgb},1)`)
  grad.addColorStop(0.25, `rgba(${rgb},0.55)`)
  grad.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

export function CosmicBackground(): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200)
    camera.position.set(0, 0.6, 6.4)

    const glowWhite = glowTexture('226,238,255')
    const glowBlue = glowTexture('59,130,246')
    const glowCyan = glowTexture('34,211,238')

    // Starfield.
    const N = 1500
    const pos = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    const palette = [new THREE.Color(0xbcd3f2), new THREE.Color(0x22d3ee), new THREE.Color(0xffffff), new THREE.Color(0x3b82f6)]
    for (let i = 0; i < N; i += 1) {
      const r = 24 + Math.random() * 60
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th)
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.6
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
      const cc = palette[(Math.random() * palette.length) | 0]!
      col[i * 3] = cc.r
      col[i * 3 + 1] = cc.g
      col[i * 3 + 2] = cc.b
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const stars = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.6,
        map: glowWhite,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    )
    const starGroup = new THREE.Group()
    starGroup.add(stars)
    scene.add(starGroup)

    // Nebulosas.
    const nebula = new THREE.Group()
    const defs = [
      { t: glowBlue, x: -9, y: 3, z: -14, s: 26, o: 0.2 },
      { t: glowCyan, x: 11, y: -5, z: -16, s: 22, o: 0.14 },
      { t: glowBlue, x: 6, y: 8, z: -20, s: 30, o: 0.12 },
    ]
    for (const d of defs) {
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: d.t, transparent: true, opacity: d.o, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      sp.position.set(d.x, d.y, d.z)
      sp.scale.set(d.s, d.s, 1)
      nebula.add(sp)
    }
    scene.add(nebula)

    const mouse = { x: 0, y: 0 }
    const onMove = (e: PointerEvent): void => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onResize = (): void => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('resize', onResize)

    let raf = 0
    const clock = new THREE.Clock()
    const animar = (): void => {
      const dt = Math.min(clock.getDelta(), 0.05)
      starGroup.rotation.y += dt * 0.01
      nebula.rotation.z += dt * 0.005
      camera.position.x += (mouse.x * 0.9 - camera.position.x) * Math.min(1, dt * 2)
      camera.position.y += (0.6 - mouse.y * 0.4 - camera.position.y) * Math.min(1, dt * 2)
      camera.lookAt(0, 0.2, 0)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animar)
    }
    animar()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      geo.dispose()
      stars.material.dispose()
      glowWhite.dispose()
      glowBlue.dispose()
      glowCyan.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={ref} className="fixed inset-0 -z-0" aria-hidden="true" />
}
