import sharp from 'sharp'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')
const sourcePath = process.argv[2] || resolve(__dirname, 'tmp/lake-nona-hero-cartoon.png')
const outputPath = process.argv[3] || resolve(publicDir, 'hero.jpg')
const leftFillerPath = resolve(__dirname, 'tmp/hero-left-veterans-hospital.png')
const rightFillerPath = resolve(__dirname, 'tmp/hero-right-boxi-park.png')

// Lake Nona cartoon hero: center illustration + landmark side panels.
// Left: Veterans Hospital (VA Medical Center). Right: Boxi Park containers.
const OUTPUT = { width: 1920, height: 640 }
const DARK = { r: 10, g: 10, b: 10 }
const SEAM_BLEND = 18
const CENTER_WIDTH_RATIO = 0.44

/** Very light darkening at the outer edge so landmarks remain visible. */
function outerEdgeFadeSvg(width, height, side) {
  const isLeft = side === 'left'
  const x1 = isLeft ? '0%' : '100%'
  const x2 = isLeft ? '14%' : '86%'
  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="${x1}" y1="0%" x2="${x2}" y2="0%">
      <stop offset="0%" stop-color="rgba(10,10,10,0.18)"/>
      <stop offset="100%" stop-color="rgba(10,10,10,0)"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#fade)"/>
</svg>`)
}

/**
 * Resize landmark side panel to hero height, crop to pad width, and seam-blend
 * inner edge with the center illustration for a smooth join.
 */
async function prepareSideFiller(fillerPath, padW, illH, side, illustrationBuffer, illW) {
  const resizePosition = side === 'left' ? 'right' : 'left'

  const resized = await sharp(fillerPath)
    .resize(padW, illH, { fit: 'cover', position: resizePosition, kernel: sharp.kernel.lanczos3 })
    .modulate({ brightness: 1.04, saturation: 1.05 })
    .gamma(1.02)
    .linear(1.08, -(128 * 0.04))
    .png()
    .toBuffer()

  const blendW = Math.min(SEAM_BLEND, padW)
  const edgeLeft = side === 'left' ? 0 : illW - blendW
  const centerEdge = await sharp(illustrationBuffer)
    .extract({ left: edgeLeft, top: 0, width: blendW, height: illH })
    .blur(3)
    .png()
    .toBuffer()

  const seamCompositeLeft = side === 'left' ? padW - blendW : 0
  const faded = await sharp(outerEdgeFadeSvg(padW, illH, side)).png().toBuffer()

  return sharp(resized)
    .composite([
      { input: centerEdge, left: seamCompositeLeft, top: 0, blend: 'over' },
      { input: faded, left: 0, top: 0, blend: 'over' },
    ])
    .png()
    .toBuffer()
}

async function buildHero() {
  const source = sharp(sourcePath)
  const meta = await source.metadata()
  console.log('Source:', meta.width, '×', meta.height)

  const illW = Math.round(OUTPUT.width * CENTER_WIDTH_RATIO)
  const illH = OUTPUT.height
  const padL = Math.floor((OUTPUT.width - illW) / 2)
  const padR = OUTPUT.width - illW - padL
  console.log('Illustration:', illW, '×', illH, '| fillers L:', padL, 'R:', padR)

  const illustration = await source
    .clone()
    .resize(illW, illH, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 1.04, saturation: 1.05 })
    .gamma(1.02)
    .linear(1.08, -(128 * 0.04))
    .sharpen({ sigma: 0.5, m1: 0.4, m2: 0.25 })
    .png()
    .toBuffer()

  const [leftFiller, rightFiller] = await Promise.all([
    prepareSideFiller(leftFillerPath, padL, illH, 'left', illustration, illW),
    prepareSideFiller(rightFillerPath, padR, illH, 'right', illustration, illW),
  ])

  await sharp({
    create: {
      width: OUTPUT.width,
      height: OUTPUT.height,
      channels: 3,
      background: DARK,
    },
  })
    .composite([
      { input: leftFiller, left: 0, top: 0 },
      { input: illustration, left: padL, top: 0 },
      { input: rightFiller, left: padL + illW, top: 0 },
    ])
    .jpeg({ quality: 85, mozjpeg: true, progressive: true })
    .toFile(outputPath)

  const out = await sharp(outputPath).metadata()
  console.log('Wrote', outputPath, '→', out.width, '×', out.height, `(${(out.size / 1024).toFixed(0)} KB)`)
}

buildHero().catch((err) => {
  console.error(err)
  process.exit(1)
})
