import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export default function SettingsPanel({ open, onClose, birthDate, onSave, onReset, onPreview, onLock }) {
  const [form, setForm] = useState(birthDate)

  useEffect(() => {
    if (open) setForm(birthDate)
  }, [open, birthDate])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const save = () => {
    onSave(form)
    onClose()
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
              Hanya untuk pembuat. Countdown & waktu kejutan mengikuti tanggal ini.
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
