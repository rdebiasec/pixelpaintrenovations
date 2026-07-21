import { getCatalog } from '../i18n/catalog.js'
import { getActiveLocale } from '../i18n/state.js'
import { DEFAULT_LOCALE } from '../i18n/locales.js'

export function getWhyChooseUs(locale = getActiveLocale()) {
  return getCatalog(locale).whyChooseUs
}

export function getServiceAreas(locale = getActiveLocale()) {
  return getCatalog(locale).serviceAreas
}

export const whyChooseUs = getCatalog(DEFAULT_LOCALE).whyChooseUs
export const serviceAreas = getCatalog(DEFAULT_LOCALE).serviceAreas
