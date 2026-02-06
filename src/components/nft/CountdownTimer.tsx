import { useState, useEffect, useCallback } from 'react'
import { cn } from '../../lib/utils'

export interface CountdownTimerProps {
  endTime: string
  onEnd?: () => void
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(endTime: string): TimeLeft {
  const diff = Math.max(0, new Date(endTime).getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function CountdownTimer({ endTime, onEnd, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(endTime))
  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  const tick = useCallback(() => {
    const next = calcTimeLeft(endTime)
    setTimeLeft(next)
    if (next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
      onEnd?.()
    }
  }, [endTime, onEnd])

  useEffect(() => {
    if (isExpired) return
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tick, isExpired])

  const segments = [
    { label: 'd', value: timeLeft.days },
    { label: 'h', value: timeLeft.hours },
    { label: 'm', value: timeLeft.minutes },
    { label: 's', value: timeLeft.seconds },
  ]

  if (isExpired) {
    return (
      <span className={cn('text-sm font-medium text-red-500 dark:text-red-400', className)}>
        Ended
      </span>
    )
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {segments.map(seg => (
        <div key={seg.label} className="flex items-baseline gap-0.5">
          <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {pad(seg.value)}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{seg.label}</span>
        </div>
      ))}
    </div>
  )
}

export { CountdownTimer }
