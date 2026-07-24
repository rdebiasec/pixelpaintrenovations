import { access, readFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '../dist')

const requiredFiles = [
  'index.html',
  'services/index.html',
  'privacy/index.html',
  'es/index.html',
  'es/services/index.html',
  'pt-br/index.html',
  'pt-br/contact/index.html',
  'sitemap.xml',
  'favicon.png',
  'logo.png'
]

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function main() {
  const missing = []
  for (const file of requiredFiles) {
    const full = resolve(distDir, file)
    if (!(await exists(full))) missing.push(file)
  }

  if (missing.length) {
    console.error('check-dist: missing files in dist/:')
    missing.forEach((file) => console.error(`  - ${file}`))
    process.exit(1)
  }

  const home = await readFile(resolve(distDir, 'index.html'), 'utf8')
  if (!home.includes('application/ld+json')) {
    console.error('check-dist: index.html missing static JSON-LD')
    process.exit(1)
  }

  if (!home.includes('canonical')) {
    console.error('check-dist: index.html missing canonical link')
    process.exit(1)
  }

  if (!home.includes('hreflang')) {
    console.error('check-dist: index.html missing hreflang alternates')
    process.exit(1)
  }

  if (!home.includes('Content-Security-Policy')) {
    console.error('check-dist: index.html missing Content-Security-Policy meta')
    process.exit(1)
  }

  if (!home.includes('form-action')) {
    console.error('check-dist: CSP missing form-action directive')
    process.exit(1)
  }

  const esHome = await readFile(resolve(distDir, 'es/index.html'), 'utf8')
  if (!esHome.includes('lang="es"') || !esHome.includes('data-locale="es"')) {
    console.error('check-dist: es/index.html missing Spanish lang/data-locale')
    process.exit(1)
  }
  if (!esHome.includes('hreflang="es"')) {
    console.error('check-dist: es/index.html missing hreflang="es"')
    process.exit(1)
  }

  const ptHome = await readFile(resolve(distDir, 'pt-br/index.html'), 'utf8')
  if (!ptHome.includes('lang="pt-BR"') || !ptHome.includes('data-locale="pt-BR"')) {
    console.error('check-dist: pt-br/index.html missing pt-BR lang/data-locale')
    process.exit(1)
  }
  if (!ptHome.includes('hreflang="pt-BR"')) {
    console.error('check-dist: pt-br/index.html missing hreflang="pt-BR"')
    process.exit(1)
  }

  const sitemap = await readFile(resolve(distDir, 'sitemap.xml'), 'utf8')
  if (!sitemap.includes('xhtml:link') || !sitemap.includes('/es/') || !sitemap.includes('/pt-br/')) {
    console.error('check-dist: sitemap.xml missing locale alternates')
    process.exit(1)
  }

  console.log(`check-dist: OK (${requiredFiles.length} required files present; hreflang + locales verified)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
