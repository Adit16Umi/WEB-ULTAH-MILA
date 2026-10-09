import config from '../config'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="script">Happy Birthday, {config.name}!</p>
        <p>
          Dibuat dengan <span className="heart">❤</span> untuk orang istimewa.
        </p>
        <div className="socials">
          {config.socials.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
