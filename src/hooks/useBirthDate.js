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

export default useBirthDate
