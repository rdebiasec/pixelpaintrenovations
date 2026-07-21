import { getCatalog } from '../i18n/catalog.js'
import { getActiveLocale } from '../i18n/state.js'
import { DEFAULT_LOCALE } from '../i18n/locales.js'

export function getProjectShowcase(locale = getActiveLocale()) {
  return getCatalog(locale).projectShowcase
}

export const projectShowcase = getCatalog(DEFAULT_LOCALE).projectShowcase
