import { motion } from 'framer-motion'
import config from '../config'

export default function Hero({ onCelebrate }) {
  return (
    <section id="beranda">
      <div className="container hero">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="hbd">Selamat Ulang Tahun</span>
          <span className="name">{config.name}</span>
          <p className="tag">
            {config.greeting} {config.subGreeting}
          </p>
          <div className="hero-actions">
            <button className="btn" onClick={onCelebrate}>
              🎂 Tiup Lilin
            </button>
            <a className="btn ghost" href="#kejutan">
              🎁 Buka Kejutan
            </a>
          </div>
        </motion.div>

        <motion.div
          className="photo-wrap"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        >
          <span className="orbit o1">🎈</span>
          <span className="orbit o2">🌸</span>
          <span className="orbit o3">💐</span>
          <span className="orbit o4">✨</span>
          <div className="photo-ring">
            <img src={config.photo} alt={`Foto ${config.name}`} />
          </div>
          <div className="photo-badge">ke-{config.age} 🎉</div>
        </motion.div>
      </div>
    </section>
  )
}
