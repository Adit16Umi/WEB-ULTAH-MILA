import { AnimatePresence, motion } from 'framer-motion'

export default function PhotoLightbox({ items, index, onClose, onPrev, onNext }) {
  const open = index !== null && index >= 0
  const item = open ? items[index] : null

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button className="lb-close" onClick={onClose} aria-label="Tutup">
            ×
          </button>
          <button
            className="lb-arrow left"
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            aria-label="Foto sebelumnya"
          >
            ‹
          </button>

          <motion.figure
            className="lb-figure"
            key={index}
            initial={{ scale: 0.86, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={item.src} alt={item.caption} />
            <figcaption>{item.caption}</figcaption>
            {item.message && <p className="lb-message">{item.message}</p>}
          </motion.figure>

          <button
            className="lb-arrow right"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Foto berikutnya"
          >
            ›
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
