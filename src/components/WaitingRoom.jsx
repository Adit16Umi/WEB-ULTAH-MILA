import { AnimatePresence, motion } from 'framer-motion'
import config from '../config'
import { useCountdown } from '../hooks/useCountdown'
import Emoji3D from './Emoji3D'

function nextBirthdayTs(month, day) {
  const now = new Date()
  const year = now.getFullYear()
  let t = new Date(year, month - 1, day, 0, 0, 0)
  if (t.getTime() < now.getTime()) t = new Date(year + 1, month - 1, day, 0, 0, 0)
  return t.getTime()
}

function prevBirthdayTs(month, day) {
  const next = new Date(nextBirthdayTs(month, day))
  return new Date(next.getFullYear() - 1, month - 1, day, 0, 0, 0).getTime()
}

function FlipUnit({ value, label }) {
  const text = String(value).padStart(2, '0')
  return (
    <div className="count-card glass">
      <div className="flip">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={text}
            className="num"
            initial={{ y: '-90%', opacity: 0, rotateX: -80 }}
            animate={{ y: '0%', opacity: 1, rotateX: 0 }}
            exit={{ y: '90%', opacity: 0, rotateX: 80 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {text}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="lbl">{label}</div>
    </div>
  )
}

const DECOR = [
  { name: 'balloon', cls: 'd1' },
  { name: 'cherryBlossom', cls: 'd2' },
  { name: 'gift', cls: 'd3' },
  { name: 'sparkles', cls: 'd4' },
  { name: 'butterfly', cls: 'd5' },
  { name: 'cupcake', cls: 'd6' },
]

export default function WaitingRoom({ birthDate, onOpenSettings }) {
  const { days, hours, minutes, seconds } = useCountdown(birthDate.month, birthDate.day)

  const now = Date.now()
  const next = nextBirthdayTs(birthDate.month, birthDate.day)
  const prev = prevBirthdayTs(birthDate.month, birthDate.day)
  const progress = Math.min(100, Math.max(0, ((now - prev) / (next - prev)) * 100))

  return (
    <section className="waiting">
      <div className="waiting-decor" aria-hidden="true">
        {DECOR.map((d) => (
          <span key={d.name} className={`decor-item ${d.cls}`}>
            <Emoji3D name={d.name} size={46} />
          </span>
        ))}
      </div>

      <motion.div
        className="waiting-inner"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="waiting-script">Menuju Hari Bahagia</span>
        <h1 className="waiting-name">{config.name}</h1>
        <p className="waiting-sub">
          Halaman perayaan akan terbuka otomatis saat waktunya tiba. Tunggu ya 💗
        </p>

        <div className="count-grid waiting-count">
          <FlipUnit value={days} label="Hari" />
          <FlipUnit value={hours} label="Jam" />
          <FlipUnit value={minutes} label="Menit" />
          <FlipUnit value={seconds} label="Detik" />
        </div>

        <div className="progress-wrap">
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="progress-label">
            {config.name} akan berusia ke-{config.age} 🎂
          </span>
        </div>
      </motion.div>

      <button className="settings-gear" onClick={onOpenSettings} aria-label="Pengaturan" title="Pengaturan">
        ⚙
      </button>
    </section>
  )
}
