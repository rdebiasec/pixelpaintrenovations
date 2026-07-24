import { getCatalog } from '../i18n/catalog.js'
import { getActiveLocale } from '../i18n/state.js'
import { DEFAULT_LOCALE } from '../i18n/locales.js'
import { OG_IMAGE } from '../legal/constants.js'

/** HTML shell paths keyed to page entries — used by generate-seo.mjs */
export const seoRoutes = [
  { pageKey: 'home', html: 'index.html' },
  { pageKey: 'servicesPage', html: 'services/index.html' },
  { pageKey: 'kitchenPage', html: 'kitchen-renovations/index.html' },
  { pageKey: 'bathroomPage', html: 'bathroom-renovations/index.html' },
  { pageKey: 'projectsPage', html: 'projects/index.html' },
  { pageKey: 'aboutPage', html: 'about/index.html' },
  { pageKey: 'contactPage', html: 'contact/index.html' },
  { pageKey: 'privacyPage', html: 'privacy/index.html' }
]

export function getPages(locale = getActiveLocale()) {
  return getCatalog(locale).pages
}

export const pages = getCatalog(DEFAULT_LOCALE).pages

export function getSeoRoutes(locale = DEFAULT_LOCALE) {
  const pageMap = getPages(locale)
  return seoRoutes.map(({ pageKey, html }) => {
    const page = pageMap[pageKey]
    return {
      pageKey,
      html,
      path: page.path,
      title: page.title,
      description: page.description,
      ogImage: page.ogImage || OG_IMAGE
    }
  })
}
