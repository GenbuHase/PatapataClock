import type { AnimationEvent } from 'react'
import type { ClockTheme } from '../../themes/keikyu'
import { useFlipPairAnimation } from '../../hooks/useFlipPairAnimation'
import { FlipDigitView } from './FlipDigitView'

interface FlipPairProps {
  value: string
  theme: ClockTheme
  size?: 'md' | 'lg'
}

export function FlipPair({ value, theme, size = 'lg' }: FlipPairProps) {
  const { current, next, isFlipping, onFlipEnd } = useFlipPairAnimation(value)

  const handleFlipEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    onFlipEnd()
  }

  const digits = [0, 1] as const
  const flipEndIndex = digits.reduce<number>(
    (last, index) => {
      if (!isFlipping || next === null) return last
      if (current[index] !== next[index]) return index
      return last
    },
    -1,
  )

  return (
    <>
      {digits.map((index) => {
        const currentDigit = current[index]!
        const nextDigit = next?.[index] ?? currentDigit
        const digitFlipping = isFlipping && currentDigit !== nextDigit

        return (
          <FlipDigitView
            key={index}
            current={currentDigit}
            next={nextDigit}
            isFlipping={digitFlipping}
            ariaValue={value[index]!}
            theme={theme}
            size={size}
            onFlipEnd={index === flipEndIndex ? handleFlipEnd : undefined}
          />
        )
      })}
    </>
  )
}
