const rawPlausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN
const rawGa4Id = import.meta.env.VITE_GA4_ID

const PLAUSIBLE_DOMAIN_PATTERN = /^[a-z0-9.-]+$/i
const GA4_ID_PATTERN = /^G-[A-Z0-9]+$/

const plausibleDomain =
  typeof rawPlausibleDomain === 'string' && PLAUSIBLE_DOMAIN_PATTERN.test(rawPlausibleDomain)
    ? rawPlausibleDomain
    : ''
const ga4Id = typeof rawGa4Id === 'string' && GA4_ID_PATTERN.test(rawGa4Id) ? rawGa4Id : ''

let initialized = false

function loadScript(src, attrs = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return
  const script = document.createElement('script')
  script.src = src
  script.defer = true
  Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value))
  document.head.appendChild(script)
}

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  if (plausibleDomain) {
    loadScript('https://plausible.io/js/script.js', { 'data-domain': plausibleDomain })
    return
  }

  if (ga4Id) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`)
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag(...args) {
      window.dataLayer.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', ga4Id, { anonymize_ip: true })
  }
}

export function trackEvent(name, props = {}) {
  if (plausibleDomain && typeof window.plausible === 'function') {
    window.plausible(name, { props })
    return
  }

  if (ga4Id && typeof window.gtag === 'function') {
    window.gtag('event', name, props)
  }
}
