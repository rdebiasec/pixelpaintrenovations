export const COMPANY_LEGAL_NAME = 'Pixel Paint and Renovations Inc'
export const CONTACT_EMAIL = 'Haroldtascon82@gmail.com'
export const CONTACT_PHONE_DISPLAY = '(407) 883-7891'
export const CONTACT_PHONE_TEL = '+14078837891'
export const BUSINESS_LOCATION = 'Lake Nona, FL'
export const INSTAGRAM_URL = 'https://www.instagram.com/pixelpaint.renovations/'
export const FACEBOOK_URL = 'https://www.facebook.com/pixelpaint.renovations/'
export const SITE_URL = 'https://rdebiasec.github.io/pixelpaintrenovations'
export const OG_IMAGE = 'og-image.jpg'
// hero.jpg: single seamless Lake Nona landmark panorama.
// Source master artwork is processed via scripts/process-hero.mjs (no side-panel stitching).
export const HERO_IMAGE = 'hero.jpg'

export function baseUrl() {
  const b = import.meta.env.BASE_URL || '/'
  return b.endsWith('/') ? b : `${b}/`
}

export function href(path) {
  const root = baseUrl()
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${root}${clean}`
}

export function absoluteUrl(path = '') {
  const relative = href(path).replace(/^\//, '')
  return relative ? `${SITE_URL}/${relative}` : SITE_URL
}
