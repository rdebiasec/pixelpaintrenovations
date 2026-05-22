import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = new URL('../src/i18n', import.meta.url)
const enPath = path.join(ROOT.pathname, 'content.en.json')

async function ensureFiles() {
  try {
    await fs.access(enPath)
  } catch {
    await fs.writeFile(enPath, JSON.stringify({ meta: { siteName: 'Pixel Paint Renovations' } }, null, 2))
  }
}

await ensureFiles()
