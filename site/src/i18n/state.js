import { DEFAULT_LOCALE, getLocaleDef } from './locales.js'

let activeLocale = DEFAULT_LOCALE

export function setActiveLocale(localeId) {
  activeLocale = getLocaleDef(localeId).id
  return activeLocale
}

export function getActiveLocale() {
  return activeLocale
}
