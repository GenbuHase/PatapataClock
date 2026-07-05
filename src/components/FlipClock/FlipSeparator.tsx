import type { CSSProperties } from 'react'
import type { ClockTheme } from '../../themes/keikyu'
import styles from './flip.module.css'

interface FlipSeparatorProps {
  theme: ClockTheme
}

export function FlipSeparator({ theme }: FlipSeparatorProps) {
  const style = {
    '--separator-color': theme.separatorColor,
    '--clock-font': theme.fontFamily,
  } as CSSProperties

  return (
    <div className={styles.separator} style={style} aria-hidden="true">
      <span className={styles.separatorDot} />
      <span className={styles.separatorDot} />
    </div>
  )
}
