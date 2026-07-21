import { getCatalog } from '../i18n/catalog.js'
import { getActiveLocale } from '../i18n/state.js'
import { DEFAULT_LOCALE } from '../i18n/locales.js'

export function getNav(locale = getActiveLocale()) {
  return getCatalog(locale).nav
}

export function getServiceSubnav(locale = getActiveLocale()) {
  return getCatalog(locale).serviceSubnav
}

export function getServiceOptions(locale = getActiveLocale()) {
  return getCatalog(locale).serviceOptions
}

/** @deprecated Prefer getNav() — kept for scripts that need a static snapshot */
export const nav = getCatalog(DEFAULT_LOCALE).nav
export const serviceSubnav = getCatalog(DEFAULT_LOCALE).serviceSubnav
export const serviceOptions = getCatalog(DEFAULT_LOCALE).serviceOptions
