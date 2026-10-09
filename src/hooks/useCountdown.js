import { useEffect, useState } from 'react'

function getNextBirthday(month, day) {
  const now = new Date()
  const year = now.getFullYear()
  let target = new Date(year, month - 1, day, 0, 0, 0)
  if (target.getTime() < now.getTime()) {
    target = new Date(year + 1, month - 1, day, 0, 0, 0)
  }
  return target
}

export function useCountdown(month, day) {
  const [state, setState] = useState(() => compute(month, day))

  useEffect(() => {
    const id = setInterval(() => setState(compute(month, day)), 1000)
    return () => clearInterval(id)
  }, [month, day])

  return state
}

function compute(month, day) {
  const now = new Date()
  const target = getNextBirthday(month, day)
  const diff = Math.max(0, target.getTime() - now.getTime())
  const totalSeconds = Math.floor(diff / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isToday: now.getMonth() + 1 === month && now.getDate() === day,
  }
}
