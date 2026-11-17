"use client"

import { useEffect, useRef } from "react"

// Brand colors from globals.css (--avana-cyan, --type-color-secondary).
const CYAN = "1, 170, 207"
const GREY = "115, 114, 108"

const LINES_PER_SIDE = 56
const SEGMENTS = 140
const MAX_DPR = 2

type Pointer = { x: number; y: number; strength: number; target: number }

// Bundles of curved lines that pinch to a narrow waist at the horizontal center and
// fan out toward both edges. The pointer pushes nearby lines apart; they ease back
// when it leaves. Reduced motion draws one static frame.
export default function LineFieldCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    if (!canvas || !host || !ctx) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const coarsePointer = window.matchMedia("(pointer: coarse)")

    let width = 0
    let height = 0
    let frame = 0
    let visible = true
    let running = false
    let lastTime = 0
    let clock = 0
    const pointer: Pointer = { x: -9999, y: -9999, strength: 0, target: 0 }
    const xs = new Float32Array(SEGMENTS + 1)
    let gradient: CanvasGradient | null = null

    // Spread values: denser near 0 so the bundle reads darker at its core.
    const spreads: number[] = []
    for (let i = 1; i <= LINES_PER_SIDE; i++) {
      const t = Math.pow(i / LINES_PER_SIDE, 1.9)
      spreads.push(t, -t)
    }
    spreads.push(0)

    const resize = () => {
      const rect = host.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      for (let s = 0; s <= SEGMENTS; s++) xs[s] = (s / SEGMENTS) * width

      // Dark at the waist, fading to transparent at the edges.
      gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, `rgba(${CYAN}, 0)`)
      gradient.addColorStop(0.16, `rgba(${CYAN}, 0.16)`)
      gradient.addColorStop(0.36, `rgba(${CYAN}, 0.5)`)
      gradient.addColorStop(0.47, `rgba(${GREY}, 0.75)`)
      gradient.addColorStop(0.53, `rgba(${GREY}, 0.75)`)
      gradient.addColorStop(0.64, `rgba(${CYAN}, 0.5)`)
      gradient.addColorStop(0.84, `rgba(${CYAN}, 0.16)`)
      gradient.addColorStop(1, `rgba(${CYAN}, 0)`)
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      if (!gradient) return

      const cx = width / 2
      const cy = height * 0.66
      const halfWidth = width / 2
      const waist = Math.min(70, width * 0.035)
      const bend = Math.max(80, halfWidth * 0.4)
      const amplitude = Math.min(height * 0.95, width * 0.7)
      const reach = Math.max(70, Math.min(170, width * 0.11))
      const push = reach * 0.55
      const idle = reducedMotion.matches ? 0 : 1
      const pull = pointer.strength

      const lineY = (l: number, x: number) => {
        const k = spreads[l]
        // Gentle breathing so the field is never fully still.
        const sway = idle * Math.sin(time * 0.00045 + l * 0.37) * 0.035
        const d = Math.max(0, Math.abs(x - cx) - waist) / halfWidth
        // Flat at the waist, near-linear toward the edge.
        const g = (d * d) / (d + bend / halfWidth)
        let y = cy + k * (1 + sway) * amplitude * g

        if (pull > 0.001) {
          const dx = x - pointer.x
          const dy = y - pointer.y
          const falloff = Math.exp(-(dx * dx + dy * dy) / (reach * reach))
          // Part the lines around the pointer, keeping the core bundle intact.
          const dir = dy === 0 ? (k >= 0 ? 1 : -1) : Math.sign(dy)
          y += dir * push * falloff * pull * Math.min(1, Math.abs(dy) / 12 + 0.35)
        }
        return y
      }

      ctx.strokeStyle = gradient
      ctx.lineWidth = 1

      for (let l = 0; l < spreads.length; l++) {
        ctx.globalAlpha = 0.9 - Math.abs(spreads[l]) * 0.7
        ctx.beginPath()
        for (let s = 0; s <= SEGMENTS; s++) {
          const x = xs[s]
          const y = lineY(l, x)
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      ctx.globalAlpha = 1
    }

    const tick = (now: number) => {
      const dt = lastTime ? Math.min(64, now - lastTime) : 16
      lastTime = now
      clock += dt
      // Ease the pointer influence in and out.
      pointer.strength += (pointer.target - pointer.strength) * (1 - Math.exp(-dt / 140))
      draw(clock)
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running || reducedMotion.matches || !visible || document.hidden) return
      running = true
      lastTime = 0
      frame = requestAnimationFrame(tick)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const refresh = () => {
      resize()
      if (reducedMotion.matches) {
        stop()
        draw(0)
      } else {
        draw(clock)
        start()
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.target = event.pointerType === "touch" || coarsePointer.matches ? 0.6 : 1
    }
    const onPointerLeave = () => {
      pointer.target = 0
    }
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType === "touch") onPointerLeave()
    }

    const onVisibility = () => (document.hidden ? stop() : start())

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    observer.observe(host)

    const resizeObserver = new ResizeObserver(() => refresh())
    resizeObserver.observe(host)

    host.addEventListener("pointermove", onPointerMove, { passive: true })
    host.addEventListener("pointerdown", onPointerMove, { passive: true })
    host.addEventListener("pointerleave", onPointerLeave)
    host.addEventListener("pointercancel", onPointerLeave)
    host.addEventListener("pointerup", onPointerUp)
    document.addEventListener("visibilitychange", onVisibility)
    reducedMotion.addEventListener("change", refresh)

    refresh()

    return () => {
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
      host.removeEventListener("pointermove", onPointerMove)
      host.removeEventListener("pointerdown", onPointerMove)
      host.removeEventListener("pointerleave", onPointerLeave)
      host.removeEventListener("pointercancel", onPointerLeave)
      host.removeEventListener("pointerup", onPointerUp)
      document.removeEventListener("visibilitychange", onVisibility)
      reducedMotion.removeEventListener("change", refresh)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
