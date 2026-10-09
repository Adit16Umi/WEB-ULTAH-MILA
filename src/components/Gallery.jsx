import config from '../config'
import Reveal from './Reveal'

export default function Gallery() {
  return (
    <section id="galeri">
      <div className="container">
        <Reveal className="section-title">
          <h2>Galeri & Bunga 🌸</h2>
          <p>Kumpulan momen indah dan bunga-bunga untukmu.</p>
        </Reveal>

        <div className="gallery">
          {config.gallery.map((item, i) => (
            <Reveal key={i} delay={i * 100}>
              <figure className="gallery-item">
                <img src={item.src} alt={item.caption} loading="lazy" />
                <figcaption className="cap">{item.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
