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
} from '../src/legal/constants.js'
import { getSeoRoutes } from '../src/content/pages.js'
import { services } from '../src/content/services.js'
import { testimonials } from '../src/content/testimonials.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteRoot = resolve(__dirname, '..')
const publicDir = resolve(siteRoot, 'public')

const routes = getSeoRoutes()

function pageUrl(path) {
  return path ? `${SITE_URL}/${path.replace(/\/$/, '')}/` : `${SITE_URL}/`
}

function localBusinessSchema() {
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
      name: 'Painting and renovation services',
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

function buildSeoBlock(route) {
  const canonical = pageUrl(route.path)
  const ogImage = `${SITE_URL}/${OG_IMAGE}`
  const schema = JSON.stringify(localBusinessSchema())
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
    "frame-src 'self' https://www.google.com https://www.google.com/maps",
    'upgrade-insecure-requests'
  ].join('; ')

  return [
    `    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
    '    <meta name="referrer" content="strict-origin-when-cross-origin" />',
    '    <meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()" />',
    `    <link rel="canonical" href="${canonical}" />`,
    `    <meta property="og:title" content="${route.title}" />`,
    `    <meta property="og:description" content="${route.description}" />`,
    `    <meta property="og:image" content="${ogImage}" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:site_name" content="${COMPANY_LEGAL_NAME}" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${route.title}" />`,
    `    <meta name="twitter:description" content="${route.description}" />`,
    `    <meta name="twitter:image" content="${ogImage}" />`,
    schemaScript
  ].join('\n')
}

function stripLegacySeo(html) {
  let out = html
  out = out.replace(/\s*<!-- seo:generated -->[\s\S]*?<!-- \/seo:generated -->\n?/g, '\n')
  out = out.replace(/\s*<link rel="canonical"[^>]*\/>\n?/g, '\n')
  out = out.replace(/\s*<meta property="og:[^"]*"[^>]*\/>\n?/g, '\n')
  out = out.replace(/\s*<meta name="twitter:[^"]*"[^>]*\/>\n?/g, '\n')
  out = out.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '\n')
  return out
}

async function patchHtmlShell(route) {
  const filePath = resolve(siteRoot, route.html)
  let html = stripLegacySeo(await readFile(filePath, 'utf8'))

  html = html.replace(/<link rel="icon" href="[^"]*" type="image\/png" \/>/, '<link rel="icon" href="%BASE_URL%favicon.png" type="image/png" />')
  html = html.replace(/<div id="app" role="main"><\/div>/, '<div id="app"></div>')

  const seoBlock = buildSeoBlock(route)
  const seoMarker = '<!-- seo:generated -->'
  const seoInsert = '    ' + seoMarker + '\n' + seoBlock + '\n    <!-- /seo:generated -->'

  if (/<meta\s+name="description"[\s\S]*?\/>/.test(html)) {
    html = html.replace(/(<meta\s+name="description"[\s\S]*?\/>)/, (_, meta) => `${meta}\n${seoInsert}`)
  } else {
    html = html.replace(/(<meta name="theme-color"[^>]*\/>)/, (_, meta) => `${meta}\n${seoInsert}`)
  }

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${route.description}" />`
  )

  await writeFile(filePath, html)
}

async function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${pageUrl(route.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route.path === '' ? '1.0' : route.path === 'privacy/' ? '0.3' : '0.8'}</priority>
  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
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
  for (const route of routes) {
    await patchHtmlShell(route)
  }
  await writeSitemap()
  await writeRobots()
  console.log(`SEO: patched ${routes.length} HTML shells, wrote sitemap.xml and robots.txt (${SITE_URL})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
