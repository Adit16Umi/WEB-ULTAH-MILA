import { useState } from 'react'
import { motion } from 'framer-motion'
import config from '../config'

const sprinkles = {
  tier1: [
    { left: '16%', top: '56%', c: '#59b8ff', r: '24deg' },
    { left: '46%', top: '68%', c: '#3fe0bd', r: '-30deg' },
    { left: '74%', top: '52%', c: '#a259ff', r: '12deg' },
  ],
  tier2: [
    { left: '10%', top: '60%', c: '#ffcf3f', r: '-18deg' },
    { left: '34%', top: '48%', c: '#ff2d7e', r: '28deg' },
    { left: '58%', top: '66%', c: '#59b8ff', r: '-10deg' },
    { left: '82%', top: '54%', c: '#3fe0bd', r: '20deg' },
  ],
  tier3: [
    { left: '12%', top: '58%', c: '#ffe14d', r: '30deg' },
    { left: '34%', top: '68%', c: '#a259ff', r: '-24deg' },
    { left: '56%', top: '56%', c: '#3fe0bd', r: '16deg' },
    { left: '78%', top: '64%', c: '#ff9b6b', r: '-32deg' },
  ],
}

function Sprinkles({ items }) {
  return items.map((s, i) => (
    <span
      key={i}
      className="sprinkle"
      style={{ left: s.left, top: s.top, background: s.c, transform: `rotate(${s.r})` }}
    />
  ))
}

export default function BirthdayCake({ onCelebrate, age = config.age }) {
  const [blown, setBlown] = useState(false)
  const candleCount = Math.max(1, Math.min(age, 9))

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
            <div className="cake-glow" aria-hidden="true" />

            <div className="candles">
              {Array.from({ length: candleCount }).map((_, i) => (
                <div className="candle" key={i}>
                  <span className="candle-glow" style={{ animationDelay: `${(i % 3) * 0.22}s` }} />
                  <span className="flame" style={{ animationDelay: `${(i % 3) * 0.22}s` }} />
                  {blown && <span className="smoke" style={{ animationDelay: `${(i % 3) * 0.18}s` }} />}
                </div>
              ))}
            </div>

            <div className="cherries" aria-hidden="true">
              <span className="berry" />
              <span className="berry" />
              <span className="berry" />
            </div>

            <div className="tier tier1">
              <span className="frosting" />
              <Sprinkles items={sprinkles.tier1} />
            </div>
            <div className="tier tier2">
              <span className="frosting" />
              <Sprinkles items={sprinkles.tier2} />
            </div>
            <div className="tier tier3">
              <span className="frosting" />
              <Sprinkles items={sprinkles.tier3} />
            </div>

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
