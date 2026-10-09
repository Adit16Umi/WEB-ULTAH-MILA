import { useState } from 'react'
import { motion } from 'framer-motion'
import config from '../config'
import Reveal from './Reveal'
import Emoji3D from './Emoji3D'
import PhotoLightbox from './PhotoLightbox'

const photos = config.gallery

export default function Gallery() {
  const [index, setIndex] = useState(null)

  const close = () => setIndex(null)
  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length)
  const next = () => setIndex((i) => (i + 1) % photos.length)

  return (
    <section id="galeri">
      <div className="container">
        <Reveal className="section-title">
          <h2>
            Galeri & Ucapan {config.name} <Emoji3D name="camera" size={34} className="title-emoji" />
          </h2>
          <p>Klik foto untuk melihat kenangan dan kata-kata untuknya.</p>
        </Reveal>

        <div className="gallery">
          {photos.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <motion.figure
                className="gallery-item"
                onClick={() => setIndex(i)}
                whileHover={{ y: -10, rotate: -1.5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <img src={p.src} alt={p.caption} loading="lazy" />
                <figcaption className="cap">{p.caption}</figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </div>
      </div>

      <PhotoLightbox items={photos} index={index} onClose={close} onPrev={prev} onNext={next} />
    </section>
  )
}
