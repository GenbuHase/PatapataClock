export interface ClockTheme {
  id: string
  label: string
  background: string
  flapBackground: string
  digitColor: string
  separatorColor: string
  fontFamily: string
  hingeShadow: string
}

export const keikyuTheme: ClockTheme = {
  id: 'keikyu',
  label: 'Keikyu',
  background: '#1a1a1a',
  flapBackground: '#f5f0e8',
  digitColor: '#111111',
  separatorColor: '#f5f0e8',
  fontFamily: '"Roboto Condensed", "Noto Sans JP", "DIN Alternate", sans-serif',
  hingeShadow: 'rgba(0, 0, 0, 0.4)',
}

export const themes: Record<string, ClockTheme> = {
  keikyu: keikyuTheme,
}

export const themeIds = Object.keys(themes) as Array<keyof typeof themes>
