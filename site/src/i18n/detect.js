import { DEFAULT_LOCALE, LOCALE_BY_PREFIX, getLocaleDef } from './locales.js'

/**
 * Resolve locale from <html data-locale> (build shells) or pathname prefixes.
 * @param {string} [pathname]
 * @param {Document | null} [doc]
 */
export function detectLocale(pathname, doc = typeof document !== 'undefined' ? document : null) {
  const fromAttr = doc?.documentElement?.getAttribute('data-locale')
  if (fromAttr && getLocaleDef(fromAttr).id === fromAttr) {
    return fromAttr
  }

  const path = pathname ?? (typeof location !== 'undefined' ? location.pathname : '/')
  const segments = path.replace(/^\//, '').split('/').filter(Boolean)
  const first = segments[0]?.toLowerCase()
  if (first && LOCALE_BY_PREFIX[first]) {
    return LOCALE_BY_PREFIX[first].id
  }
  return DEFAULT_LOCALE
}

/**
 * Strip locale prefix from a pathname, returning the site-relative page path.
 * @param {string} pathname
 */
export function stripLocalePrefix(pathname) {
  const segments = pathname.replace(/^\//, '').split('/').filter(Boolean)
  const first = segments[0]?.toLowerCase()
  if (first && LOCALE_BY_PREFIX[first]) {
    return segments.slice(1).join('/')
  }
  return segments.join('/')
}

/**
 * Build a same-page URL for another locale (keeps hash).
 * @param {string} targetLocaleId
 * @param {string} [pathname]
 * @param {string} [hash]
 * @param {string} [base]
 */
export function localizedPathFor(targetLocaleId, pathname, hash = '', base = '/') {
  const root = base.endsWith('/') ? base : `${base}/`
  const pagePath = stripLocalePrefix(pathname ?? (typeof location !== 'undefined' ? location.pathname : '/'))
  const locale = getLocaleDef(targetLocaleId)
  const prefix = locale.pathPrefix ? `${locale.pathPrefix}/` : ''
  const page = pagePath ? (pagePath.endsWith('/') || pagePath.includes('.') ? pagePath : `${pagePath}/`) : ''
  const normalizedPage = page && !page.endsWith('/') && !page.includes('.') ? `${page}/` : page
  return `${root}${prefix}${normalizedPage}${hash || ''}`
}
