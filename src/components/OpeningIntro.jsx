import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import config from '../config'

const COLORS = ['#ff3d77', '#ff6fa5', '#a855f7', '#ffd166', '#7dd3fc']

function burst() {
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.55 }, colors: COLORS })
  confetti({ particleCount: 70, angle: 60, spread: 70, origin: { x: 0, y: 0.65 }, colors: COLORS })
  confetti({ particleCount: 70, angle: 120, spread: 70, origin: { x: 1, y: 0.65 }, colors: COLORS })
}

export default function OpeningIntro({ open, onFinish, lowPower = false }) {
  const [popped, setPopped] = useState(false)

  useEffect(() => {
    if (!open) return
    setPopped(false)

    if (lowPower) {
      const t = setTimeout(() => {
        setPopped(true)
        burst()
        onFinish()
      }, 1100)
      return () => clearTimeout(t)
    }

    const t1 = setTimeout(() => {
      setPopped(true)
      burst()
    }, 1150)
    const t2 = setTimeout(onFinish, 4200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [open, lowPower, onFinish])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="intro"
          role="dialog"
          aria-label="Pembuka perayaan"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.12 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="intro-rays"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={popped ? { opacity: 0.9, scale: 1.4 } : { opacity: 0, scale: 0.2 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />

          <motion.div
            className="intro-gift"
            initial={{ scale: 0.55, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: popped ? 0 : [0, -3, 3, -2, 2, 0],
            }}
            transition={{
              scale: { type: 'spring', stiffness: 130, damping: 12 },
              rotate: { duration: 1.1, repeat: popped ? 0 : Infinity, ease: 'easeInOut' },
            }}
          >
            <motion.div
              className="intro-box"
              animate={popped ? { y: 90, scaleY: 0.4, opacity: 0 } : { y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="intro-ribbon v" />
              <span className="intro-ribbon h" />
            </motion.div>
            <motion.div
              className="intro-lid"
              animate={popped ? { y: -280, rotate: -22, opacity: 0 } : { y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="intro-bow">🎀</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="intro-text"
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={popped ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.8 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 130, damping: 14 }}
          >
            <span className="intro-hbd">Selamat Ulang Tahun</span>
            <span className="intro-name">{config.name}</span>
            <span className="intro-emoji">🎂</span>
          </motion.div>

          <button className="intro-skip" onClick={onFinish}>
            Lewati ⏭
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
