import { useEffect, useRef, useState } from 'react'
import { formatBRL } from '../domain/format'

const DURATION_MS = 600

/** Valor que rola até o novo total quando muda (confirma uma cobrança). Sem animação na 1ª tela nem com "reduzir movimento". */
function useCountUp(target: number): number {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [shown, setShown] = useState(target)
  const current = useRef(target)

  useEffect(() => {
    if (reduce) return
    const from = current.current
    if (from === target) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS)
      const eased = 1 - (1 - t) ** 3
      current.current = Math.round(from + (target - from) * eased)
      setShown(current.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, reduce])

  return reduce ? target : shown
}

export function Money({ cents }: { cents: number }) {
  const shown = useCountUp(cents)
  return (
    <>
      <span aria-hidden="true">{formatBRL(shown)}</span>
      <span className="sr-only">{formatBRL(cents)}</span>
    </>
  )
}
