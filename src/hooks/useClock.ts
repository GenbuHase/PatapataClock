import { useEffect, useState } from 'react'

export interface ClockTime {
  hours: string
  minutes: string
  seconds: string
  period?: 'AM' | 'PM'
}

function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

function toClockTime(date: Date, format24h: boolean): ClockTime {
  const hours24 = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  if (format24h) {
    return {
      hours: pad(hours24),
      minutes: pad(minutes),
      seconds: pad(seconds),
    }
  }

  const period: 'AM' | 'PM' = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 || 12

  return {
    hours: pad(hours12),
    minutes: pad(minutes),
    seconds: pad(seconds),
    period,
  }
}

export function useClock(format24h: boolean) {
  const [time, setTime] = useState<ClockTime>(() => toClockTime(new Date(), format24h))

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const tick = () => {
      setTime(toClockTime(new Date(), format24h))
      const now = Date.now()
      const msUntilNextSecond = 1000 - (now % 1000)
      timeoutId = setTimeout(tick, msUntilNextSecond)
    }

    tick()

    return () => clearTimeout(timeoutId)
  }, [format24h])

  return time
}
