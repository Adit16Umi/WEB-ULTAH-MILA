import { useMemo } from 'react'
import Emoji3D from './Emoji3D'

const NAMES = [
  'balloon', 'cherryBlossom', 'tulip', 'butterfly', 'sparkle', 'sparkles',
  'confetti', 'blossom', 'hibiscus', 'gift', 'ribbon', 'cupcake',
]

export default function FloatingBackground({ count = 16 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 14,
        duration: 14 + Math.random() * 12,
        size: 22 + Math.random() * 26,
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
      })),
    [count],
  )

  return (
    <div className="float-layer" aria-hidden="true">
      {items.map((it) => (
        <span
          key={it.id}
          className="float-item"
          style={{
            left: `${it.left}%`,
            animationDelay: `${it.delay}s`,
            animationDuration: `${it.duration}s`,
          }}
        >
          <Emoji3D name={it.name} size={it.size} />
        </span>
      ))}
    </div>
  )
}
