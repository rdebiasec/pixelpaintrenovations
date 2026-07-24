import { getCatalog } from '../i18n/catalog.js'
import { getActiveLocale } from '../i18n/state.js'
import { DEFAULT_LOCALE } from '../i18n/locales.js'

export function getProcessSteps(locale = getActiveLocale()) {
  return getCatalog(locale).processSteps
}

export const processSteps = getCatalog(DEFAULT_LOCALE).processSteps
