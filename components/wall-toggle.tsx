'use client'

import { useEffect, useState } from 'react'

type Wall = 'black' | 'white'

/** Reads whatever the inline script in <head> already put on the element. */
function currentWall(): Wall {
  return document.documentElement.dataset.wall === 'white' ? 'white' : 'black'
}

export function WallToggle() {
  const [wall, setWall] = useState<Wall>('black')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setWall(currentWall())
    setReady(true)
  }, [])

  function switchWall() {
    const next: Wall = wall === 'black' ? 'white' : 'black'
    document.documentElement.dataset.wall = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      next === 'white' ? '#ffffff' : '#000000',
    )
    try {
      localStorage.setItem('wall', next)
    } catch {
      // A browser that refuses storage still gets the switch, just not the memory.
    }
    setWall(next)
  }

  const target = wall === 'black' ? 'white' : 'black'

  return (
    <button
      type="button"
      onClick={switchWall}
      aria-label={`Show the works on a ${target} wall`}
      className="flex items-center gap-2.5 text-[0.875rem] leading-none text-muted-foreground hover:text-foreground"
    >
      <span className="wall-swatch" aria-hidden="true" />
      {/* Before hydration the label would be a guess, so hold the space instead. */}
      <span className={ready ? undefined : 'invisible'}>
        {target === 'white' ? 'White wall' : 'Black wall'}
      </span>
    </button>
  )
}
