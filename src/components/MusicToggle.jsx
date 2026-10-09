import { useEffect, useRef, useState } from 'react'
import config from '../config'
import Emoji3D from './Emoji3D'

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (config.musicUrl) {
      audioRef.current = new Audio(config.musicUrl)
      audioRef.current.loop = true
    }
  }, [])

  if (!config.musicUrl) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  return (
    <button className="music-btn" onClick={toggle} aria-label="Putar musik">
      <Emoji3D name={playing ? 'speakerHigh' : 'speakerMuted'} size={26} className="music-emoji" />
    </button>
  )
}
