import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync, statSync } from 'fs'
import { defineConfig, loadEnv } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

const normalizeBase = (value) => {
  if (!value || value === '/') return '/'
  const withLeading = value.startsWith('/') ? value : `/${value}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

function collectHtmlInputs(dir, base = dir, acc = {}) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry === 'public') continue
    const full = resolve(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      collectHtmlInputs(full, base, acc)
      continue
    }
    if (entry === 'index.html') {
      const rel = full.slice(base.length + 1).replace(/\\/g, '/')
      const key = rel === 'index.html' ? 'main' : rel.replace(/\/index\.html$/, '').replace(/\//g, '-')
      acc[key] = full
    }
  }
  return acc
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = normalizeBase(env.VITE_BASE_PATH)
  const input = collectHtmlInputs(__dirname)

  return {
    base,
    build: {
      rollupOptions: {
        input
      }
    },
    server: {
      port: 5180,
      strictPort: true,
      host: 'localhost'
    },
    preview: {
      port: 5180,
      strictPort: true,
      host: 'localhost'
    }
  }
})
