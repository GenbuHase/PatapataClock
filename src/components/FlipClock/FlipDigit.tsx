import type { AnimationEvent, CSSProperties } from 'react'
import type { ClockTheme } from '../../themes/keikyu'
import { useFlipAnimation } from '../../hooks/useFlipAnimation'
import styles from './flip.module.css'

interface FlipDigitProps {
  value: string
  theme: ClockTheme
  size?: 'md' | 'lg'
}

export function FlipDigit({ value, theme, size = 'lg' }: FlipDigitProps) {
  const { current, next, isFlipping, onFlipEnd } = useFlipAnimation(value)

  const digitClass = size === 'lg' ? `${styles.digit} ${styles.digitLg}` : styles.digit

  const style = {
    '--flap-bg': theme.flapBackground,
    '--digit-color': theme.digitColor,
    '--hinge-shadow': theme.hingeShadow,
    '--clock-font': theme.fontFamily,
  } as CSSProperties

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (isFlipping) {
      onFlipEnd()
    }
  }

  return (
    <div className={digitClass} style={style} aria-label={value}>
      <div className={styles.card}>
        <div className={`${styles.half} ${styles.halfTop} ${styles.staticTop}`}>
          <span className={styles.number} aria-hidden="true">
            {isFlipping ? next : value}
          </span>
        </div>
        <div className={`${styles.half} ${styles.halfBottom} ${styles.staticBottom}`}>
          <span className={styles.number} aria-hidden="true">
            {isFlipping ? next : value}
          </span>
        </div>

        {isFlipping && (
          <>
            <div
              className={`${styles.half} ${styles.halfTop} ${styles.flipTop} ${styles.flipTopActive}`}
              onAnimationEnd={handleAnimationEnd}
            >
              <span className={styles.number} aria-hidden="true">
                {current}
              </span>
            </div>
            <div
              className={`${styles.half} ${styles.halfBottom} ${styles.flipBottom} ${styles.flipBottomActive}`}
            >
              <span className={styles.number} aria-hidden="true">
                {next}
              </span>
            </div>
          </>
        )}

        <div className={styles.hinge} aria-hidden="true" />
      </div>
    </div>
  )
}
