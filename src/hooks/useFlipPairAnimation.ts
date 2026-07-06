import { useCallback, useEffect, useRef, useState } from 'react'

export const FLIP_HALF_DURATION_MS = 500
export const FLIP_DURATION_MS = FLIP_HALF_DURATION_MS * 2

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

export function useFlipPairAnimation(pairValue: string) {
  const [current, setCurrent] = useState(pairValue)
  const [next, setNext] = useState<string | null>(null)
  const flipTargetRef = useRef<string | null>(null)
  const queuedValueRef = useRef<string | null>(null)
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const prefersReducedMotion = usePrefersReducedMotion()

  const finishFlip = useCallback(() => {
    const target = flipTargetRef.current
    if (target === null) return

    flipTargetRef.current = null
    clearTimeout(finishTimeoutRef.current)
    setCurrent(target)
    setNext(null)
  }, [])

  const startFlip = useCallback(
    (target: string) => {
      flipTargetRef.current = target
      setNext(target)
      clearTimeout(finishTimeoutRef.current)
      finishTimeoutRef.current = setTimeout(finishFlip, FLIP_DURATION_MS)
    },
    [finishFlip],
  )

  useEffect(() => {
    if (prefersReducedMotion) {
      queuedValueRef.current = null
      flipTargetRef.current = null
      clearTimeout(finishTimeoutRef.current)
      setCurrent(pairValue)
      setNext(null)
      return
    }

    if (next !== null) {
      if (pairValue !== flipTargetRef.current) {
        queuedValueRef.current = pairValue
      }
      return
    }

    const target = queuedValueRef.current ?? pairValue
    if (target === current) {
      queuedValueRef.current = null
      return
    }

    queuedValueRef.current = null
    startFlip(target)
  }, [pairValue, current, next, prefersReducedMotion, startFlip])

  const isFlipping = next !== null

  return { current, next, isFlipping, onFlipEnd: finishFlip, prefersReducedMotion }
}
