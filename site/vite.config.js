import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

const normalizeBase = (value) => {
  if (!value || value === '/') return '/'
  const withLeading = value.startsWith('/') ? value : `/${value}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = normalizeBase(env.VITE_BASE_PATH)

  return {
    base,
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          services: resolve(__dirname, 'services/index.html'),
          kitchen: resolve(__dirname, 'kitchen-renovations/index.html'),
          bathroom: resolve(__dirname, 'bathroom-renovations/index.html'),
          projects: resolve(__dirname, 'projects/index.html'),
          about: resolve(__dirname, 'about/index.html'),
          contact: resolve(__dirname, 'contact/index.html')
        }
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
