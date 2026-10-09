import { useState } from 'react'

const CDN =
  'https://cdn.jsdelivr.net/gh/Tarikul-Islam-Anik/Microsoft-Teams-Animated-Emojis@master/Emojis'

const MAP = {
  balloon: ['Activities', 'Balloon'],
  party: ['Activities', 'Party Popper'],
  confetti: ['Activities', 'Confetti Ball'],
  fireworks: ['Activities', 'Fireworks'],
  sparkler: ['Activities', 'Sparkler'],
  gift: ['Activities', 'Wrapped Gift'],
  ribbon: ['Activities', 'Ribbon'],
  sparkles: ['Activities', 'Sparkles'],
  sparkle: ['Symbols', 'Sparkle'],
  heart: ['Smilies', 'Sparkling Heart'],
  sparklingHeart: ['Smilies', 'Sparkling Heart'],
  beatingHeart: ['Smilies', 'Beating Heart'],
  cherryBlossom: ['Animals', 'Cherry Blossom'],
  blossom: ['Animals', 'Blossom'],
  tulip: ['Animals', 'Tulip'],
  bouquet: ['Animals', 'Bouquet'],
  butterfly: ['Animals', 'Butterfly'],
  rose: ['Animals', 'Rose'],
  sunflower: ['Animals', 'Sunflower'],
  hibiscus: ['Animals', 'Hibiscus'],
  cake: ['Food', 'Birthday Cake'],
  cupcake: ['Food', 'Cupcake'],
  shortcake: ['Food', 'Shortcake'],
  camera: ['Objects', 'Camera'],
  speakerHigh: ['Objects', 'Speaker High Volume'],
  speakerMuted: ['Objects', 'Muted Speaker'],
}

const FALLBACK = {
  balloon: '🎈',
  party: '🎉',
  confetti: '🎊',
  fireworks: '🎆',
  sparkler: '🎇',
  gift: '🎁',
  ribbon: '🎀',
  sparkles: '✨',
  sparkle: '✨',
  heart: '💖',
  sparklingHeart: '💖',
  beatingHeart: '💗',
  cherryBlossom: '🌸',
  blossom: '🌼',
  tulip: '🌷',
  bouquet: '💐',
  butterfly: '🦋',
  rose: '🌹',
  sunflower: '🌻',
  hibiscus: '🌺',
  cake: '🎂',
  cupcake: '🧁',
  shortcake: '🍰',
  camera: '📸',
  speakerHigh: '🔊',
  speakerMuted: '🔇',
}

export default function Emoji3D({ name, size = 40, className = '', style, alt }) {
  const [failed, setFailed] = useState(false)
  const entry = MAP[name]

  if (!entry || failed) {
    return (
      <span
        className={`emoji-3d emoji-fallback ${className}`}
        style={{ fontSize: size, lineHeight: 1, ...style }}
        role="img"
        aria-label={alt || name}
      >
        {FALLBACK[name] || '✨'}
      </span>
    )
  }

  const [category, file] = entry
  const src = `${CDN}/${category}/${encodeURIComponent(file)}.png`

  return (
    <img
      className={`emoji-3d ${className}`}
      src={src}
      alt={alt || name}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      style={{ width: size, height: size, objectFit: 'contain', ...style }}
    />
  )
}
