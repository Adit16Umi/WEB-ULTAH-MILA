import { useEffect, useState } from 'react'

function query(q) {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(q).matches
}

export function useLowPower() {
  const [low, setLow] = useState(
    () => query('(prefers-reduced-motion: reduce)') || query('(max-width: 820px)'),
  )

  useEffect(() => {
    const mqSmall = window.matchMedia('(max-width: 820px)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setLow(mqSmall.matches || mqMotion.matches)
    update()
    mqSmall.addEventListener('change', update)
    mqMotion.addEventListener('change', update)
    return () => {
      mqSmall.removeEventListener('change', update)
      mqMotion.removeEventListener('change', update)
    }
  }, [])

  return low
}

export default useLowPower
