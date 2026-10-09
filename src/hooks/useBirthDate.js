import config from '../config'
import { useLocalStorage } from './useLocalStorage'

const DEFAULT = {
  day: config.birthDay,
  month: config.birthMonth,
  year: config.birthYear,
}

export function useBirthDate() {
  const [birthDate, setBirthDate] = useLocalStorage('birthday-date', DEFAULT)

  const update = (next) => {
    setBirthDate({
      day: Number(next.day) || DEFAULT.day,
      month: Number(next.month) || DEFAULT.month,
      year: Number(next.year) || DEFAULT.year,
    })
  }

  const reset = () => setBirthDate(DEFAULT)

  return { birthDate, update, reset }
}

export function getTurningAge(birthDate, from = new Date()) {
  const { day, month, year } = birthDate || {}
  const birthYear = Number(year)
  if (!birthYear) return 0

  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  let target = new Date(from.getFullYear(), Number(month) - 1, Number(day))
  if (target < today) {
    target = new Date(from.getFullYear() + 1, Number(month) - 1, Number(day))
  }
  return Math.max(0, target.getFullYear() - birthYear)
}

export default useBirthDate
