import QRCode from 'qrcode'
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const BASE =
  process.env.QR_BASE_URL ||
  process.argv[2] ||
  'https://web-ultah-mila.vercel.app'

const TARGETS = [
  {
    label: 'ultah-mila-perayaan',
    url: `${BASE}/#celebration`,
    palette: {
      bgTop: '#ffe6f2',
      bgBottom: '#ffc4de',
      heartFill: '#fff6fb',
      heartStroke: '#ff2d87',
      module: '#d6006e',
      shadow: '#ff2d87',
    },
  },
  {
    label: 'ultah-mila-tunggu',
    url: `${BASE}/#waiting`,
    palette: {
      bgTop: '#efe6ff',
      bgBottom: '#d6c2ff',
      heartFill: '#f7f2ff',
      heartStroke: '#7c3aed',
      module: '#6d28d9',
      shadow: '#7c3aed',
    },
  },
]

const outDir = resolve(root, 'qr')

const W = 1200
const H = 1200
const QUIET = 4

const fmt = (n) => Math.round(n * 100) / 100

/* ---------- 1. Heart geometry (parametric, flipped to screen coords) ---------- */
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
  const scale = Math.min((W * 0.94) / (maxX - minX), (H * 0.9) / (maxY - minY))
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

/* ---------- 2. Rasterize top/bottom boundary per column ---------- */
const topY = new Array(W).fill(Infinity)
const bottomY = new Array(W).fill(-Infinity)
for (let x = 0; x < W; x++) {
  let mn = Infinity
  let mx = -Infinity
  for (let i = 0; i < heart.length; i++) {
    const [x1, y1] = heart[i]
    const [x2, y2] = heart[(i + 1) % heart.length]
    if (x1 === x2) continue
    if (x < Math.min(x1, x2) || x > Math.max(x1, x2)) continue
    const t = (x - x1) / (x2 - x1)
    const y = y1 + t * (y2 - y1)
    if (y < mn) mn = y
    if (y > mx) mx = y
  }
  if (mn !== Infinity) { topY[x] = mn; bottomY[x] = mx }
}

/* ---------- 3. Largest axis-aligned block inscribed in the heart ---------- */
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
const blockSide = sq.size * 0.9
const blockY = sq.top + sq.size / 2 - blockSide / 2

const heartD = heart.map((p, i) => `${i === 0 ? 'M' : 'L'} ${fmt(p[0])} ${fmt(p[1])}`).join(' ') + ' Z'

/* ---------- 4. Build a QR SVG for a given url + palette ---------- */
function buildSVG(url, p) {
  const qr = QRCode.create(url, { errorCorrectionLevel: 'H' })
  const N = qr.modules.size
  const isDark = (r, c) => qr.modules.get(r, c) === 1

  const pad = blockSide * 0.02
  const inner = blockSide - pad * 2
  const ms = inner / (N + QUIET * 2)
  const qx = W / 2 - (N * ms) / 2
  const qy = blockY + blockSide / 2 - (N * ms) / 2

  const finder = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7)

  function roundedModule(r, c) {
    const x = qx + c * ms
    const y = qy + r * ms
    const m = ms * 0.9
    const off = (ms - m) / 2
    const rx = ms * 0.22
    return `<rect x="${fmt(x + off)}" y="${fmt(y + off)}" width="${fmt(m)}" height="${fmt(m)}" rx="${fmt(rx)}" fill="${p.module}"/>`
  }

  function finderShape(r0, c0) {
    const x = qx + c0 * ms
    const y = qy + r0 * ms
    const outer = 7 * ms
    return (
      `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(outer)}" height="${fmt(outer)}" rx="${fmt(ms * 1.4)}" fill="${p.module}"/>` +
      `<rect x="${fmt(x + ms)}" y="${fmt(y + ms)}" width="${fmt(5 * ms)}" height="${fmt(5 * ms)}" rx="${fmt(ms)}" fill="${p.heartFill}"/>` +
      `<rect x="${fmt(x + 2 * ms)}" y="${fmt(y + 2 * ms)}" width="${fmt(3 * ms)}" height="${fmt(3 * ms)}" rx="${fmt(ms * 0.6)}" fill="${p.module}"/>`
    )
  }

  function heartPathAt(cx, cy, size, fill) {
    const w = size * 0.5
    const h = w * 0.9
    return `<path d="M ${cx} ${cy + h * 0.42} C ${cx - w} ${cy - h * 0.3} ${cx - w * 0.35} ${cy - h * 1.0} ${cx} ${cy - h * 0.4} C ${cx + w * 0.35} ${cy - h * 1.0} ${cx + w} ${cy - h * 0.3} ${cx} ${cy + h * 0.42} Z" fill="${fill}"/>`
  }

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

  const cardCx = W / 2
  const cardCy = blockY + blockSide / 2
  const logoS = ms * 5.2
  modules +=
    `<rect x="${fmt(cardCx - logoS * 0.62)}" y="${fmt(cardCy - logoS * 0.62)}" width="${fmt(logoS * 1.24)}" height="${fmt(logoS * 1.24)}" rx="${fmt(logoS * 0.32)}" fill="${p.heartFill}"/>` +
    heartPathAt(cardCx, cardCy, logoS * 0.72, p.module)

  const deco =
    heartPathAt(hMinX + 150, hMinY + 170, 70, p.module) +
    heartPathAt(hMaxX - 150, hMinY + 170, 70, p.module) +
    heartPathAt(W / 2, hMaxY - 150, 60, p.module)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.bgTop}"/>
      <stop offset="100%" stop-color="${p.bgBottom}"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="${p.shadow}" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <path d="${heartD}" fill="${p.heartFill}" stroke="${p.heartStroke}" stroke-width="14" stroke-linejoin="round" filter="url(#soft)"/>
  ${modules}
  ${deco}
</svg>
`
}

/* ---------- 5. Write files ---------- */
await mkdir(outDir, { recursive: true })

for (const t of TARGETS) {
  const svg = buildSVG(t.url, t.palette)
  await writeFile(resolve(outDir, `${t.label}.svg`), svg, 'utf8')
  await sharp(Buffer.from(svg), { density: 144 })
    .png()
    .toFile(resolve(outDir, `${t.label}.png`))
  console.log(`✓ ${t.label}  ->  ${t.url}`)
}

console.log('\nQR code (pink/ungu, menyatu bentuk love) dibuat. File tersimpan (TIDAK ditampilkan di web):')
for (const t of TARGETS) {
  console.log(`  - ${resolve(outDir, `${t.label}.png`)}`)
  console.log(`  - ${resolve(outDir, `${t.label}.svg`)}`)
}
