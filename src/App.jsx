import { useCallback, useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import Gallery from './components/Gallery'
import QRSection from './components/QRSection'
import Wishes from './components/Wishes'
import Footer from './components/Footer'
import FloatingBackground from './components/FloatingBackground'
import SurpriseOverlay from './components/SurpriseOverlay'
import MusicToggle from './components/MusicToggle'

function fireConfetti() {
  const duration = 3200
  const end = Date.now() + duration
  const colors = ['#ff3d77', '#ff6fa5', '#a855f7', '#ffd166', '#7dd3fc']

  ;(function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors,
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors,
    })
    confetti({
      particleCount: 3,
      spread: 90,
      origin: { x: 0.5, y: 0.1 },
      colors,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()

  confetti({
    particleCount: 160,
    spread: 100,
    origin: { y: 0.6 },
    colors,
  })
}

export default function App() {
  const [surpriseOpen, setSurpriseOpen] = useState(false)

  const celebrate = useCallback(() => fireConfetti(), [])

  useEffect(() => {
    if (window.location.hash === '#surprise') {
      setSurpriseOpen(true)
      fireConfetti()
    }

    const onHash = () => {
      if (window.location.hash === '#surprise') {
        setSurpriseOpen(true)
        fireConfetti()
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <div className="app">
      <div className="bg" />
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      <FloatingBackground count={22} />

      <Nav />
      <main>
        <Hero onCelebrate={celebrate} />
        <Countdown />
        <Gallery />
        <QRSection />
        <Wishes />
      </main>
      <Footer />

      <MusicToggle />
      <SurpriseOverlay open={surpriseOpen} onClose={() => setSurpriseOpen(false)} />
    </div>
  )
}
