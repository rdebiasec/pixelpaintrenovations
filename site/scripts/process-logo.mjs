import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')
const sourcePath =
  process.argv[2] ||
  resolve(publicDir, 'logo-source.png')

const SITE_BG = { r: 10, g: 10, b: 10 }
const BG_THRESHOLD = 20
const TRIM_PAD = 28
const FADE_DISTANCE = 52

const PIXEL_BLUE = '#2bace2'
const PIXEL_MAGENTA = '#c026a0'
const PIXEL_DARK_GREY = '#3a3a3a'
const PIXEL_LIGHT_GREY = '#8a8a8a'

function isBackground(r, g, b) {
  return r <= BG_THRESHOLD && g <= BG_THRESHOLD && b <= BG_THRESHOLD
}

function normalizeBackground(r, g, b) {
  if (!isBackground(r, g, b)) return { r, g, b }
  return { ...SITE_BG }
}

async function loadRgba(path) {
  const { data, info } = await sharp(path)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  return { data: Buffer.from(data), info }
}

function findContentBounds(data, width, height, channels, useAlpha = false) {
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = useAlpha ? data[i + 3] : 255
      if (a > 8 && !isBackground(r, g, b)) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }

  return { minX, minY, maxX, maxY }
}

function findTaglineSplitY(data, width, height, channels) {
  const counts = new Array(height).fill(0)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      if (!isBackground(data[i], data[i + 1], data[i + 2])) counts[y]++
    }
  }

  let bestGap = 0
  let bestStart = height
  let gapLen = 0
  let gapStart = 0
  const searchStart = Math.floor(height * 0.45)
  const searchEnd = Math.floor(height * 0.82)

  for (let y = searchStart; y < searchEnd; y++) {
    if (counts[y] === 0) {
      if (gapLen === 0) gapStart = y
      gapLen++
      if (gapLen > bestGap) {
        bestGap = gapLen
        bestStart = gapStart
      }
    } else {
      gapLen = 0
    }
  }

  if (bestGap >= 12) return bestStart - 6
  return height
}

function findBadgeCenter(data, width, height, channels, maxY) {
  let sumX = 0
  let sumY = 0
  let count = 0

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      if (!isBackground(data[i], data[i + 1], data[i + 2])) {
        sumX += x
        sumY += y
        count++
      }
    }
  }

  if (!count) return { cx: width / 2, cy: maxY / 2, radius: Math.min(width, maxY) * 0.22 }

  const cx = sumX / count
  const cy = sumY / count
  let maxDist = 0

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      if (!isBackground(data[i], data[i + 1], data[i + 2])) {
        const dx = x - cx
        const dy = y - cy
        maxDist = Math.max(maxDist, Math.hypot(dx, dy))
      }
    }
  }

  return { cx, cy, radius: maxDist * 0.92 }
}

function createPixelGlowSvg(width, height, badge) {
  const leftPixels = [
    { x: -0.78, y: -0.42, size: 34, opacity: 0.95 },
    { x: -0.92, y: -0.18, size: 26, opacity: 0.88 },
    { x: -1.02, y: 0.08, size: 30, opacity: 0.92 },
    { x: -0.86, y: 0.28, size: 22, opacity: 0.82 },
    { x: -1.12, y: -0.02, size: 18, opacity: 0.75 },
    { x: -0.68, y: -0.08, size: 20, opacity: 0.8 },
    { x: -0.74, y: 0.18, size: 16, opacity: 0.72 },
    { x: -1.18, y: -0.28, size: 14, opacity: 0.68 },
    { x: -0.98, y: 0.36, size: 12, opacity: 0.65 },
    { x: -0.58, y: -0.28, size: 14, opacity: 0.7 },
    { x: -1.24, y: 0.14, size: 10, opacity: 0.6 },
    { x: -0.62, y: 0.34, size: 10, opacity: 0.58 },
    { x: -1.06, y: -0.48, size: 12, opacity: 0.62 },
    { x: -0.88, y: 0.48, size: 8, opacity: 0.55 },
    { x: -1.08, y: -0.32, size: 9, opacity: 0.42, color: PIXEL_DARK_GREY },
    { x: -0.72, y: 0.02, size: 8, opacity: 0.38, color: PIXEL_LIGHT_GREY },
    { x: -1.16, y: 0.22, size: 7, opacity: 0.35, color: PIXEL_DARK_GREY },
    { x: -0.54, y: 0.12, size: 6, opacity: 0.32, color: PIXEL_LIGHT_GREY }
  ]

  const rightPixels = [
    { x: 0.78, y: -0.42, size: 34, opacity: 0.95 },
    { x: 0.92, y: -0.18, size: 26, opacity: 0.88 },
    { x: 1.02, y: 0.08, size: 30, opacity: 0.92 },
    { x: 0.86, y: 0.28, size: 22, opacity: 0.82 },
    { x: 1.12, y: -0.02, size: 18, opacity: 0.75 },
    { x: 0.68, y: -0.08, size: 20, opacity: 0.8 },
    { x: 0.74, y: 0.18, size: 16, opacity: 0.72 },
    { x: 1.18, y: -0.28, size: 14, opacity: 0.68 },
    { x: 0.98, y: 0.36, size: 12, opacity: 0.65 },
    { x: 0.58, y: -0.28, size: 14, opacity: 0.7 },
    { x: 1.24, y: 0.14, size: 10, opacity: 0.6 },
    { x: 0.62, y: 0.34, size: 10, opacity: 0.58 },
    { x: 1.06, y: -0.48, size: 12, opacity: 0.62 },
    { x: 0.88, y: 0.48, size: 8, opacity: 0.55 },
    { x: 1.08, y: -0.32, size: 9, opacity: 0.42, color: PIXEL_DARK_GREY },
    { x: 0.72, y: 0.02, size: 8, opacity: 0.38, color: PIXEL_LIGHT_GREY },
    { x: 1.16, y: 0.22, size: 7, opacity: 0.35, color: PIXEL_DARK_GREY },
    { x: 0.54, y: 0.12, size: 6, opacity: 0.32, color: PIXEL_LIGHT_GREY }
  ]

  const renderPixels = (pixels, defaultColor, filterId) =>
    pixels
      .map(({ x, y, size, opacity, color }) => {
        const px = badge.cx + x * badge.radius - size / 2
        const py = badge.cy + y * badge.radius - size / 2
        const fill = color || defaultColor
        const pixelFilter = color ? 'none' : filterId
        const filterAttr = pixelFilter === 'none' ? '' : ` filter="url(#${filterId})"`
        return `<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${size}" height="${size}" fill="${fill}" opacity="${opacity}"${filterAttr} />`
      })
      .join('\n    ')

  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow-blue" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="glow-magenta" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="soft-blue" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
    </filter>
    <filter id="soft-magenta" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
    </filter>
  </defs>
  <ellipse cx="${badge.cx.toFixed(1)}" cy="${badge.cy.toFixed(1)}" rx="${(badge.radius * 0.55).toFixed(1)}" ry="${(badge.radius * 0.72).toFixed(1)}" fill="${PIXEL_BLUE}" opacity="0.14" filter="url(#soft-blue)" />
  <ellipse cx="${badge.cx.toFixed(1)}" cy="${badge.cy.toFixed(1)}" rx="${(badge.radius * 0.55).toFixed(1)}" ry="${(badge.radius * 0.72).toFixed(1)}" fill="${PIXEL_MAGENTA}" opacity="0.14" filter="url(#soft-magenta)" transform="translate(${(badge.radius * 0.08).toFixed(1)}, 0)" />
  ${renderPixels(leftPixels, PIXEL_BLUE, 'glow-blue')}
  ${renderPixels(rightPixels, PIXEL_MAGENTA, 'glow-magenta')}
</svg>`)
}

async function enhancePixelGlow(sourcePath) {
  const meta = await sharp(sourcePath).metadata()
  const { width, height } = meta
  const { data, info } = await loadRgba(sourcePath)
  const taglineSplitY = findTaglineSplitY(data, width, height, info.channels)
  const badge = findBadgeCenter(data, width, height, info.channels, taglineSplitY)
  const glowSvg = createPixelGlowSvg(width, height, badge)

  return sharp(sourcePath)
    .composite([{ input: glowSvg, blend: 'screen' }])
    .png()
    .toBuffer()
}

function processImage(data, width, height, channels, maxY = height) {
  const out = Buffer.alloc(width * height * 4)
  const contentMask = new Uint8Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const i = idx * channels
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const bg = isBackground(r, g, b)
      contentMask[idx] = !bg && y <= maxY ? 1 : 0
    }
  }

  const dist = new Float32Array(width * height)
  dist.fill(Number.POSITIVE_INFINITY)
  const queue = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      if (contentMask[idx]) {
        dist[idx] = 0
        queue.push(idx)
      }
    }
  }

  while (queue.length) {
    const idx = queue.shift()
    const x = idx % width
    const y = (idx - x) / width
    const base = dist[idx]

    const neighbors = []
    if (x > 0) neighbors.push(idx - 1)
    if (x < width - 1) neighbors.push(idx + 1)
    if (y > 0) neighbors.push(idx - width)
    if (y < height - 1) neighbors.push(idx + width)

    for (const n of neighbors) {
      const next = base + 1
      if (next < dist[n]) {
        dist[n] = next
        queue.push(n)
      }
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const i = idx * channels
      const o = idx * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const normalized = normalizeBackground(r, g, b)
      const distance = dist[idx]

      let alpha = 255
      if (y > maxY) {
        alpha = 0
      } else if (isBackground(r, g, b)) {
        if (distance > FADE_DISTANCE) {
          alpha = 0
        } else if (distance > 0) {
          const t = 1 - (distance - 0) / FADE_DISTANCE
          alpha = Math.round(255 * t * t)
        }
      }

      if (y > maxY) alpha = 0

      out[o] = normalized.r
      out[o + 1] = normalized.g
      out[o + 2] = normalized.b
      out[o + 3] = alpha
    }
  }

  return out
}

async function writePng(buffer, width, height, outPath, options = {}) {
  let img = sharp(buffer, { raw: { width, height, channels: 4 } })

  if (options.extract) {
    const { left, top, width: w, height: h } = options.extract
    img = img.extract({ left, top, width: w, height: h })
  }

  await img.png({ compressionLevel: 9, quality: 95 }).toFile(outPath)
}

async function createOgImage(logoPath, outPath) {
  const logoMeta = await sharp(logoPath).metadata()
  const canvasW = 1200
  const canvasH = 630
  const maxLogoW = 760
  const scale = Math.min(1, maxLogoW / logoMeta.width)
  const logoW = Math.round(logoMeta.width * scale)
  const logoH = Math.round(logoMeta.height * scale)
  const left = Math.round((canvasW - logoW) / 2)
  const top = Math.round((canvasH - logoH) / 2)

  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 3,
      background: SITE_BG
    }
  })
    .composite([{ input: logoPath, left, top }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outPath)
}

async function main() {
  await mkdir(publicDir, { recursive: true })

  const enhancedBuffer = await enhancePixelGlow(sourcePath)
  const { data, info } = await loadRgba(enhancedBuffer)
  const { width, height, channels } = info
  const taglineSplitY = findTaglineSplitY(data, width, height, channels)
  const badgeProcessed = processImage(data, width, height, channels, taglineSplitY)

  const badgeBounds = findContentBounds(badgeProcessed, width, height, 4, true)

  const badgeExtract = {
    left: Math.max(0, badgeBounds.minX - TRIM_PAD),
    top: Math.max(0, badgeBounds.minY - TRIM_PAD),
    width: Math.min(width, badgeBounds.maxX + TRIM_PAD + 1) - Math.max(0, badgeBounds.minX - TRIM_PAD),
    height: Math.min(height, badgeBounds.maxY + TRIM_PAD + 1) - Math.max(0, badgeBounds.minY - TRIM_PAD)
  }

  const logoPath = resolve(publicDir, 'logo.png')
  const iconPath = resolve(publicDir, 'logo-icon.png')
  const faviconPath = resolve(publicDir, 'favicon.png')
  const ogPath = resolve(publicDir, 'og-image.jpg')

  await writePng(badgeProcessed, width, height, logoPath, { extract: badgeExtract })
  await writePng(badgeProcessed, width, height, iconPath, { extract: badgeExtract })

  await sharp(iconPath)
    .resize(512, 512, { fit: 'contain', background: SITE_BG })
    .png({ compressionLevel: 9 })
    .toFile(faviconPath)

  await createOgImage(logoPath, ogPath)

  console.log('Processed logo assets:')
  console.log('  logo.png (badge + pixels, no tagline)', badgeExtract)
  console.log('  logo-icon.png', badgeExtract)
  console.log('  favicon.png (512x512 from badge)')
  console.log('  og-image.jpg (1200x630, no tagline)')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
