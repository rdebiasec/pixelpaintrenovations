import { getCatalog } from '../i18n/catalog.js'
import { getActiveLocale } from '../i18n/state.js'
import { DEFAULT_LOCALE } from '../i18n/locales.js'

export function getWarranty(locale = getActiveLocale()) {
  return getCatalog(locale).warranty
}

const enWarranty = getCatalog(DEFAULT_LOCALE).warranty

export const WARRANTY_HEADLINE = enWarranty.headline
export const WARRANTY_SUMMARY = enWarranty.summary
export const WARRANTY_QUOTE_NOTE = enWarranty.quoteNote
export const WARRANTY_FOOTER_LINE = enWarranty.footerLine
export const WARRANTY_STRIP_TEXT = enWarranty.stripText
export const WARRANTY_TERMS_PLACEHOLDER = enWarranty.terms
