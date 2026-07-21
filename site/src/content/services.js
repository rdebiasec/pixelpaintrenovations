import { getCatalog } from '../i18n/catalog.js'
import { getActiveLocale } from '../i18n/state.js'
import { DEFAULT_LOCALE } from '../i18n/locales.js'

export function getServices(locale = getActiveLocale()) {
  return getCatalog(locale).services
}

export function getServiceGroups(locale = getActiveLocale()) {
  return getCatalog(locale).serviceGroups
}

export const services = getCatalog(DEFAULT_LOCALE).services
export const serviceGroups = getCatalog(DEFAULT_LOCALE).serviceGroups
