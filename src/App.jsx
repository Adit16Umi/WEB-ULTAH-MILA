import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Slideshow from './components/Slideshow'
import Gallery from './components/Gallery'
import Footer from './components/Footer'
import FloatingBackground from './components/FloatingBackground'
import SurpriseOverlay from './components/SurpriseOverlay'
import MusicToggle from './components/MusicToggle'
import ScrollProgress from './components/ScrollProgress'
import WaitingRoom from './components/WaitingRoom'
import BirthdayCake from './components/BirthdayCake'
import SettingsPanel from './components/SettingsPanel'
import { useBirthDate, getTurningAge } from './hooks/useBirthDate'
import { useCountdown } from './hooks/useCountdown'
import config from './config'

const UNLOCK_KEY = 'birthday-unlocked'

function fireConfetti() {
  const duration = 3200
  const end = Date.now() + duration
  const colors = ['#ff3d77', '#ff6fa5', '#a855f7', '#ffd166', '#7dd3fc']

  ;(function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors })
    confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors })
    confetti({ particleCount: 3, spread: 90, origin: { x: 0.5, y: 0.1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()

  confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors })
}

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, filter: 'blur(12px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.03, filter: 'blur(12px)' },
}

export default function App() {
  const { birthDate, update, reset } = useBirthDate()
  const { isToday } = useCountdown(birthDate.month, birthDate.day)
  const age = getTurningAge(birthDate) || config.age

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [surpriseOpen, setSurpriseOpen] = useState(false)
  const [phase, setPhase] = useState(() => {
    const unlocked = window.localStorage.getItem(UNLOCK_KEY) === 'true'
    const preview = window.location.hash === '#celebration'
    return unlocked || preview || isToday ? 'celebration' : 'waiting'
  })
  const prevPhase = useRef(phase)

  const unlock = useCallback(() => {
    window.localStorage.setItem(UNLOCK_KEY, 'true')
    setPhase('celebration')
  }, [])

  const lock = useCallback(() => {
    window.localStorage.removeItem(UNLOCK_KEY)
    setPhase('waiting')
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (phase === 'waiting' && isToday) unlock()
  }, [phase, isToday, unlock])

  useEffect(() => {
    if (prevPhase.current !== 'celebration' && phase === 'celebration') {
      fireConfetti()
      setSurpriseOpen(true)
    }
    prevPhase.current = phase
  }, [phase])

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#pengaturan') setSettingsOpen(true)
      if (window.location.hash === '#celebration') unlock()
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [unlock])

  const celebrate = useCallback(() => fireConfetti(), [])

  return (
    <div className="app">
      <div className="bg" />
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      <div className="blob b4" />
      <div className="blob b5" />
      <FloatingBackground count={phase === 'celebration' ? 16 : 12} />

      <AnimatePresence mode="wait">
        {phase === 'waiting' ? (
          <motion.div
            key="waiting"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <WaitingRoom birthDate={birthDate} age={age} onOpenSettings={() => setSettingsOpen(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="celebration"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ScrollProgress />
            <Nav />
            <main>
              <Hero onCelebrate={celebrate} age={age} />
              <Slideshow />
              <BirthdayCake onCelebrate={celebrate} age={age} />
              <Gallery />
            </main>
            <Footer />
            <button
              className="settings-gear"
              onClick={() => setSettingsOpen(true)}
              aria-label="Pengaturan tanggal"
              title="Pengaturan tanggal lahir"
            >
              ⚙
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <MusicToggle />
      <SurpriseOverlay open={surpriseOpen} onClose={() => setSurpriseOpen(false)} />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        birthDate={birthDate}
        onSave={update}
        onReset={reset}
        onPreview={() => {
          setSettingsOpen(false)
          unlock()
        }}
        onLock={() => {
          setSettingsOpen(false)
          lock()
        }}
      />
    </div>
  )
}
