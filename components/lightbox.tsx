'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Artwork } from '@/lib/artworks'

const MIN_SCALE = 1
const MAX_SCALE = 6
/** Where a click on the fitted work lands. */
const STEP_SCALE = 2.5
/** Pointer travel that separates a click from a drag, in px. */
const CLICK_SLOP = 6
/** Horizontal travel that counts as a swipe to the neighbouring work, in px. */
const SWIPE = 64

type View = { s: number; x: number; y: number }
const FIT: View = { s: 1, x: 0, y: 0 }

const OpenLightbox = createContext<((index: number) => void) | null>(null)

/**
 * Wraps a hung work so clicking it opens the lightbox. Outside a <Lightbox>
 * the work simply stays a picture, so the figure keeps working on its own.
 */
export function ZoomTrigger({
  index,
  label,
  children,
}: {
  index: number
  label: string
  children: React.ReactNode
}) {
  const open = useContext(OpenLightbox)
  if (!open) return <>{children}</>

  return (
    <button
      type="button"
      onClick={() => open(index)}
      aria-label={label}
      className="group block w-full cursor-zoom-in"
    >
      {children}
    </button>
  )
}

export function Lightbox({
  artworks,
  children,
}: {
  artworks: Artwork[]
  children: React.ReactNode
}) {
  const [index, setIndex] = useState<number | null>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  const open = useCallback((i: number) => {
    // So closing puts the visitor back on the work they came from.
    returnFocus.current = document.activeElement as HTMLElement | null
    setIndex(i)
  }, [])

  const close = useCallback(() => {
    setIndex(null)
    returnFocus.current?.focus?.()
  }, [])

  return (
    <OpenLightbox.Provider value={open}>
      {children}
      {index !== null && artworks[index] && (
        <Stage artworks={artworks} index={index} onIndex={setIndex} onClose={close} />
      )}
    </OpenLightbox.Provider>
  )
}

function Stage({
  artworks,
  index,
  onIndex,
  onClose,
}: {
  artworks: Artwork[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const art = artworks[index]

  const dialogRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [view, setView] = useState<View>(FIT)
  const [panning, setPanning] = useState(false)
  const viewRef = useRef(view)
  viewRef.current = view

  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef({
    start: FIT,
    from: { x: 0, y: 0 },
    dist: 0,
    travel: 0,
    multi: false,
  })

  /** Keeps the scale in range and stops the work being dragged off the stage. */
  const settle = useCallback((next: View): View => {
    const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next.s))
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return { s, x: 0, y: 0 }

    const w = imgRef.current?.offsetWidth ?? 0
    const h = imgRef.current?.offsetHeight ?? 0
    const maxX = Math.max(0, (w * s - rect.width) / 2)
    const maxY = Math.max(0, (h * s - rect.height) / 2)

    return {
      s,
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    }
  }, [])

  /** Zooms to `nextScale` keeping the surface under (clientX, clientY) still. */
  const zoomAt = useCallback(
    (nextScale: number, clientX: number, clientY: number) => {
      const rect = stageRef.current?.getBoundingClientRect()
      if (!rect) return

      const v = viewRef.current
      const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale))
      const cx = clientX - rect.left - rect.width / 2
      const cy = clientY - rect.top - rect.height / 2
      const k = s / v.s

      setView(settle({ s, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k }))
    },
    [settle],
  )

  const zoomCentre = useCallback(
    (nextScale: number) => {
      const rect = stageRef.current?.getBoundingClientRect()
      if (!rect) return
      zoomAt(nextScale, rect.left + rect.width / 2, rect.top + rect.height / 2)
    },
    [zoomAt],
  )

  const go = useCallback(
    (delta: number) => {
      onIndex((index + delta + artworks.length) % artworks.length)
    },
    [index, artworks.length, onIndex],
  )

  // A different work always opens fitted, never inheriting the last zoom.
  useEffect(() => {
    setView(FIT)
  }, [index])

  // The neighbours are one arrow key away, so they are worth having ready.
  useEffect(() => {
    const n = artworks.length
    for (const i of [(index + 1) % n, (index - 1 + n) % n]) {
      const neighbour = artworks[i]
      if (!neighbour) continue
      const preload = new window.Image()
      preload.src = neighbour.full ?? neighbour.src
    }
  }, [index, artworks])

  // React's onWheel is passive, and zooming has to stop the page scrolling.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      zoomAt(viewRef.current.s * Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY)
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  // Hold the wall still behind the lightbox, and take the focus with us.
  useEffect(() => {
    const body = document.body
    const gap = window.innerWidth - document.documentElement.clientWidth
    const overflow = body.style.overflow
    const padding = body.style.paddingRight

    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    dialogRef.current?.focus()

    return () => {
      body.style.overflow = overflow
      body.style.paddingRight = padding
    }
  }, [])

  function trapFocus(e: React.KeyboardEvent) {
    const root = dialogRef.current
    if (!root) return

    const stops = root.querySelectorAll<HTMLElement>('button:not([disabled])')
    if (!stops.length) return

    const first = stops[0]
    const last = stops[stops.length - 1]
    const active = document.activeElement

    if (e.shiftKey && (active === first || active === root)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        onClose()
        break
      case 'ArrowRight':
        e.preventDefault()
        go(1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        go(-1)
        break
      case '+':
      case '=':
        e.preventDefault()
        zoomCentre(viewRef.current.s * 1.4)
        break
      case '-':
        e.preventDefault()
        zoomCentre(viewRef.current.s / 1.4)
        break
      case '0':
        e.preventDefault()
        setView(FIT)
        break
      case 'Tab':
        trapFocus(e)
        break
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    const live = [...pointers.current.values()]
    const g = gesture.current
    g.start = viewRef.current

    if (live.length === 1) {
      g.from = { x: e.clientX, y: e.clientY }
      g.travel = 0
      g.multi = false
      if (viewRef.current.s > MIN_SCALE) setPanning(true)
    } else if (live.length === 2) {
      g.multi = true
      g.dist = Math.hypot(live[0].x - live[1].x, live[0].y - live[1].y)
      setPanning(false)
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    const live = [...pointers.current.values()]
    const g = gesture.current

    // Two fingers: pinch around whatever sits between them, so the surface
    // follows the hand instead of the middle of the screen.
    if (live.length >= 2) {
      if (!g.dist) return
      const dist = Math.hypot(live[0].x - live[1].x, live[0].y - live[1].y)
      zoomAt(
        g.start.s * (dist / g.dist),
        (live[0].x + live[1].x) / 2,
        (live[0].y + live[1].y) / 2,
      )
      return
    }

    const dx = e.clientX - g.from.x
    const dy = e.clientY - g.from.y
    g.travel = Math.max(g.travel, Math.hypot(dx, dy))

    if (g.start.s > MIN_SCALE) {
      setView(settle({ s: g.start.s, x: g.start.x + dx, y: g.start.y + dy }))
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    const held = pointers.current.size
    pointers.current.delete(e.pointerId)
    if (pointers.current.size === 0) setPanning(false)
    gesture.current.dist = 0

    // Only the last finger of a one-finger gesture decides anything.
    const g = gesture.current
    if (held !== 1 || g.multi) return

    if (g.travel > CLICK_SLOP) {
      const dx = e.clientX - g.from.x
      if (g.start.s === MIN_SCALE && Math.abs(dx) > SWIPE) go(dx < 0 ? 1 : -1)
      return
    }

    // A click on the work zooms it; a click on the wall around it closes.
    if (e.target === imgRef.current) {
      zoomAt(viewRef.current.s > MIN_SCALE ? MIN_SCALE : STEP_SCALE, e.clientX, e.clientY)
    } else {
      onClose()
    }
  }

  const zoomed = view.s > MIN_SCALE + 0.001
  // The whole site is drawn in centimetres, so the zoom reads in them too.
  const across = Math.max(1, Math.round(art.wcm / view.s))
  const chrome = 'text-[0.875rem] leading-none text-muted-foreground hover:text-foreground'

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={art.title || 'Work'}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="lb-open fixed inset-0 z-50 flex flex-col bg-background text-foreground outline-none"
    >
      <div className="flex shrink-0 items-start justify-between gap-6 px-6 py-5 md:px-10">
        <div>
          <span className="block text-[0.9375rem] font-medium leading-snug">{art.title}</span>
          <span className="measure mt-0.5 block text-[0.875rem] text-muted-foreground">
            {art.wcm} × {art.hcm} cm
          </span>
        </div>
        <button type="button" onClick={onClose} className={`shrink-0 pt-1 ${chrome}`}>
          Close
        </button>
      </div>

      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`relative min-h-0 flex-1 touch-none overflow-hidden ${
          zoomed ? (panning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
      >
        {/* The frame ignores the pointer so clicks land on either the work or the wall. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 md:p-10">
          <img
            ref={imgRef}
            key={art.src}
            src={art.full ?? art.src}
            alt={art.alt}
            width={1000}
            height={Math.round(1000 / (art.ratio ?? art.wcm / art.hcm))}
            draggable={false}
            /* object-contain, like the wall: the whole photograph, never a crop. */
            className={`pointer-events-auto max-h-full max-w-full select-none object-contain ring-1 ring-inset ring-[var(--canvas-edge)] ${
              panning ? '' : 'lb-settle'
            }`}
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-6 px-6 py-5 md:px-10">
        <div className="flex items-center gap-5">
          <button type="button" onClick={() => go(-1)} aria-label="Previous work" className={chrome}>
            ←
          </button>
          <span className="measure text-[0.875rem] text-muted-foreground">
            {String(index + 1).padStart(2, '0')} / {String(artworks.length).padStart(2, '0')}
          </span>
          <button type="button" onClick={() => go(1)} aria-label="Next work" className={chrome}>
            →
          </button>
        </div>

        <div className="flex items-center gap-5">
          <span className="measure text-[0.875rem] text-muted-foreground">
            {zoomed ? `Detail · ${across} cm across` : 'Click the work to zoom'}
          </span>
          {zoomed && (
            <button type="button" onClick={() => setView(FIT)} className={chrome}>
              Fit
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
