import QRCode from 'qrcode'

const QUIET = 4

function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.lineTo(x + w - rad, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad)
  ctx.lineTo(x + w, y + h - rad)
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h)
  ctx.lineTo(x + rad, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad)
  ctx.lineTo(x, y + rad)
  ctx.quadraticCurveTo(x, y, x + rad, y)
  ctx.closePath()
}

function heartPointCloud(size) {
  const steps = 800
  const raw = []
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const x = 16 * Math.sin(t) ** 3
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    raw.push([x, y])
  }
  const xs = raw.map((p) => p[0])
  const ys = raw.map((p) => p[1])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const scale = Math.min((size * 0.94) / (maxX - minX), (size * 0.9) / (maxY - minY))
  const midX = (minX + maxX) / 2
  const midY = (minY + maxY) / 2
  return raw.map(([x, y]) => [size / 2 + (x - midX) * scale, size / 2 - (y - midY) * scale])
}

function heartPath(ctx, pts) {
  ctx.beginPath()
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
  ctx.closePath()
}

function miniHeart(ctx, cx, cy, s, color) {
  const w = s * 0.5
  const hgt = w * 0.92
  ctx.beginPath()
  ctx.moveTo(cx, cy + hgt * 0.44)
  ctx.bezierCurveTo(cx - w, cy - hgt * 0.3, cx - w * 0.35, cy - hgt, cx, cy - hgt * 0.4)
  ctx.bezierCurveTo(cx + w * 0.35, cy - hgt, cx + w, cy - hgt * 0.3, cx, cy + hgt * 0.44)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

export function heartQrDataUrl(url, palette = {}, size = 320) {
  const qr = QRCode.create(url, { errorCorrectionLevel: 'H' })
  const N = qr.modules.size
  const isDark = (r, c) => qr.modules.get(r, c) === 1
  const finder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7)

  const heart = heartPointCloud(size)
  let hMinX = Infinity
  let hMaxX = -Infinity
  let hMinY = Infinity
  let hMaxY = -Infinity
  for (const [x, y] of heart) {
    if (x < hMinX) hMinX = x
    if (x > hMaxX) hMaxX = x
    if (y < hMinY) hMinY = y
    if (y > hMaxY) hMaxY = y
  }

  const topY = new Array(size).fill(Infinity)
  const bottomY = new Array(size).fill(-Infinity)
  for (let x = 0; x < size; x++) {
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
    if (mn !== Infinity) {
      topY[x] = mn
      bottomY[x] = mx
    }
  }

  let best = 0
  let bestTop = 0
  const start = Math.floor(size * 0.13)
  for (let S = start; S <= size; S += 1) {
    const x1 = Math.round(size / 2 - S / 2)
    const x2 = Math.round(size / 2 + S / 2)
    if (x1 < 0 || x2 >= size) break
    let maxTop = -Infinity
    let minBot = Infinity
    let ok = true
    for (let x = x1; x <= x2; x++) {
      const t = topY[x]
      const b = bottomY[x]
      if (!Number.isFinite(t) || !Number.isFinite(b)) {
        ok = false
        break
      }
      if (t > maxTop) maxTop = t
      if (b < minBot) minBot = b
    }
    if (ok && minBot - maxTop >= S) {
      best = S
      bestTop = maxTop + (minBot - maxTop - S) / 2
    }
  }
  if (best <= 0) {
    best = size
    bestTop = 0
  }

  const blockSide = best * 0.9
  const blockX = size / 2 - blockSide / 2
  const blockY = bestTop + best / 2 - blockSide / 2
  const pad = blockSide * 0.02
  const inner = blockSide - pad * 2
  const ms = inner / (N + QUIET * 2)
  const qx = size / 2 - (N * ms) / 2
  const qy = blockY + blockSide / 2 - (N * ms) / 2

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const bg = ctx.createLinearGradient(0, 0, 0, size)
  bg.addColorStop(0, palette.bgTop || '#ffe6f2')
  bg.addColorStop(1, palette.bgBottom || '#ffc4de')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)

  heartPath(ctx, heart)
  ctx.fillStyle = palette.heartFill || '#fff6fb'
  ctx.fill()
  ctx.strokeStyle = palette.heartStroke || '#ff2d87'
  ctx.lineWidth = Math.max(2, size * 0.012)
  ctx.lineJoin = 'round'
  ctx.stroke()

  const moduleFill = palette.module || '#d6006e'
  const gap = ms * 0.08
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!isDark(r, c) || finder(r, c)) continue
      rr(ctx, qx + c * ms + gap, qy + r * ms + gap, ms - gap * 2, ms - gap * 2, ms * 0.22)
      ctx.fillStyle = moduleFill
      ctx.fill()
    }
  }

  for (const [r0, c0] of [[0, 0], [0, N - 7], [N - 7, 0]]) {
    const x = qx + c0 * ms
    const y = qy + r0 * ms
    rr(ctx, x, y, 7 * ms, 7 * ms, ms * 1.4)
    ctx.fillStyle = moduleFill
    ctx.fill()
    rr(ctx, x + ms, y + ms, 5 * ms, 5 * ms, ms)
    ctx.fillStyle = palette.heartFill || '#fff6fb'
    ctx.fill()
    rr(ctx, x + 2 * ms, y + 2 * ms, 3 * ms, 3 * ms, ms * 0.6)
    ctx.fillStyle = moduleFill
    ctx.fill()
  }

  const logoS = ms * 5.2
  const cx = size / 2
  const cy = blockY + blockSide / 2
  rr(ctx, cx - logoS * 0.62, cy - logoS * 0.62, logoS * 1.24, logoS * 1.24, logoS * 0.32)
  ctx.fillStyle = palette.heartFill || '#fff6fb'
  ctx.fill()
  miniHeart(ctx, cx, cy, logoS * 0.72, moduleFill)

  miniHeart(ctx, hMinX + size * 0.14, hMinY + size * 0.17, size * 0.045, moduleFill)
  miniHeart(ctx, hMaxX - size * 0.14, hMinY + size * 0.17, size * 0.045, moduleFill)
  miniHeart(ctx, size / 2, hMaxY - size * 0.12, size * 0.035, moduleFill)

  return canvas.toDataURL('image/png')
}