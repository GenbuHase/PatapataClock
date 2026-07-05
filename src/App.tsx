import { useState } from 'react'
import { FlipClock } from './components/FlipClock/FlipClock'
import { SettingsPanel } from './components/Settings/SettingsPanel'
import { useClock } from './hooks/useClock'
import { useSettings } from './hooks/useSettings'
import styles from './App.module.css'

export default function App() {
  const { settings, updateSettings, theme } = useSettings()
  const time = useClock(settings.format24h)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div
      className={styles.app}
      style={{
        background: theme.background,
      }}
    >
      <FlipClock
        time={time}
        showSeconds={settings.showSeconds}
        theme={theme}
        size="lg"
        format24h={settings.format24h}
      />

      <button
        type="button"
        className={styles.settingsButton}
        onClick={() => setSettingsOpen(true)}
        aria-label="設定を開く"
      >
        ⚙
      </button>

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onChange={updateSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}
