import { useState } from 'react'
import { motion } from 'framer-motion'
import config from '../config'

export default function BirthdayCake({ onCelebrate }) {
  const [blown, setBlown] = useState(false)
  const candleCount = Math.max(1, Math.min(config.age, 9))

  const blow = () => {
    if (blown) return
    setBlown(true)
    onCelebrate?.()
  }

  return (
    <section id="kue" className="cake-section">
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2>Kue Ulang Tahun</h2>
          <p>Tiup lilinnya dan buat sebuah permohonan 💫</p>
        </motion.div>

        <motion.div
          className="cake-stage"
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
        >
          <div className={`cake ${blown ? 'is-blown' : ''}`}>
            <div className="candles">
              {Array.from({ length: candleCount }).map((_, i) => (
                <div className="candle" key={i}>
                  <span className="flame" style={{ animationDelay: `${(i % 3) * 0.22}s` }} />
                  {blown && <span className="smoke" style={{ animationDelay: `${(i % 3) * 0.18}s` }} />}
                </div>
              ))}
            </div>
            <div className="cake-top">
              <span className="cherry" />
            </div>
            <div className="cake-layer l1" />
            <div className="cake-layer l2" />
            <div className="cake-layer l3" />
            <div className="cake-plate" />
          </div>
        </motion.div>

        <div className="cake-actions">
          <motion.button
            className="btn"
            onClick={blow}
            disabled={blown}
            whileHover={blown ? {} : { scale: 1.06, y: -3 }}
            whileTap={blown ? {} : { scale: 0.95 }}
          >
            🎂 Tiup Lilin
          </motion.button>
          <motion.button
            className="btn ghost"
            onClick={() => setBlown(false)}
            disabled={!blown}
            whileHover={!blown ? {} : { scale: 1.06, y: -3 }}
            whileTap={!blown ? {} : { scale: 0.95 }}
          >
            ✨ Nyalakan Lagi
          </motion.button>
        </div>
      </div>
    </section>
  )
}
