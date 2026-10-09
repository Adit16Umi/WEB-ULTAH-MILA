import { useMemo } from 'react'

const EMOJIS = ['🎈', '🌸', '💖', '✨', '🌷', '🎀', '🍰', '💐', '🦋', '⭐', '🌹', '🎉']

export default function FloatingBackground({ count = 20 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 14,
        duration: 13 + Math.random() * 13,
        size: 18 + Math.random() * 26,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
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
            fontSize: `${it.size}px`,
            animationDelay: `${it.delay}s`,
            animationDuration: `${it.duration}s`,
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  )
}
