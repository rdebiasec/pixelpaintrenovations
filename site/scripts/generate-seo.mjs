import { readFile, writeFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  SITE_URL,
  OG_IMAGE,
  COMPANY_LEGAL_NAME,
  CONTACT_PHONE_TEL,
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  FACEBOOK_URL
} from '../src/brand/config.js'
import { getSeoRoutes, seoRoutes } from '../src/content/pages.js'
import { getServices } from '../src/content/services.js'
import { getTestimonials } from '../src/content/testimonials.js'
import { getCatalog } from '../src/i18n/catalog.js'
import { LOCALES, DEFAULT_LOCALE, getLocaleDef, localePathPrefix } from '../src/i18n/locales.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteRoot = resolve(__dirname, '..')
const publicDir = resolve(siteRoot, 'public')

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function localePageUrl(pagePath, localeId) {
  const prefix = localePathPrefix(localeId)
  const clean = (pagePath || '').replace(/^\//, '').replace(/\/$/, '')
  if (!clean) {
    return prefix ? `${SITE_URL}/${prefix.replace(/\/$/, '')}/` : `${SITE_URL}/`
  }
  return `${SITE_URL}/${prefix}${clean}/`
}

function htmlPathFor(routeHtml, localeId) {
  const locale = getLocaleDef(localeId)
  if (!locale.pathPrefix) return routeHtml
  return `${locale.pathPrefix}/${routeHtml}`
}

function localBusinessSchema(localeId) {
  const services = getServices(localeId)
  const testimonials = getTestimonials(localeId)
  const catalogName = getCatalog(localeId).ui.schemaOfferCatalog
  return {
    '@context': 'https://schema.org',
    '@type': 'HousePainter',
    name: COMPANY_LEGAL_NAME,
    url: SITE_URL,
    telephone: CONTACT_PHONE_TEL,
    email: CONTACT_EMAIL,
    image: `${SITE_URL}/${OG_IMAGE}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lake Nona',
      addressRegion: 'FL',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.3683,
      longitude: -81.2762
    },
    areaServed: ['Lake Nona', 'Orlando', 'Central Florida'],
    priceRange: String.fromCharCode(36, 36),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: String(testimonials.length),
      bestRating: '5'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: catalogName,
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.body,
          areaServed: 'Central Florida'
        }
      }))
    },
    review: testimonials.slice(0, 3).map((item) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: item.name },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: item.quote
    })),
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL]
  }
}

function hreflangLinks(pagePath) {
  const links = LOCALES.map((locale) => {
    const href = localePageUrl(pagePath, locale.id)
    return `    <link rel="alternate" hreflang="${locale.hreflang}" href="${href}" />`
  })
  links.push(`    <link rel="alternate" hreflang="x-default" href="${localePageUrl(pagePath, DEFAULT_LOCALE)}" />`)
  return links
}

function buildSeoBlock(route, localeId) {
  const locale = getLocaleDef(localeId)
  const canonical = localePageUrl(route.path, localeId)
  const ogImage = `${SITE_URL}/${OG_IMAGE}`
  const schema = JSON.stringify(localBusinessSchema(localeId))
  const schemaScript = '    <script type="application/ld+json">' + schema + '</script>'
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "img-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "script-src 'self' https://plausible.io https://www.googletagmanager.com",
    "connect-src 'self' https://formspree.io https://plausible.io https://www.google-analytics.com https://region1.google-analytics.com",
    "form-action 'self' https://formspree.io",
    "frame-src 'self' https://www.google.com https://www.google.com/maps",
    'upgrade-insecure-requests'
  ].join('; ')

  const alternateLocales = LOCALES.filter((item) => item.id !== localeId)
    .map((item) => `    <meta property="og:locale:alternate" content="${item.ogLocale}" />`)
    .join('\n')

  return [
    `    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
    '    <meta name="referrer" content="strict-origin-when-cross-origin" />',
    '    <meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()" />',
    `    <link rel="canonical" href="${canonical}" />`,
    ...hreflangLinks(route.path),
    `    <meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `    <meta property="og:description" content="${escapeAttr(route.description)}" />`,
    `    <meta property="og:image" content="${ogImage}" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:site_name" content="${escapeAttr(COMPANY_LEGAL_NAME)}" />`,
    `    <meta property="og:locale" content="${locale.ogLocale}" />`,
    alternateLocales,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `    <meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `    <meta name="twitter:image" content="${ogImage}" />`,
    schemaScript
  ]
    .filter(Boolean)
    .join('\n')
}

function stripLegacySeo(html) {
  let out = html
  out = out.replace(/\s*<!-- seo:generated -->[\s\S]*?<!-- \/seo:generated -->\n?/g, '\n')
  out = out.replace(/\s*<link rel="canonical"[^>]*\/>\n?/g, '\n')
  out = out.replace(/\s*<link rel="alternate"[^>]*\/>\n?/g, '\n')
  out = out.replace(/\s*<meta property="og:[^"]*"[^>]*\/>\n?/g, '\n')
  out = out.replace(/\s*<meta name="twitter:[^"]*"[^>]*\/>\n?/g, '\n')
  out = out.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '\n')
  return out
}

async function patchHtmlShell(route, localeId) {
  const relativeHtml = htmlPathFor(route.html, localeId)
  const filePath = resolve(siteRoot, relativeHtml)
  let html = stripLegacySeo(await readFile(filePath, 'utf8'))
  const locale = getLocaleDef(localeId)

  html = html.replace(/<html\b[^>]*>/, `<html lang="${locale.htmlLang}" data-locale="${locale.id}">`)
  html = html.replace(
    /<link rel="icon" href="[^"]*" type="image\/png" \/>/,
    '<link rel="icon" href="%BASE_URL%favicon.png" type="image/png" />'
  )
  html = html.replace(/<div id="app" role="main"><\/div>/, '<div id="app"></div>')

  const seoBlock = buildSeoBlock(route, localeId)
  const seoMarker = '<!-- seo:generated -->'
  const seoInsert = '    ' + seoMarker + '\n' + seoBlock + '\n    <!-- /seo:generated -->'

  if (/<meta\s+name="description"[\s\S]*?\/>/.test(html)) {
    html = html.replace(/(<meta\s+name="description"[\s\S]*?\/>)/, (_, meta) => `${meta}\n${seoInsert}`)
  } else {
    html = html.replace(/(<meta name="theme-color"[^>]*\/>)/, (_, meta) => `${meta}\n${seoInsert}`)
  }

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(route.title)}</title>`)
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escapeAttr(route.description)}" />`
  )

  await writeFile(filePath, html)
}

async function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const urlBlocks = seoRoutes
    .map(({ pageKey, html }) => {
      const path = getSeoRoutes(DEFAULT_LOCALE).find((route) => route.pageKey === pageKey)?.path ?? ''
      const alternates = LOCALES.map(
        (locale) =>
          `    <xhtml:link rel="alternate" hreflang="${locale.hreflang}" href="${localePageUrl(path, locale.id)}" />`
      ).join('\n')
      const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${localePageUrl(path, DEFAULT_LOCALE)}" />`
      return LOCALES.map((locale) => {
        const priority = path === '' ? '1.0' : path === 'privacy/' ? '0.3' : '0.8'
        return `  <url>
    <loc>${localePageUrl(path, locale.id)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
${alternates}
${xDefault}
  </url>`
      }).join('\n')
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks}
</urlset>
`

  await writeFile(resolve(publicDir, 'sitemap.xml'), xml)
}

async function writeRobots() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
  await writeFile(resolve(publicDir, 'robots.txt'), robots)
}

async function main() {
  let patched = 0
  for (const locale of LOCALES) {
    const routes = getSeoRoutes(locale.id)
    for (const route of routes) {
      await patchHtmlShell(route, locale.id)
      patched += 1
    }
  }
  await writeSitemap()
  await writeRobots()
  console.log(`SEO: patched ${patched} HTML shells across ${LOCALES.length} locales, wrote sitemap.xml and robots.txt (${SITE_URL})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
