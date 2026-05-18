'use client'

import { useEffect, useState } from 'react'

interface Props {
  repos: number
  stars: number
  forks: number
  followers: number
}

function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const from = 0
    const to = value

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return <>{display.toLocaleString()}</>
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-surface rounded p-4 text-center">
      <div className="text-2xl font-mono font-bold text-accent tabular-nums">
        <AnimatedNumber value={value} />
      </div>
      <div className="text-text-muted font-mono text-xs mt-1 uppercase tracking-wider">{label}</div>
    </div>
  )
}

export default function StatsRow({ repos, stars, forks, followers }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatBox label="Repos" value={repos} />
      <StatBox label="Stars" value={stars} />
      <StatBox label="Forks" value={forks} />
      <StatBox label="Followers" value={followers} />
    </div>
  )
}
