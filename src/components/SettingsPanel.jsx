import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import QRCode from 'qrcode'

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export default function SettingsPanel({ open, onClose, birthDate, isOwner, onSave, onReset, onPreview, onLock, onExitOwner }) {
  const [form, setForm] = useState(birthDate)
  const [copied, setCopied] = useState(false)
  const [qrWaiting, setQrWaiting] = useState('')
  const [qrCelebration, setQrCelebration] = useState('')

  useEffect(() => {
    if (open) setForm(birthDate)
  }, [open, birthDate])

  useEffect(() => {
    if (!open || !isOwner) return
    let alive = true
    setQrWaiting('')
    setQrCelebration('')
    const shared = { errorCorrectionLevel: 'H', margin: 1, width: 260 }
    QRCode.toDataURL(
      `${window.location.origin}${window.location.pathname}?d=${form.day}&m=${form.month}&y=${form.year}#waiting`,
      { ...shared, color: { dark: '#6d28d9', light: '#ffffff' } },
    ).then((url) => alive && setQrWaiting(url))
    QRCode.toDataURL(
      `${window.location.origin}${window.location.pathname}#celebration`,
      { ...shared, color: { dark: '#d6006e', light: '#ffffff' } },
    ).then((url) => alive && setQrCelebration(url))
    return () => {
      alive = false
    }
  }, [open, isOwner, form])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const save = () => {
    onSave(form)
    onClose()
  }

  const waitingLink = `${window.location.origin}${window.location.pathname}?d=${form.day}&m=${form.month}&y=${form.year}#waiting`

  const copyWaitingLink = async () => {
    try {
      await navigator.clipboard.writeText(waitingLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // fallback kalau clipboard tidak tersedia
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="settings-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="settings-panel glass"
            initial={{ y: 40, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Pengaturan Tanggal Lahir</h3>
            <p className="settings-hint">
              {isOwner
                ? 'Mode owner aktif — hanya kamu yang bisa mengubah ini. Countdown & waktu kejutan mengikuti tanggal ini (khusus device ini).'
                : 'Hanya untuk pembuat. Countdown & waktu kejutan mengikuti tanggal ini.'}
            </p>

            <div className="settings-fields">
              <label>
                Tanggal
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="31"
                  value={form.day}
                  onChange={(e) => set('day', e.target.value)}
                />
              </label>
              <label>
                Bulan
                <select value={form.month} onChange={(e) => set('month', e.target.value)}>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tahun
                <input
                  type="number"
                  inputMode="numeric"
                  min="1900"
                  max="2100"
                  value={form.year}
                  onChange={(e) => set('year', e.target.value)}
                />
              </label>
            </div>

            <div className="settings-actions">
              <button className="btn" onClick={save}>
                Simpan
              </button>
              <button className="btn ghost" onClick={onPreview}>
                Buka Sekarang
              </button>
            </div>

            <div className="settings-actions minor">
              <button className="link-btn" onClick={onReset}>
                Reset ke tanggal default
              </button>
              <button className="link-btn" onClick={onLock}>
                Kunci lagi (kembali menunggu)
              </button>
              {isOwner && (
                <button className="link-btn" onClick={onExitOwner}>
                  Keluar mode owner
                </button>
              )}
            </div>

            {isOwner && (
              <div className="qrbuilder">
                <p className="qrsnippet-hint">
                  Barcode ini otomatis mengikuti tanggal di atas. Simpan PNG lalu bagikan:
                </p>
                <div className="qrcards">
                  <div className="qrcard">
                    <span className="qrcard-title">QR TUNGGU</span>
                    <span className="qrcard-sub">
                      countdown ke tgl {form.day}-{form.month}
                    </span>
                    <div className="qrcard-img">
                      {qrWaiting ? <img src={qrWaiting} alt="QR tunggu" /> : <span className="qrcard-fallback">Memuat…</span>}
                    </div>
                    {qrWaiting && (
                      <a className="btn ghost" href={qrWaiting} download={`qr-tunggu-${form.day}-${form.month}.png`}>
                        ⬇ Simpan PNG
                      </a>
                    )}
                  </div>

                  <div className="qrcard">
                    <span className="qrcard-title">QR PERAYAAN</span>
                    <span className="qrcard-sub">langsung buka perayaan</span>
                    <div className="qrcard-img">
                      {qrCelebration ? <img src={qrCelebration} alt="QR perayaan" /> : <span className="qrcard-fallback">Memuat…</span>}
                    </div>
                    {qrCelebration && (
                      <a className="btn ghost" href={qrCelebration} download="qr-perayaan.png">
                        ⬇ Simpan PNG
                      </a>
                    )}
                  </div>
                </div>

                <p className="qrsnippet-hint">atau salin link QR tunggu:</p>
                <div className="qrsnippet-row">
                  <input readOnly value={waitingLink} onFocus={(e) => e.target.select()} aria-label="Link QR tunggu" />
                  <button className="btn ghost" onClick={copyWaitingLink}>
                    {copied ? '✓ Tersalin' : '📋 Salin'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}