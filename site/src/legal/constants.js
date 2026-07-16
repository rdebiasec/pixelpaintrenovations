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
