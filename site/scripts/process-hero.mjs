import sharp from 'sharp'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')
const sourcePath = process.argv[2] || resolve(__dirname, 'tmp/lake-nona-hero-master.png')
const outputPath = process.argv[3] || resolve(publicDir, 'hero.jpg')

// One-image hero workflow: feed a single finished master artwork and export hero.jpg.
const OUTPUT = { width: 1920, height: 640 }

async function buildHero() {
  const source = sharp(sourcePath)
  const meta = await source.metadata()
  console.log('Source:', meta.width, '×', meta.height)

  await source
    .clone()
    .resize(OUTPUT.width, OUTPUT.height, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 1.04, saturation: 1.05 })
    .gamma(1.02)
    .linear(1.05, -3)
    .sharpen({ sigma: 0.55, m1: 0.5, m2: 0.25 })
    .jpeg({ quality: 85, mozjpeg: true, progressive: true })
    .toFile(outputPath)

  const out = await sharp(outputPath).metadata()
  console.log('Wrote', outputPath, '→', out.width, '×', out.height, `(${(out.size / 1024).toFixed(0)} KB)`)
}

buildHero().catch((err) => {
  console.error(err)
  process.exit(1)
})
