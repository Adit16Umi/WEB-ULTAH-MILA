import config from '../config'

const LINKS = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#hitung', label: 'Hitung Hari' },
  { href: '#galeri', label: 'Galeri' },
  { href: '#kejutan', label: 'Kejutan' },
  { href: '#ucapan', label: 'Ucapan' },
]

export default function Nav() {
  return (
    <nav className="nav">
      <a href="#beranda" className="brand" style={{ textDecoration: 'none' }}>
        {config.name} 💕
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
