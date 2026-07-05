import { useCallback, useState } from 'react'
import type { ClockTheme } from '../themes/keikyu'
import { keikyuTheme, themes } from '../themes/keikyu'

export interface Settings {
  showSeconds: boolean
  format24h: boolean
  themeId: string
}

const STORAGE_KEY = 'patapata-clock-settings'

const defaultSettings: Settings = {
  showSeconds: true,
  format24h: true,
  themeId: 'keikyu',
}

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw) as Partial<Settings>
    return {
      showSeconds: parsed.showSeconds ?? defaultSettings.showSeconds,
      format24h: parsed.format24h ?? defaultSettings.format24h,
      themeId: parsed.themeId && themes[parsed.themeId] ? parsed.themeId : defaultSettings.themeId,
    }
  } catch {
    return defaultSettings
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(readSettings)

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const theme: ClockTheme = themes[settings.themeId] ?? keikyuTheme

  return { settings, updateSettings, theme }
}
