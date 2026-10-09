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
import OpeningIntro from './components/OpeningIntro'
import { useBirthDate, getAge } from './hooks/useBirthDate'
import { useCountdown } from './hooks/useCountdown'
import { useLowPower } from './hooks/useLowPower'
import config from './config'

const UNLOCK_KEY = 'birthday-unlocked'
const OWNER_KEY = 'birthday-owner'
const INTRO_KEY = 'birthday-intro-seen'

function readForcedView() {
  const hash = window.location.hash
  if (hash === '#celebration') return 'celebration'
  if (hash === '#waiting') return 'waiting'
  return null
}

function readUrlDate() {
  const params = new URLSearchParams(window.location.search)
  const d = Number(params.get('d'))
  const m = Number(params.get('m'))
  let y = Number(params.get('y'))
  if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
    if (!(y >= 1900 && y <= 2100)) y = config.birthYear
    return { day: d, month: m, year: y }
  }
  return null
}

function isOwnerStored() {
  return window.localStorage.getItem(OWNER_KEY) === 'true'
}

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

const simplePageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function App() {
  const { birthDate, update, reset } = useBirthDate()
  const [urlDate, setUrlDate] = useState(readUrlDate)
  const effectiveBirthDate = urlDate || birthDate
  const { isToday } = useCountdown(effectiveBirthDate.month, effectiveBirthDate.day)
  const age = getAge(effectiveBirthDate) || config.age
  const lowPower = useLowPower()
  const variants = lowPower ? simplePageVariants : pageVariants

  const [forcedView, setForcedView] = useState(readForcedView)
  const [isOwner, setIsOwner] = useState(isOwnerStored)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [surpriseOpen, setSurpriseOpen] = useState(false)
  const [introOpen, setIntroOpen] = useState(false)
  const [phase, setPhase] = useState(() => {
    const forced = readForcedView()
    if (forced) return forced
    const unlocked = window.localStorage.getItem(UNLOCK_KEY) === 'true'
    return unlocked || isToday ? 'celebration' : 'waiting'
  })
  const prevPhase = useRef(null)

  const unlock = useCallback(() => {
    window.localStorage.setItem(UNLOCK_KEY, 'true')
    setForcedView('celebration')
    setPhase('celebration')
  }, [])

  const lock = useCallback(() => {
    window.localStorage.removeItem(UNLOCK_KEY)
    setForcedView('waiting')
    setPhase('waiting')
    window.scrollTo({ top: 0 })
  }, [])

  const applySettings = useCallback(
    (next) => {
      update(next)
      const now = new Date()
      const isTodayNow =
        Number(next.month) === now.getMonth() + 1 && Number(next.day) === now.getDate()
      window.localStorage.removeItem(UNLOCK_KEY)
      setUrlDate(null)
      setForcedView(null)
      setPhase(isTodayNow ? 'celebration' : 'waiting')
      window.scrollTo({ top: 0 })
    },
    [update],
  )

  const exitOwner = useCallback(() => {
    window.localStorage.removeItem(OWNER_KEY)
    setIsOwner(false)
    setSettingsOpen(false)
  }, [])

  const finishIntro = useCallback(() => {
    window.sessionStorage.setItem(INTRO_KEY, 'true')
    setIntroOpen(false)
    setSurpriseOpen(true)
  }, [])

  useEffect(() => {
    if (forcedView === 'waiting') return
    if (phase === 'waiting' && isToday) unlock()
  }, [phase, isToday, forcedView, unlock])

  useEffect(() => {
    if (phase !== 'celebration') {
      prevPhase.current = phase
      return
    }
    const cameFromOther = prevPhase.current !== 'celebration'
    prevPhase.current = phase
    if (!cameFromOther) return
    const seen = window.sessionStorage.getItem(INTRO_KEY) === 'true'
    if (!seen) {
      setIntroOpen(true)
    } else {
      fireConfetti()
      setSurpriseOpen(true)
    }
  }, [phase])

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash
      if (hash === '#owner') {
        window.localStorage.setItem(OWNER_KEY, 'true')
        setIsOwner(true)
        setSettingsOpen(true)
      } else if (hash === '#pengaturan') {
        if (isOwnerStored()) setSettingsOpen(true)
      } else if (hash === '#celebration') {
        setForcedView('celebration')
        setPhase('celebration')
      } else if (hash === '#waiting') {
        window.localStorage.removeItem(UNLOCK_KEY)
        setForcedView('waiting')
        setPhase('waiting')
        window.scrollTo({ top: 0 })
      }
    }
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

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
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <WaitingRoom
              birthDate={effectiveBirthDate}
              age={age}
              isOwner={isOwner}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="celebration"
            variants={variants}
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
            {isOwner && (
              <button
                className="settings-gear"
                onClick={() => setSettingsOpen(true)}
                aria-label="Pengaturan tanggal"
                title="Pengaturan tanggal lahir"
              >
                ⚙
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <MusicToggle />
      <OpeningIntro open={introOpen} onFinish={finishIntro} lowPower={lowPower} />
      <SurpriseOverlay open={surpriseOpen} onClose={() => setSurpriseOpen(false)} />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        birthDate={birthDate}
        isOwner={isOwner}
        onSave={applySettings}
        onReset={reset}
        onExitOwner={exitOwner}
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
