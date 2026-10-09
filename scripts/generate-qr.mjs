import QRCode from 'qrcode'
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const url =
  process.argv.slice(2).join(' ') ||
  process.env.SITE_URL ||
  'https://ultah-mila.vercel.app/#celebration'

const outDir = resolve(root, 'qr')
const base = 'ultah-mila'

const W = 1200
const H = 1200
const QUIET = 4
const HEART = '#ff2d87'
const HEART_LIGHT = '#ff8fc0'
const MODULE = '#c2006a'
const CARD = '#ffffff'

const fmt = (n) => Math.round(n * 100) / 100

/* ---------- 1. QR matrix ---------- */
const qr = QRCode.create(url, { errorCorrectionLevel: 'H' })
const N = qr.modules.size
const isDark = (r, c) => qr.modules.get(r, c) === 1

/* ---------- 2. Heart geometry (parametric, flipped to screen coords) ---------- */
function heartPoints(steps = 2400) {
  const raw = []
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const x = 16 * Math.sin(t) ** 3
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    raw.push([x, y])
  }
  const xs = raw.map((p) => p[0])
  const ys = raw.map((p) => p[1])
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const targetW = W * 0.94
  const targetH = H * 0.9
  const scale = Math.min(targetW / (maxX - minX), targetH / (maxY - minY))
  const midX = (minX + maxX) / 2
  const midY = (minY + maxY) / 2
  const cx = W / 2
  const cy = H / 2
  return raw.map(([x, y]) => [cx + (x - midX) * scale, cy - (y - midY) * scale])
}

const heart = heartPoints()

let hMinX = Infinity, hMaxX = -Infinity, hMinY = Infinity, hMaxY = -Infinity
for (const [x, y] of heart) {
  hMinX = Math.min(hMinX, x); hMaxX = Math.max(hMaxX, x)
  hMinY = Math.min(hMinY, y); hMaxY = Math.max(hMaxY, y)
}

/* ---------- 3. Rasterize top/bottom boundary per column ---------- */
const topY = new Array(W).fill(Infinity)
const bottomY = new Array(W).fill(-Infinity)
for (let x = 0; x < W; x++) {
  let mn = Infinity
  let mx = -Infinity
  for (let i = 0; i < heart.length; i++) {
    const [x1, y1] = heart[i]
    const [x2, y2] = heart[(i + 1) % heart.length]
    if (x1 === x2) continue
    const lo = Math.min(x1, x2)
    const hi = Math.max(x1, x2)
    if (x < lo || x > hi) continue
    const t = (x - x1) / (x2 - x1)
    const y = y1 + t * (y2 - y1)
    if (y < mn) mn = y
    if (y > mx) mx = y
  }
  if (mn !== Infinity) { topY[x] = mn; bottomY[x] = mx }
}

/* ---------- 4. Largest axis-aligned square inscribed in the heart ---------- */
function largestInscribedSquare() {
  const cx = W / 2
  let best = 0
  let bestTop = 0
  for (let S = 160; S <= W; S += 2) {
    const x1 = Math.round(cx - S / 2)
    const x2 = Math.round(cx + S / 2)
    if (x1 < 0 || x2 >= W) break
    let maxTop = -Infinity
    let minBot = Infinity
    let ok = true
    for (let x = x1; x <= x2; x++) {
      const t = topY[x]
      const b = bottomY[x]
      if (!isFinite(t) || !isFinite(b)) { ok = false; break }
      if (t > maxTop) maxTop = t
      if (b < minBot) minBot = b
    }
    if (ok && minBot - maxTop >= S) {
      best = S
      bestTop = maxTop + (minBot - maxTop - S) / 2
    }
  }
  return { size: best, top: bestTop }
}

const sq = largestInscribedSquare()
const cardSide = sq.size * 0.9
const cardX = W / 2 - cardSide / 2
const cardY = sq.top + sq.size / 2 - cardSide / 2

/* ---------- 5. QR module layout inside the card ---------- */
const pad = cardSide * 0.055
const inner = cardSide - pad * 2
const ms = inner / (N + QUIET * 2)
const qx = W / 2 - (N * ms) / 2
const qy = cardY + cardSide / 2 - (N * ms) / 2

const finder = (r, c) =>
  (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7)

/* ---------- 6. Helpers ---------- */
function roundedModule(r, c) {
  const x = qx + c * ms
  const y = qy + r * ms
  const m = ms * 0.9
  const off = (ms - m) / 2
  const rx = ms * 0.22
  return `<rect x="${fmt(x + off)}" y="${fmt(y + off)}" width="${fmt(m)}" height="${fmt(m)}" rx="${fmt(rx)}" fill="${MODULE}"/>`
}

function finderShape(r0, c0) {
  const x = qx + c0 * ms
  const y = qy + r0 * ms
  const outer = 7 * ms
  const rO = ms * 1.4
  const rI = ms * 1.0
  return (
    `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(outer)}" height="${fmt(outer)}" rx="${fmt(rO)}" fill="${MODULE}"/>` +
    `<rect x="${fmt(x + ms)}" y="${fmt(y + ms)}" width="${fmt(5 * ms)}" height="${fmt(5 * ms)}" rx="${fmt(rI)}" fill="${CARD}"/>` +
    `<rect x="${fmt(x + 2 * ms)}" y="${fmt(y + 2 * ms)}" width="${fmt(3 * ms)}" height="${fmt(3 * ms)}" rx="${fmt(ms * 0.6)}" fill="${MODULE}"/>`
  )
}

/* ---------- 7. Build SVG ---------- */
let modules = ''
const finderCells = [[0, 0], [0, N - 7], [N - 7, 0]]
for (let r = 0; r < N; r++) {
  for (let c = 0; c < N; c++) {
    if (!isDark(r, c)) continue
    if (finder(r, c)) continue
    modules += roundedModule(r, c)
  }
}
for (const [r0, c0] of finderCells) modules += finderShape(r0, c0)

/* center love logo */
const cardCx = W / 2
const cardCy = cardY + cardSide / 2
const logoS = ms * 5.2
const hx = cardCx
const hy = cardCy
const hw = logoS * 0.62
const hh = hw * 0.9
modules +=
  `<rect x="${fmt(cardCx - logoS * 0.62)}" y="${fmt(cardCy - logoS * 0.62)}" width="${fmt(logoS * 1.24)}" height="${fmt(logoS * 1.24)}" rx="${fmt(logoS * 0.32)}" fill="${CARD}"/>` +
  `<path d="M ${hx} ${hy + hh * 0.42} C ${hx - hw} ${hy - hh * 0.3} ${hx - hw * 0.35} ${hy - hh * 1.0} ${hx} ${hy - hh * 0.4} C ${hx + hw * 0.35} ${hy - hh * 1.0} ${hx + hw} ${hy - hh * 0.3} ${hx} ${hy + hh * 0.42} Z" fill="${MODULE}"/>`

const heartD = heart.map((p, i) => `${i === 0 ? 'M' : 'L'} ${fmt(p[0])} ${fmt(p[1])}`).join(' ') + ' Z'

const tipHeartY = hMaxY - 46
const deco = `
  <path d="M ${W / 2} ${tipHeartY + 20} C ${W / 2 - 34} ${tipHeartY - 6} ${W / 2 - 14} ${tipHeartY - 34} ${W / 2} ${tipHeartY - 16} C ${W / 2 + 14} ${tipHeartY - 34} ${W / 2 + 34} ${tipHeartY - 6} ${W / 2} ${tipHeartY + 20} Z" fill="rgba(255,255,255,0.9)"/>
  <circle cx="${fmt(hMinX + 70)}" cy="${fmt(hMinY + 150)}" r="6" fill="rgba(255,255,255,0.8)"/>
  <circle cx="${fmt(hMaxX - 70)}" cy="${fmt(hMinY + 150)}" r="6" fill="rgba(255,255,255,0.8)"/>
  <circle cx="${fmt(W / 2 - 60)}" cy="${fmt(hMaxY - 110)}" r="5" fill="rgba(255,255,255,0.75)"/>
  <circle cx="${fmt(W / 2 + 60)}" cy="${fmt(hMaxY - 110)}" r="5" fill="rgba(255,255,255,0.75)"/>`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff6fa"/>
      <stop offset="100%" stop-color="#ffe3ef"/>
    </linearGradient>
    <linearGradient id="heart" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${HEART_LIGHT}"/>
      <stop offset="55%" stop-color="${HEART}"/>
      <stop offset="100%" stop-color="#e0006f"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#ff2d87" flood-opacity="0.35"/>
    </filter>
    <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#c2185b" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <path d="${heartD}" fill="url(#heart)" filter="url(#soft)"/>
  <rect x="${fmt(cardX)}" y="${fmt(cardY)}" width="${fmt(cardSide)}" height="${fmt(cardSide)}" rx="${fmt(cardSide * 0.055)}" fill="${CARD}" filter="url(#cardShadow)"/>
  ${modules}
  ${deco}
</svg>
`

/* ---------- 8. Write files ---------- */
await mkdir(outDir, { recursive: true })
await writeFile(resolve(outDir, `${base}.svg`), svg, 'utf8')
await sharp(Buffer.from(svg), { density: 144 })
  .png()
  .toFile(resolve(outDir, `${base}.png`))

console.log(`QR code (pink, bentuk love) dibuat untuk: ${url}`)
console.log('File tersimpan (TIDAK ditampilkan di web):')
console.log(`  - ${resolve(outDir, `${base}.png`)}`)
console.log(`  - ${resolve(outDir, `${base}.svg`)}`)
console.log(`  - QR ${N}x${N} modul, card ${Math.round(cardSide)}px, square ${sq.size}px`)
