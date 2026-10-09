import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import config from '../config'
import Emoji3D from './Emoji3D'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Hero({ age = config.age }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const yText = useTransform(scrollYProgress, [0, 1], [0, 60])
  const yPhoto = useTransform(scrollYProgress, [0, 1], [0, -70])

  return (
    <section id="beranda" ref={ref}>
      <div className="container hero">
        <motion.div
          className="hero-copy"
          variants={container}
          initial="hidden"
          animate="show"
          style={{ y: yText }}
        >
          <motion.span className="hbd" variants={item}>
            Selamat Ulang Tahun
          </motion.span>
          <motion.span className="name" variants={item}>
            {config.name}
          </motion.span>
          <motion.p className="tag" variants={item}>
            {config.greeting} {config.subGreeting}
          </motion.p>
          <motion.div className="hero-actions" variants={item}>
            <motion.a
              className="btn ghost"
              href="#galeri"
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              Lihat Momen
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="photo-wrap"
          style={{ y: yPhoto }}
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 70, damping: 15, delay: 0.2 }}
        >
          <motion.span
            className="orbit o1"
            animate={{ y: [0, -16, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Emoji3D name="balloon" size={46} />
          </motion.span>
          <motion.span
            className="orbit o2"
            animate={{ y: [0, 14, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Emoji3D name="cherryBlossom" size={42} />
          </motion.span>
          <motion.span
            className="orbit o3"
            animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Emoji3D name="bouquet" size={44} />
          </motion.span>
          <motion.span
            className="orbit o4"
            animate={{ y: [0, 12, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Emoji3D name="sparkles" size={40} />
          </motion.span>

          <div className="photo-ring">
            <img src={config.photo} alt={`Foto ${config.name}`} />
          </div>
          <div className="photo-badge">
            ke-{age} <Emoji3D name="party" size={22} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
