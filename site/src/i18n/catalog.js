import { DEFAULT_LOCALE, getLocaleDef } from './locales.js'
import { getActiveLocale } from './state.js'
import en from './catalogs/en.json' with { type: 'json' }
import es from './catalogs/es.json' with { type: 'json' }
import ptBR from './catalogs/pt-BR.json' with { type: 'json' }

const CATALOGS = {
  en,
  es,
  'pt-BR': ptBR
}

export function getCatalog(localeId = getActiveLocale()) {
  const id = getLocaleDef(localeId).id
  return CATALOGS[id] || CATALOGS[DEFAULT_LOCALE]
}

/**
 * Resolve a dotted key from the active (or given) catalog, with English fallback.
 * @param {string} key
 * @param {string} [localeId]
 */
export function t(key, localeId = getActiveLocale()) {
  const primary = lookup(getCatalog(localeId), key)
  if (primary !== undefined) return primary
  if (localeId !== DEFAULT_LOCALE) {
    const fallback = lookup(getCatalog(DEFAULT_LOCALE), key)
    if (fallback !== undefined) return fallback
  }
  return key
}

function lookup(obj, key) {
  return key.split('.').reduce((acc, part) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return acc[part]
  }, obj)
}
