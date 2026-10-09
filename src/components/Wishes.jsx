import config from '../config'
import Reveal from './Reveal'

export default function Wishes() {
  return (
    <section id="ucapan">
      <div className="container">
        <Reveal className="section-title">
          <h2>Doa & Harapan 💝</h2>
          <p>Beberapa doa terbaik yang kupanjatkan untukmu.</p>
        </Reveal>

        <div className="wishes">
          {config.wishes.map((w, i) => (
            <Reveal key={i} delay={i * 100}>
              <article className="wish-card glass">
                <span className="emoji">{w.icon}</span>
                <h4>{w.title}</h4>
                <p>{w.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
