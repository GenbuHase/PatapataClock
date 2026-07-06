import type { AnimationEvent, CSSProperties } from 'react'
import type { ClockTheme } from '../../themes/keikyu'
import { FLIP_HALF_DURATION_MS } from '../../hooks/useFlipPairAnimation'
import styles from './flip.module.css'

interface FlipDigitViewProps {
  current: string
  next: string
  isFlipping: boolean
  ariaValue: string
  theme: ClockTheme
  size?: 'md' | 'lg'
  onFlipEnd?: (event: AnimationEvent<HTMLDivElement>) => void
}

export function FlipDigitView({
  current,
  next,
  isFlipping,
  ariaValue,
  theme,
  size = 'lg',
  onFlipEnd,
}: FlipDigitViewProps) {
  const digitClass = size === 'lg' ? `${styles.digit} ${styles.digitLg}` : styles.digit

  const style = {
    '--flap-bg': theme.flapBackground,
    '--digit-color': theme.digitColor,
    '--hinge-shadow': theme.hingeShadow,
    '--clock-font': theme.fontFamily,
    '--flip-half-duration': `${FLIP_HALF_DURATION_MS}ms`,
  } as CSSProperties

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    onFlipEnd?.(event)
  }

  return (
    <div className={digitClass} style={style} aria-label={ariaValue}>
      <div className={styles.card}>
        <div className={`${styles.half} ${styles.halfTop} ${styles.staticTop}`}>
          <div className={styles.halfInner}>
            <span className={styles.number} aria-hidden="true">
              {isFlipping ? next : current}
            </span>
          </div>
        </div>
        <div className={`${styles.half} ${styles.halfBottom} ${styles.staticBottom}`}>
          <div className={styles.halfInner}>
            <span className={styles.number} aria-hidden="true">
              {current}
            </span>
          </div>
        </div>

        {isFlipping && (
          <>
            <div
              key={`${current}-${next}-top`}
              className={`${styles.half} ${styles.halfTop} ${styles.flipTop} ${styles.flipTopActive}`}
            >
              <div className={styles.halfInner}>
                <span className={styles.number} aria-hidden="true">
                  {current}
                </span>
              </div>
            </div>
            <div
              key={`${current}-${next}-bottom`}
              className={`${styles.half} ${styles.halfBottom} ${styles.flipBottom} ${styles.flipBottomActive}`}
              onAnimationEnd={onFlipEnd ? handleAnimationEnd : undefined}
            >
              <div className={styles.halfInner}>
                <span className={styles.number} aria-hidden="true">
                  {next}
                </span>
              </div>
            </div>
          </>
        )}

        <div className={styles.hinge} aria-hidden="true" />
      </div>
    </div>
  )
}
