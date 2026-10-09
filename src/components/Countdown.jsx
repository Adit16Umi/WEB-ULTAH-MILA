import config from '../config'
import { useCountdown } from '../hooks/useCountdown'
import Reveal from './Reveal'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function Countdown() {
  const { days, hours, minutes, seconds, isToday } = useCountdown(config.birthMonth, config.birthDay)

  const cells = [
    { num: pad(days), lbl: 'Hari' },
    { num: pad(hours), lbl: 'Jam' },
    { num: pad(minutes), lbl: 'Menit' },
    { num: pad(seconds), lbl: 'Detik' },
  ]

  return (
    <section id="hitung">
      <div className="container">
        <Reveal className="section-title">
          <h2>{isToday ? 'Hari Istimewa Tiba! 🎉' : 'Menuju Hari Bahagia'} </h2>
          <p>
            {isToday
              ? 'Hari ini tepat ulang tahunmu. Selamat ya!'
              : `Menghitung detik menuju ulang tahun ${config.name} berikutnya.`}
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="count-grid">
            {cells.map((c) => (
              <div className="count-card glass" key={c.lbl}>
                <div className="num">{c.num}</div>
                <div className="lbl">{c.lbl}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="count-note">
            {isToday ? 'Happy Birthday, ' + config.name + '! 🎂' : 'Setiap detik semakin dekat 💗'}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
