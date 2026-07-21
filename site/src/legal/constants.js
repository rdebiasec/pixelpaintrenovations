/**
 * Legal / URL helpers. Brand identity lives in `../brand/config.js` —
 * re-exported here so existing imports keep working.
 */
export {
  COMPANY_LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  BUSINESS_LOCATION,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  SITE_URL,
  OG_IMAGE,
  HERO_IMAGE
} from '../brand/config.js'

import { SITE_URL } from '../brand/config.js'
import { localePathPrefix } from '../i18n/locales.js'
import { getActiveLocale } from '../i18n/state.js'

export function baseUrl() {
  const b = import.meta.env.BASE_URL || '/'
  return b.endsWith('/') ? b : `${b}/`
}

function isAssetPath(path) {
  if (!path) return false
  if (path.startsWith('projects/')) return true
  return /\.(png|jpe?g|webp|svg|gif|ico|xml|txt|pdf|webp)$/i.test(path)
}

/**
 * Build a site-relative URL. Page paths get the active locale prefix; assets do not.
 * @param {string} path
 * @param {{ locale?: string, asset?: boolean }} [options]
 */
export function href(path, options = {}) {
  const root = baseUrl()
  const clean = (path || '').startsWith('/') ? path.slice(1) : path || ''
  const asAsset = options.asset === true || isAssetPath(clean)
  if (asAsset) return `${root}${clean}`
  const locale = options.locale || getActiveLocale()
  const prefix = localePathPrefix(locale)
  return `${root}${prefix}${clean}`
}

export function absoluteUrl(path = '', options = {}) {
  const relative = href(path, options).replace(/^\//, '')
  return relative ? `${SITE_URL}/${relative}` : SITE_URL
}

/**
 * Absolute URL for a page path in a specific locale (SEO / sitemap).
 */
export function absoluteLocaleUrl(pagePath, localeId) {
  const prefix = localePathPrefix(localeId)
  const clean = (pagePath || '').replace(/^\//, '').replace(/\/$/, '')
  if (!clean) {
    return prefix ? `${SITE_URL}/${prefix.replace(/\/$/, '')}/` : `${SITE_URL}/`
  }
  return `${SITE_URL}/${prefix}${clean}/`
}
