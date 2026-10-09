import { useEffect, useRef, useState } from 'react'
import config from '../config'
import Emoji3D from './Emoji3D'

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!config.musicUrl) return
    const audio = new Audio(config.musicUrl)
    audio.loop = true
    audio.volume = 0.75
    audioRef.current = audio

    const tryPlay = () =>
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))

    tryPlay()

    const onFirstGesture = () => {
      tryPlay()
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('keydown', onFirstGesture)
    }
    window.addEventListener('pointerdown', onFirstGesture)
    window.addEventListener('keydown', onFirstGesture)

    return () => {
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('keydown', onFirstGesture)
      audio.pause()
    }
  }, [])

  if (!config.musicUrl) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <button
      className={`music-btn ${playing ? 'is-playing' : ''}`}
      onClick={toggle}
      aria-label={playing ? 'Jeda musik' : 'Putar musik'}
      title={playing ? 'Jeda musik' : 'Putar musik'}
    >
      <Emoji3D name={playing ? 'speakerHigh' : 'speakerMuted'} size={26} className="music-emoji" />
    </button>
  )
}
