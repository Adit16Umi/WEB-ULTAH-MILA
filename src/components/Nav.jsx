import config from '../config'
import Emoji3D from './Emoji3D'

const LINKS = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#slide', label: 'Slideshow' },
  { href: '#galeri', label: 'Galeri & Ucapan' },
  { href: '#kue', label: 'Kue' },
]

export default function Nav() {
  return (
    <nav className="nav">
      <a href="#beranda" className="brand" style={{ textDecoration: 'none' }}>
        {config.name} <Emoji3D name="cherryBlossom" size={26} className="brand-emoji" />
      </a>
      <div className="nav-links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
