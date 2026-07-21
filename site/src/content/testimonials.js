import { getCatalog } from '../i18n/catalog.js'
import { getActiveLocale } from '../i18n/state.js'
import { DEFAULT_LOCALE } from '../i18n/locales.js'

export function getTestimonials(locale = getActiveLocale()) {
  return getCatalog(locale).testimonials
}

/** Quotes stay in original English across locales; service labels may be localized. */
export const testimonials = getCatalog(DEFAULT_LOCALE).testimonials
