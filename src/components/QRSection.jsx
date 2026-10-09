import QRCode from 'react-qr-code'
import config from '../config'
import Reveal from './Reveal'

function getSurpriseUrl() {
  if (typeof window === 'undefined') return 'https://example.com'
  const { origin, pathname } = window.location
  return `${origin}${pathname}#surprise`
}

const BARS = [12, 6, 3, 8, 4, 10, 3, 6, 14, 5, 3, 9, 4, 12, 6, 3, 8, 10, 4, 6, 3, 12, 5, 8, 3, 6, 9, 4]

export default function QRSection() {
  const url = getSurpriseUrl()

  return (
    <section id="kejutan">
      <div className="container">
        <Reveal className="section-title">
          <h2>Scan Barcode untuk Kejutan 🎁</h2>
          <p>Pindai QR code di bawah ini dengan kamera ponselmu.</p>
        </Reveal>

        <Reveal delay={120}>
          <div className="qr-wrap glass">
            <div className="qr-box">
              <div className="qr-frame">
                <QRCode value={url} size={190} bgColor="#ffffff" fgColor="#ff3d77" level="M" />
              </div>
              <p className="qr-hint">Arahkan kamera ke kode di atas 📱</p>
            </div>

            <div className="qr-copy">
              <h3>{config.secretTitle}</h3>
              <p>
                Simpan link website ini, lalu scan QR code untuk membuka pesan rahasia
                khusus untuk {config.name}. Setiap orang yang memindai akan melihat kejutan
                yang manis. 🥳
              </p>
              <div className="barcode" aria-hidden="true">
                {BARS.map((w, i) => (
                  <span key={i} style={{ height: `${30 + (w % 5) * 6}px`, width: `${w > 9 ? 5 : 3}px` }} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
