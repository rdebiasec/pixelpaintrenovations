/** Supported locales for the marketing site (BCP-47 + URL prefixes). */

export const DEFAULT_LOCALE = 'en'

/** @typedef {{ id: string, hreflang: string, ogLocale: string, pathPrefix: string, htmlLang: string, label: string, flag: string, name: string }} LocaleDef */

/** @type {LocaleDef[]} */
export const LOCALES = [
  {
    id: 'en',
    hreflang: 'en',
    ogLocale: 'en_US',
    pathPrefix: '',
    htmlLang: 'en',
    label: 'EN',
    flag: '🇺🇸',
    name: 'English'
  },
  {
    id: 'es',
    hreflang: 'es',
    ogLocale: 'es_US',
    pathPrefix: 'es',
    htmlLang: 'es',
    label: 'ES',
    flag: '🇨🇴',
    name: 'Español'
  },
  {
    id: 'pt-BR',
    hreflang: 'pt-BR',
    ogLocale: 'pt_BR',
    pathPrefix: 'pt-br',
    htmlLang: 'pt-BR',
    label: 'PT-BR',
    flag: '🇧🇷',
    name: 'Português'
  }
]

export const LOCALE_BY_ID = Object.fromEntries(LOCALES.map((locale) => [locale.id, locale]))

export const LOCALE_BY_PREFIX = Object.fromEntries(
  LOCALES.filter((locale) => locale.pathPrefix).map((locale) => [locale.pathPrefix, locale])
)

export function getLocaleDef(localeId = DEFAULT_LOCALE) {
  return LOCALE_BY_ID[localeId] || LOCALE_BY_ID[DEFAULT_LOCALE]
}

export function localePathPrefix(localeId = DEFAULT_LOCALE) {
  const prefix = getLocaleDef(localeId).pathPrefix
  return prefix ? `${prefix}/` : ''
}
