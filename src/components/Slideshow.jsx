import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import config from '../config'
import Reveal from './Reveal'
import Emoji3D from './Emoji3D'

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 1.06 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0, scale: 0.96 }),
}

export default function Slideshow() {
  const slides = config.slides
  const [[index, dir], setState] = useState([0, 0])
  const [paused, setPaused] = useState(false)

  const paginate = useCallback(
    (d) => setState(([i]) => [(i + d + slides.length) % slides.length, d]),
    [slides.length],
  )

  const goTo = (i) => setState(([current]) => [i, i > current ? 1 : -1])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => paginate(1), 4800)
    return () => clearInterval(id)
  }, [paused, paginate])

  const active = slides[index]

  return (
    <section id="slide">
      <div className="container">
        <Reveal className="section-title">
          <h2>
            Slideshow Momen <Emoji3D name="camera" size={32} className="title-emoji" />
          </h2>
          <p>Geser atau biarkan berganti sendiri untuk menyusuri kenangan indah.</p>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="slider"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={index}
                className="slide"
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 110, damping: 20, mass: 0.9 },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <img className="slide-bg" src={active.src} alt="" aria-hidden="true" />
                <img className="slide-img" src={active.src} alt={active.title} />
                <div className="slide-overlay" />
                <div className="slide-text">
                  <motion.h3
                    initial={{ y: 26, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {active.title}
                  </motion.h3>
                  <motion.p
                    initial={{ y: 26, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.32, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {active.subtitle}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>

            <button className="slider-arrow left" onClick={() => paginate(-1)} aria-label="Slide sebelumnya">
              ‹
            </button>
            <button className="slider-arrow right" onClick={() => paginate(1)} aria-label="Slide berikutnya">
              ›
            </button>

            <div className="slider-dots">
              {slides.map((s, i) => (
                <button
                  key={s.title + i}
                  className={`dot ${i === index ? 'active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Ke slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
