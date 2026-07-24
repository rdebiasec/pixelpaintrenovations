import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LOCALES, DEFAULT_LOCALE } from '../src/i18n/locales.js'
import { seoRoutes } from '../src/content/pages.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, '..')
const catalogsDir = path.resolve(siteRoot, 'src/i18n/catalogs')

function collectKeys(value, prefix = '') {
  if (Array.isArray(value)) {
    if (value.length === 0) return [prefix || '[]']
    // Compare array length + first-element shape via indexed keys for objects
    const keys = [`${prefix}.length:${value.length}`]
    value.forEach((item, index) => {
      keys.push(...collectKeys(item, `${prefix}[${index}]`))
    })
    return keys
  }
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .flatMap((key) => collectKeys(value[key], prefix ? `${prefix}.${key}` : key))
  }
  return [prefix]
}

function structuralKeys(catalog) {
  // Ignore leaf string values — compare key paths only (strip length markers for arrays of primitives)
  return new Set(
    collectKeys(catalog)
      .map((key) => key.replace(/\.length:\d+$/, ''))
      .filter(Boolean)
  )
}

async function validateCatalogs() {
  const en = JSON.parse(await fs.readFile(path.join(catalogsDir, 'en.json'), 'utf8'))
  const enKeys = structuralKeys(en)

  for (const locale of LOCALES) {
    if (locale.id === DEFAULT_LOCALE) continue
    const fileName = locale.id === 'pt-BR' ? 'pt-BR.json' : `${locale.id}.json`
    const catalog = JSON.parse(await fs.readFile(path.join(catalogsDir, fileName), 'utf8'))
    const keys = structuralKeys(catalog)
    const missing = [...enKeys].filter((key) => !keys.has(key))
    const extra = [...keys].filter((key) => !enKeys.has(key))
    if (missing.length || extra.length) {
      const detail = [
        missing.length ? `missing (${missing.length}): ${missing.slice(0, 8).join(', ')}` : '',
        extra.length ? `extra (${extra.length}): ${extra.slice(0, 8).join(', ')}` : ''
      ]
        .filter(Boolean)
        .join('; ')
      throw new Error(`i18n-build: catalog ${fileName} key mismatch vs en.json — ${detail}`)
    }
    if (catalog.meta?.locale !== locale.id) {
      throw new Error(`i18n-build: ${fileName} meta.locale must be "${locale.id}"`)
    }
  }
  console.log(`i18n-build: catalog parity OK (${LOCALES.length} locales)`)
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

function localizeHtml(html, locale) {
  let out = html
  out = out.replace(/<html\b[^>]*>/, `<html lang="${locale.htmlLang}" data-locale="${locale.id}">`)
  return out
}

async function generateLocaleShells() {
  const prefixed = LOCALES.filter((locale) => locale.pathPrefix)
  let count = 0

  for (const locale of prefixed) {
    for (const route of seoRoutes) {
      const sourcePath = path.resolve(siteRoot, route.html)
      const targetRel = route.html === 'index.html' ? 'index.html' : route.html
      const targetPath = path.resolve(siteRoot, locale.pathPrefix, targetRel)
      await ensureDir(path.dirname(targetPath))
      const html = localizeHtml(await fs.readFile(sourcePath, 'utf8'), locale)
      await fs.writeFile(targetPath, html)
      count += 1
    }
  }

  console.log(`i18n-build: generated ${count} locale HTML shells`)
}

await validateCatalogs()
await generateLocaleShells()
