import type { Settings } from '../../hooks/useSettings'
import { themeIds, themes } from '../../themes/keikyu'
import styles from './SettingsPanel.module.css'

interface SettingsPanelProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onClose: () => void
}

export function SettingsPanel({ settings, onChange, onClose }: SettingsPanelProps) {
  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <aside
        className={styles.panel}
        onClick={(event) => event.stopPropagation()}
        aria-label="設定"
      >
        <header className={styles.header}>
          <h2 className={styles.title}>設定</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="閉じる">
            ×
          </button>
        </header>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="show-seconds">
            秒を表示
          </label>
          <input
            id="show-seconds"
            type="checkbox"
            checked={settings.showSeconds}
            onChange={(event) => onChange({ showSeconds: event.target.checked })}
          />
        </div>

        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>時刻形式</legend>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="format"
              checked={settings.format24h}
              onChange={() => onChange({ format24h: true })}
            />
            24時間
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="format"
              checked={!settings.format24h}
              onChange={() => onChange({ format24h: false })}
            />
            12時間
          </label>
        </fieldset>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="theme">
            テーマ
          </label>
          <select
            id="theme"
            className={styles.select}
            value={settings.themeId}
            onChange={(event) => onChange({ themeId: event.target.value })}
          >
            {themeIds.map((id) => (
              <option key={id} value={id}>
                {themes[id]!.label}
              </option>
            ))}
          </select>
        </div>

        <p className={styles.note}>
          アニメーションは OS の「視差効果を減らす」設定に連動します。
        </p>
      </aside>
    </div>
  )
}
