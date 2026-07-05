import type { CSSProperties } from 'react'
import type { ClockTime } from '../../hooks/useClock'
import type { ClockTheme } from '../../themes/keikyu'
import { FlipDigit } from './FlipDigit'
import { FlipSeparator } from './FlipSeparator'
import styles from './flip.module.css'

interface FlipClockProps {
  time: ClockTime
  showSeconds?: boolean
  theme: ClockTheme
  size?: 'md' | 'lg'
  format24h?: boolean
}

export function FlipClock({
  time,
  showSeconds = false,
  theme,
  size = 'lg',
  format24h = true,
}: FlipClockProps) {
  const clockClass = size === 'lg' ? `${styles.clock} ${styles.clockLg}` : styles.clock

  return (
    <div className={clockClass} role="timer" aria-live="polite" aria-atomic="true">
      <div className={styles.group}>
        <FlipDigit value={time.hours[0]!} theme={theme} size={size} />
        <FlipDigit value={time.hours[1]!} theme={theme} size={size} />
      </div>

      <FlipSeparator theme={theme} />

      <div className={styles.group}>
        <FlipDigit value={time.minutes[0]!} theme={theme} size={size} />
        <FlipDigit value={time.minutes[1]!} theme={theme} size={size} />
      </div>

      {showSeconds && (
        <>
          <FlipSeparator theme={theme} />
          <div className={styles.group}>
            <FlipDigit value={time.seconds[0]!} theme={theme} size={size} />
            <FlipDigit value={time.seconds[1]!} theme={theme} size={size} />
          </div>
        </>
      )}

      {!format24h && time.period && (
        <span className={styles.period} style={{ '--separator-color': theme.separatorColor } as CSSProperties}>
          {time.period}
        </span>
      )}
    </div>
  )
}
