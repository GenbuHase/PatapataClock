import { useCallback, useEffect, useState } from 'react'

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  return prefersReducedMotion
}

export function useFlipAnimation(value: string) {
  const [current, setCurrent] = useState(value)
  const [next, setNext] = useState<string | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (value === current) return

    if (prefersReducedMotion) {
      setCurrent(value)
      setNext(null)
      return
    }

    setNext(value)
  }, [value, current, prefersReducedMotion])

  const isFlipping = next !== null

  const onFlipEnd = useCallback(() => {
    setNext((pending) => {
      if (pending !== null) {
        setCurrent(pending)
      }
      return null
    })
  }, [])

  const displayNext = next ?? current

  return { current, next: displayNext, isFlipping, onFlipEnd, prefersReducedMotion }
}
