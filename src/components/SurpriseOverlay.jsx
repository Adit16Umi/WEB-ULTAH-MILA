import { AnimatePresence, motion } from 'framer-motion'
import config from '../config'
import Emoji3D from './Emoji3D'

export default function SurpriseOverlay({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="surprise"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="surprise-card"
            initial={{ scale: 0.6, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="big">
              <Emoji3D name="party" size={64} />
            </div>
            <h3>{config.secretTitle}</h3>
            <p>{config.secretMessage}</p>
            <button className="btn" onClick={onClose}>
              Tutup 💕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
