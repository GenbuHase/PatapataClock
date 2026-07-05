import { useCallback, useEffect, useRef, useState } from 'react'

const FLIP_DURATION_MS = 600

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
  const pendingRef = useRef<string | null>(null)
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const prefersReducedMotion = usePrefersReducedMotion()

  const finishFlip = useCallback(() => {
    const pending = pendingRef.current
    if (pending === null) return

    pendingRef.current = null
    clearTimeout(finishTimeoutRef.current)
    setCurrent(pending)
    setNext(null)
  }, [])

  useEffect(() => {
    if (value === current) {
      pendingRef.current = null
      return
    }

    if (prefersReducedMotion) {
      pendingRef.current = null
      clearTimeout(finishTimeoutRef.current)
      setCurrent(value)
      setNext(null)
      return
    }

    if (pendingRef.current === value) return

    pendingRef.current = value
    setNext(value)

    clearTimeout(finishTimeoutRef.current)
    finishTimeoutRef.current = setTimeout(finishFlip, FLIP_DURATION_MS)
  }, [value, current, prefersReducedMotion, finishFlip])

  const isFlipping = next !== null
  const displayNext = next ?? current

  return { current, next: displayNext, isFlipping, onFlipEnd: finishFlip, prefersReducedMotion }
}
