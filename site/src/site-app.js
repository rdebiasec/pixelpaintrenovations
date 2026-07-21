import './style.css'
import {
  href,
  absoluteUrl,
  absoluteLocaleUrl,
  COMPANY_LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  SITE_URL,
  OG_IMAGE,
  HERO_IMAGE
} from './legal/constants.js'
import {
  getNav,
  getServiceSubnav,
  getServices,
  getServiceGroups,
  getTestimonials,
  getProjectShowcase,
  getWhyChooseUs,
  getServiceAreas,
  getProcessSteps,
  getPages,
  getWarranty
} from './content/index.js'
import { getCatalog } from './i18n/catalog.js'
import { detectLocale, localizedPathFor } from './i18n/detect.js'
import { LOCALES, getLocaleDef } from './i18n/locales.js'
import { getActiveLocale, setActiveLocale } from './i18n/state.js'
import { initAnalytics, trackEvent } from './analytics.js'
import { escapeHtml } from './security/html.js'
import { renderQuoteFormInner, bindForm } from './forms/quote-form.js'

function ui() {
  return getCatalog().ui
}

function formCopy() {
  return getCatalog().form
}

function privacyCopy() {
  return getCatalog().privacy
}

function warranty() {
  return getWarranty()
}

function upsertMeta(attr, key, content) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setMeta(page) {
  const locale = getActiveLocale()
  const localeDef = getLocaleDef(locale)
  document.title = page.title
  document.documentElement.lang = localeDef.htmlLang
  document.documentElement.setAttribute('data-locale', locale)

  const description = page.description
  upsertMeta('name', 'description', description)

  const ogImage = absoluteUrl(page.ogImage || OG_IMAGE, { asset: true })
  const ogUrl = absoluteLocaleUrl(page.path || '', locale)
  upsertLink('canonical', ogUrl)
  upsertMeta('property', 'og:title', page.title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:image', ogImage)
  upsertMeta('property', 'og:url', ogUrl)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', COMPANY_LEGAL_NAME)
  upsertMeta('property', 'og:locale', localeDef.ogLocale)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', page.title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', ogImage)
}

function injectLocalBusinessSchema() {
  if (document.getElementById('local-business-schema')) return
  const services = getServices()
  const testimonials = getTestimonials()
  const script = document.createElement('script')
  script.id = 'local-business-schema'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HousePainter',
    name: COMPANY_LEGAL_NAME,
    url: SITE_URL,
    telephone: CONTACT_PHONE_TEL,
    email: CONTACT_EMAIL,
    image: absoluteUrl('logo.png', { asset: true }),
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
      name: ui().schemaOfferCatalog,
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
  })
  document.head.appendChild(script)
}

function route(path) {
  if (!path) return href('')
  if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) return path
  return href(path)
}

function renderPrimaryAction(label, path = 'contact/') {
  return `
    <div class="actions">
      <a class="btn btn-primary" href="${escapeHtml(route(path))}">${escapeHtml(label || ui().getFreeQuote)}</a>
    </div>
  `
}

function renderLangSwitcher() {
  const current = getActiveLocale()
  const hash = typeof location !== 'undefined' ? location.hash : ''
  const pathname = typeof location !== 'undefined' ? location.pathname : '/'
  const base = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL || '/' : '/'
  const links = LOCALES.map((locale) => {
    const hrefLang = localizedPathFor(locale.id, pathname, hash, base)
    const currentAttr = locale.id === current ? ' aria-current="true"' : ''
    return `<a href="${escapeHtml(hrefLang)}" hreflang="${escapeHtml(locale.hreflang)}" lang="${escapeHtml(locale.htmlLang)}"${currentAttr}>${escapeHtml(locale.label)}</a>`
  }).join('<span class="lang-switcher-sep" aria-hidden="true">|</span>')
  return `
    <nav class="lang-switcher" aria-label="${escapeHtml(ui().langSwitcherAria)}">
      ${links}
    </nav>
  `
}

function renderActions(primaryLabel, primaryHref, secondaryLabel, secondaryHref) {
  const primary = route(primaryHref || 'contact/')
  const secondary = secondaryHref ? route(secondaryHref) : ''
  return `
    <div class="actions">
      <a class="btn btn-primary" href="${escapeHtml(primary)}"${attrsForExternal(primary)}>${escapeHtml(primaryLabel)}</a>
      ${
        secondaryLabel
          ? `<a class="btn btn-secondary" href="${escapeHtml(secondary)}"${attrsForExternal(secondary)}>${escapeHtml(secondaryLabel)}</a>`
          : ''
      }
    </div>
  `
}

function attrsForExternal(url) {
  return url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')
    ? url.startsWith('http')
      ? ' target="_blank" rel="noopener noreferrer"'
      : ''
    : ''
}

function renderServiceSubnav(pageKey) {
  const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : ''
  const links = getServiceSubnav()
    .map((item) => {
      const isCurrent = item.page === pageKey && (!item.anchor || hash === item.anchor)
      return `<a href="${escapeHtml(href(item.path))}"${isCurrent ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`
    })
    .join('')
  return `
    <div class="service-subnav" aria-label="${escapeHtml(ui().specialtyServices)}">
      <div class="service-subnav-inner">
        <span class="service-subnav-label">${escapeHtml(ui().popularServices)}</span>
        <div class="service-subnav-links">
          ${links}
        </div>
      </div>
    </div>
  `
}

function renderHeader(pageKey) {
  const copy = ui()
  return `
    <a class="skip-link" href="#main-content">${escapeHtml(copy.skipToContent)}</a>
    <header class="site-header">
      <div class="header-brand">
        <a href="${escapeHtml(href(''))}" class="logo" aria-label="${escapeHtml(COMPANY_LEGAL_NAME)} ${escapeHtml(copy.logoHomeAriaSuffix)}">
          <img src="${escapeHtml(href('logo.png'))}" alt="${escapeHtml(COMPANY_LEGAL_NAME)}" />
        </a>
      </div>
      <nav id="primary-nav" aria-label="${escapeHtml(copy.primaryNav)}">
        ${getNav()
          .map(
            (item) =>
              `<a href="${escapeHtml(href(item.path))}" ${item.page === pageKey ? 'aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`
          )
          .join('')}
      </nav>
      <div class="header-actions">
        ${renderLangSwitcher()}
        <a class="header-phone" href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_header">${escapeHtml(CONTACT_PHONE_DISPLAY)}</a>
      </div>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
        <span class="sr-only">${escapeHtml(copy.toggleNav)}</span>
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
      </button>
    </header>
  `
}

function sectionHeading(eyebrow, title, body) {
  return `
    <div class="section-heading">
      ${eyebrow ? `<span class="eyebrow">${escapeHtml(eyebrow)}</span>` : ''}
      <h2>${escapeHtml(title)}</h2>
      ${body ? `<p>${escapeHtml(body)}</p>` : ''}
    </div>
  `
}

function renderHero(page, pageKey) {
  const copy = ui()
  if (pageKey === 'home') {
    return `
      <section class="hero home-hero" id="top">
        <div class="hero-shell">
          <div class="hero-banner">
            <img src="${escapeHtml(href(HERO_IMAGE))}" alt="${escapeHtml(copy.heroAlt)}" />
          </div>
          <div class="hero-split">
            <div class="hero-copy-primary">
              <span class="eyebrow">${escapeHtml(page.hero.eyebrow)}</span>
              <h1>${escapeHtml(page.hero.headline)}</h1>
              <p class="hero-proof"><span aria-hidden="true">★</span> <a href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.neighborReviews)}</a> · <a href="#warranty">${escapeHtml(copy.writtenWarranty)}</a> · ${escapeHtml(copy.freeEstimates)}</p>
              ${page.hero.lead ? `<p class="hero-lead">${escapeHtml(page.hero.lead)}</p>` : ''}
            </div>
            <aside class="hero-form-panel hero-panel hero-panel-form" id="quote">
              ${renderQuoteFormInner(formCopy().title, true)}
            </aside>
            <div class="hero-copy-secondary">
              ${page.hero.body ? `<p class="hero-body">${escapeHtml(page.hero.body)}</p>` : ''}
              ${
                page.hero.highlights?.length
                  ? `<ul class="hero-highlights">${page.hero.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
                  : ''
              }
              <p class="hero-trust">${escapeHtml(page.hero.microcopy)} · <a href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_hero">${escapeHtml(copy.callPrefix)} ${escapeHtml(CONTACT_PHONE_DISPLAY)}</a></p>
            </div>
          </div>
        </div>
      </section>
    `
  }

  if (pageKey === 'servicesPage' || pageKey === 'projectsPage' || pageKey === 'contactPage') {
    const proofSuffix =
      pageKey === 'servicesPage'
        ? copy.proofServices
        : pageKey === 'projectsPage'
          ? copy.proofProjects
          : copy.proofContact
    const statsLabel =
      pageKey === 'servicesPage'
        ? copy.statsServices
        : pageKey === 'projectsPage'
          ? copy.statsProjects
          : copy.statsContact

    const marketingHeroClass =
      pageKey === 'projectsPage'
        ? 'hero page-hero page-hero-marketing page-hero-projects'
        : pageKey === 'servicesPage'
          ? 'hero page-hero page-hero-marketing page-hero-services'
          : pageKey === 'contactPage'
            ? 'hero page-hero page-hero-marketing page-hero-contact'
            : 'hero page-hero page-hero-marketing'

    return `
      <section class="${marketingHeroClass}" id="top">
        <div class="hero-copy">
          <span class="eyebrow">${escapeHtml(page.hero.eyebrow)}</span>
          <h1>${escapeHtml(page.hero.headline)}</h1>
          <p class="hero-proof"><span aria-hidden="true">★</span> <a href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.neighborReviews)}</a> · <a href="${escapeHtml(route(''))}#warranty">${escapeHtml(copy.writtenWarranty)}</a> · ${escapeHtml(proofSuffix)}</p>
          ${page.hero.lead ? `<p class="hero-lead">${escapeHtml(page.hero.lead)}</p>` : ''}
          ${page.hero.body ? `<p class="hero-body">${escapeHtml(page.hero.body)}</p>` : ''}
          ${
            page.hero.stats?.length
              ? `<ul class="hero-stats" aria-label="${escapeHtml(statsLabel)}">${page.hero.stats
                  .map(
                    (stat) =>
                      `<li class="hero-stat"><strong>${escapeHtml(stat.label)}</strong><span>${escapeHtml(stat.detail)}</span></li>`
                  )
                  .join('')}</ul>`
              : ''
          }
          ${
            page.hero.trust
              ? `<p class="hero-trust">${escapeHtml(page.hero.trust)} · <a href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_hero">${escapeHtml(copy.callPrefix)} ${escapeHtml(CONTACT_PHONE_DISPLAY)}</a></p>`
              : ''
          }
        </div>
      </section>
    `
  }

  if (pageKey === 'aboutPage') {
    return `
      <section class="hero page-hero page-hero-about" id="top">
        <div class="hero-copy">
          <span class="eyebrow">${escapeHtml(page.hero.eyebrow)}</span>
          <h1>${escapeHtml(page.hero.headline)}</h1>
          <p class="hero-proof"><span aria-hidden="true">★</span> <a href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.neighborReviews)}</a> · ${escapeHtml(copy.referralDriven)} · <a href="${escapeHtml(route(''))}#warranty">${escapeHtml(copy.writtenWarranty)}</a></p>
          ${page.hero.lead ? `<p class="hero-lead">${escapeHtml(page.hero.lead)}</p>` : ''}
          ${page.hero.body ? `<p class="hero-body">${escapeHtml(page.hero.body)}</p>` : ''}
          ${
            page.hero.stats?.length
              ? `<ul class="hero-stats" aria-label="${escapeHtml(copy.statsAbout)}">${page.hero.stats
                  .map(
                    (stat) =>
                      `<li class="hero-stat"><strong>${escapeHtml(stat.label)}</strong><span>${escapeHtml(stat.detail)}</span></li>`
                  )
                  .join('')}</ul>`
              : ''
          }
          ${
            page.hero.trust
              ? `<p class="hero-trust">${escapeHtml(page.hero.trust)} · <a href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_hero">${escapeHtml(copy.callPrefix)} ${escapeHtml(CONTACT_PHONE_DISPLAY)}</a></p>`
              : ''
          }
        </div>
      </section>
    `
  }

  return `
    <section class="hero page-hero" id="top">
      <div class="hero-copy">
        <span class="eyebrow">${escapeHtml(page.hero.eyebrow)}</span>
        <h1>${escapeHtml(page.hero.headline)}</h1>
        <p>${escapeHtml(page.hero.body)}</p>
        ${
          page.hero.primary
            ? page.hero.secondary && page.hero.secondaryHref
              ? renderActions(
                  page.hero.primary,
                  page.hero.primaryHref || 'contact/',
                  page.hero.secondary,
                  page.hero.secondaryHref
                )
              : renderPrimaryAction(page.hero.primary, page.hero.primaryHref || 'contact/')
            : ''
        }
      </div>
    </section>
  `
}

function renderQuoteForm() {
  const copy = ui()
  return `
    <section id="quote" class="quote-section">
      <div class="quote-layout">
        ${sectionHeading(copy.quoteSectionEyebrow, copy.quoteSectionTitle, copy.quoteSectionBody)}
        ${renderQuoteFormInner(formCopy().title)}
      </div>
    </section>
  `
}

const accentClasses = ['service-accent-blue', 'service-accent-magenta', 'service-accent-yellow']

function renderServiceCard(index, featured = false) {
  const service = getServices()[index]
  const accent = accentClasses[index % 3]
  const idAttr = service.anchor ? ` id="${escapeHtml(service.anchor)}"` : ''
  const media = service.image
    ? `<div class="service-card-media"><img src="${escapeHtml(href(service.image))}" alt="${escapeHtml(service.imageAlt || service.title)}" loading="lazy" decoding="async" /></div>`
    : ''
  return `
    <article class="service-card ${accent}${featured ? ' service-card-featured' : ''}"${idAttr}>
      ${media}
      <span class="service-icon service-icon-${(index % 4) + 1}" aria-hidden="true"></span>
      <h3>${escapeHtml(service.title)}</h3>
      <p>${escapeHtml(service.body)}</p>
      ${service.learnHref ? `<a class="learn-link" href="${escapeHtml(route(service.learnHref))}">${escapeHtml(ui().learnMore)}</a>` : ''}
    </article>`
}

function defaultServicesHeading() {
  const copy = ui()
  return {
    eyebrow: copy.servicesDefaultEyebrow,
    title: copy.servicesDefaultTitle,
    body: copy.servicesDefaultBody
  }
}

function renderServices(block = {}) {
  const full = typeof block === 'boolean' ? block : Boolean(block.full)
  const heading = typeof block === 'object' && block.heading ? block.heading : defaultServicesHeading()
  const services = getServices()
  const serviceGroups = getServiceGroups()

  if (full) {
    return `
      <section id="services" class="services-catalog">
        ${sectionHeading(heading.eyebrow, heading.title, heading.body)}
        ${serviceGroups
          .map(
            (group) => `
          <div class="services-group">
            <h3 class="services-subheading">${escapeHtml(group.title)}</h3>
            <div class="services-grid services-grid-full">
              ${group.indices.map((index) => renderServiceCard(index)).join('')}
            </div>
          </div>`
          )
          .join('')}
        <div class="section-actions"><a class="text-link" href="${escapeHtml(href('contact/'))}">${escapeHtml(ui().getFreeQuote)}</a></div>
      </section>
    `
  }

  return `
    <section id="services">
      ${sectionHeading(heading.eyebrow, heading.title, heading.body)}
      <div class="services-grid services-bento">
        ${services
          .map((service, index) => renderServiceCard(index, index <= 3))
          .join('')}
      </div>
    </section>
  `
}

function renderSocialGalleryIntro() {
  const copy = ui()
  return `
    <section class="gallery-intro">
      ${sectionHeading(copy.socialEyebrow, copy.socialTitle, copy.socialBody)}
      <div class="social-gallery-actions">
        <a class="text-link" href="${escapeHtml(INSTAGRAM_URL)}" target="_blank" rel="noopener noreferrer" data-track="social_instagram">${escapeHtml(copy.viewInstagram)}</a>
        <a class="text-link" href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer" data-track="social_facebook">${escapeHtml(copy.viewFacebook)}</a>
      </div>
    </section>
  `
}

function getProjectItems(block) {
  let pool = getProjectShowcase()
  if (block.filter) {
    pool = pool.filter((item) => item.tags?.includes(block.filter))
  }

  const limit = block.limit || pool.length
  if (block.layout === 'featured' && limit <= pool.length) {
    const featuredIndex = pool.findIndex((item) => item.tags?.includes('kitchen'))
    const pick = featuredIndex >= 0 ? featuredIndex : 1
    const order = [pick, ...pool.map((_, i) => i).filter((i) => i !== pick)]
    return order.slice(0, limit).map((i) => pool[i])
  }
  return pool.slice(0, limit)
}

function renderProjectCard(item, options = {}) {
  const { featured = false, accentIndex = 0 } = options
  const alt = item.alt || item.title
  const location = item.location
    ? `<span class="project-location">${escapeHtml(item.location)}</span>`
    : ''
  const caption = item.caption ? `<p class="project-caption">${escapeHtml(item.caption)}</p>` : ''
  return `
    <article class="project-card project-card-accent-${accentIndex % 3}${featured ? ' project-card-featured' : ''}">
      <div class="project-card-media">
        <img src="${escapeHtml(href(item.image))}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" />
        ${location}
      </div>
      <div class="project-card-body">
        <h3>${escapeHtml(item.title)}</h3>
        ${caption}
        <p>${escapeHtml(item.body)}</p>
      </div>
    </article>`
}

function defaultProjectShowcaseHeading() {
  const copy = ui()
  return {
    eyebrow: copy.projectsEyebrow,
    title: copy.projectsTitle,
    body: copy.projectsBodyHome
  }
}

function fullProjectShowcaseHeading() {
  const copy = ui()
  return {
    eyebrow: copy.projectsEyebrow,
    title: copy.projectsTitle,
    body: copy.projectsBodyFull
  }
}

function renderProjectShowcase(block) {
  const items = getProjectItems(block)
  const isFeatured = block.layout === 'featured'
  const defaultHeading = block.full ? fullProjectShowcaseHeading() : defaultProjectShowcaseHeading()
  const heading = block.heading ? block.heading : defaultHeading

  return `
    <section id="projects" class="projects-section${block.full ? ' projects-catalog' : ''}">
      ${sectionHeading(heading.eyebrow, heading.title, heading.body)}
      <div class="projects-grid${isFeatured ? ' projects-featured' : ''}">
        ${items
          .map((item, index) =>
            renderProjectCard(item, { featured: isFeatured && index === 0, accentIndex: index })
          )
          .join('')}
      </div>
      ${
        block.full
          ? ''
          : `<div class="section-actions"><a class="text-link" href="${escapeHtml(href('projects/'))}">${escapeHtml(ui().viewAllProjects)}</a></div>`
      }
    </section>
  `
}

function renderProcessSteps() {
  const copy = ui()
  return `
    <section id="process" class="process-section">
      ${sectionHeading(copy.processEyebrow, copy.processTitle, copy.processBody)}
      <ol class="process-grid">
        ${getProcessSteps()
          .map(
            (step, index) => `
          <li class="process-step">
            <span class="process-step-num" aria-hidden="true">${index + 1}</span>
            <h3>${escapeHtml(step.title)}</h3>
            <p>${escapeHtml(step.body)}</p>
          </li>`
          )
          .join('')}
      </ol>
    </section>
  `
}

function renderBenefits() {
  const copy = ui()
  return `
    <section id="why-us">
      ${sectionHeading(copy.benefitsEyebrow, copy.benefitsTitle, copy.benefitsBody)}
      <div class="benefit-grid">
        ${getWhyChooseUs()
          .map(
            ([title, body]) => `
              <article class="content-card">
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(body)}</p>
              </article>`
          )
          .join('')}
      </div>
    </section>
  `
}

function renderServiceAreas() {
  const copy = ui()
  return `
    <section id="areas">
      ${sectionHeading(copy.areasEyebrow, copy.areasTitle, copy.areasBody)}
      <div class="areas-grid">
        ${getServiceAreas()
          .map(
            (group) => `
              <article class="area-card">
                <h3>${escapeHtml(group.title)}</h3>
                <ul>${group.areas.map((area) => `<li>${escapeHtml(area)}</li>`).join('')}</ul>
              </article>`
          )
          .join('')}
      </div>
    </section>
  `
}

const EXCLUDED_REVIEWER_NAMES = ['Ricardo De Biase']

function isExcludedReviewer(name) {
  return EXCLUDED_REVIEWER_NAMES.some((excluded) =>
    name.toLowerCase().includes(excluded.toLowerCase())
  )
}

function renderReviewCard(item, { source } = {}) {
  const reviewSource = item.source || source
  const sourceLabel = reviewSource
    ? `<span class="review-source">${escapeHtml(reviewSource)} review</span>`
    : ''

  return `
    <article class="review-card">
      ${sourceLabel}
      <div class="review-stars" aria-label="5 out of 5 stars"><span aria-hidden="true">★★★★★</span></div>
      <blockquote>${escapeHtml(item.quote)}</blockquote>
      <footer>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.service)}</span>
      </footer>
    </article>`
}

function renderTestimonials(block) {
  const copy = ui()
  const testimonials = getTestimonials()
  const limit = block.limit || testimonials.length
  const filter = block.filter
  let items = testimonials.filter(
    (item) =>
      !isExcludedReviewer(item.name) &&
      (!filter || item.service.toLowerCase().includes(filter.toLowerCase()))
  )

  const gridClasses = ['reviews-grid', 'reviews-carousel']
  if (block.columns === 3) {
    gridClasses.push('reviews-grid-3')
  }

  if (block.featured) {
    const featuredIndex = items.findIndex((item) => item.name === 'Larry Truong')
    const featured = featuredIndex >= 0 ? items.splice(featuredIndex, 1)[0] : items.shift()
    items = items.slice(0, limit - 1)

    return `
      <section id="reviews" class="reviews-section" aria-label="${escapeHtml(copy.reviewsAria)}">
        ${sectionHeading(copy.reviewsEyebrow, copy.reviewsTitle, copy.reviewsBody)}
        <article class="review-featured">
          <span class="eyebrow">${escapeHtml(copy.reviewsEyebrow)}</span>
          <blockquote>${escapeHtml(featured.quote)}</blockquote>
          <footer><span aria-hidden="true">★★★★★</span><span class="sr-only">5 out of 5 stars</span> · ${escapeHtml(featured.service)}</footer>
        </article>
        <div class="${gridClasses.join(' ')}" role="region" aria-label="${escapeHtml(copy.reviewsMoreAria)}">
          ${items.map((item) => renderReviewCard(item, { source: block.source })).join('')}
        </div>
      </section>
    `
  }

  if (!block.all) {
    items = items.slice(0, limit)
  }

  const isGoogle = block.source === 'Google'
  const headingEyebrow =
    block.heading?.eyebrow || (isGoogle ? copy.reviewsEyebrowGoogle : copy.reviewsEyebrow)
  const headingTitle =
    block.heading?.title || (isGoogle ? copy.reviewsTitleGoogle : copy.reviewsTitle)
  const headingLead =
    block.heading?.body || (isGoogle ? copy.reviewsBodyGoogle : copy.reviewsBody)

  return `
    <section id="reviews" class="reviews-section" aria-label="${escapeHtml(copy.reviewsAria)}">
      ${sectionHeading(headingEyebrow, headingTitle, headingLead)}
      <div class="${gridClasses.join(' ')}" role="region" aria-label="${escapeHtml(copy.reviewsCardsAria)}">
        ${items.map((item) => renderReviewCard(item, { source: block.source })).join('')}
      </div>
    </section>
  `
}

function renderTextSplit(block) {
  const accentClass = block.accent === 'blue' ? ' text-split-accent-blue' : ''
  return `
    <section class="text-split${accentClass}">
      ${block.sections.map((item) => `<article><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.body)}</p></article>`).join('')}
    </section>
  `
}

function renderValues(block) {
  const copy = ui()
  return `
    <section id="values">
      ${sectionHeading(copy.valuesEyebrow, copy.valuesTitle)}
      <div class="values-grid">
        ${block.items
          .map(
            ([title, body]) => `
              <article class="content-card">
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(body)}</p>
              </article>`
          )
          .join('')}
      </div>
    </section>
  `
}

function renderInstagramStrip() {
  const copy = ui()
  return `
    <section class="instagram-strip">
      <span class="eyebrow">${escapeHtml(copy.instagramEyebrow)}</span>
      <p>
        ${escapeHtml(copy.instagramBodyBefore)}
        <a href="${escapeHtml(INSTAGRAM_URL)}" target="_blank" rel="noopener noreferrer" data-track="social_instagram">@pixelpaint.renovations</a>
        ${escapeHtml(copy.instagramBodyAfter)}
      </p>
    </section>
  `
}

function renderWarrantyPanel() {
  const copy = ui()
  const w = warranty()
  return `
    <section id="warranty" class="warranty-panel">
      ${sectionHeading(copy.warrantyEyebrow, w.headline, `${w.summary} ${w.quoteNote}`)}
      <div class="warranty-terms-panel">
        <p class="warranty-terms-intro">${escapeHtml(w.quoteNote)}</p>
        <dl class="warranty-terms-list">
          ${w.terms
            .map(
              ({ term, detail }) => `
              <div class="warranty-term">
                <dt>${escapeHtml(term)}</dt>
                <dd>${escapeHtml(detail)}</dd>
              </div>`
            )
            .join('')}
        </dl>
        <p class="warranty-terms-note">
          <span class="eyebrow">${escapeHtml(copy.warrantyPendingEyebrow)}</span>
          ${escapeHtml(copy.warrantyPendingNote)}
        </p>
      </div>
    </section>
  `
}

function renderWarrantyStrip(block) {
  const copy = ui()
  const w = warranty()
  const warrantyHref = block.homeWarranty ? `${route('')}#warranty` : '#warranty'
  const stripText = block.text || w.stripText
  return `
    <section class="warranty-strip" aria-label="${escapeHtml(copy.warrantyStripAria)}">
      <span class="eyebrow">${escapeHtml(copy.warrantyStripEyebrow)}</span>
      <p>
        ${escapeHtml(stripText)}
        <a href="${escapeHtml(warrantyHref)}">${escapeHtml(copy.warrantyReviewLink)}</a>
      </p>
    </section>
  `
}

function renderMeetTeam() {
  const copy = ui()
  return `
    <section id="team" class="meet-team">
      ${sectionHeading(copy.teamEyebrow, copy.teamTitle, copy.teamIntro)}
      <article class="meet-team-card">
        <div class="meet-team-visual">
          <img
            class="meet-team-badge"
            src="${escapeHtml(href('logo-icon.png'))}"
            alt="${escapeHtml(copy.teamBadgeAlt)}"
            width="120"
            height="120"
          />
        </div>
        <div class="meet-team-copy">
          <h3>${escapeHtml(copy.teamName)}</h3>
          <p class="meet-team-role">${escapeHtml(copy.teamRole)}</p>
          <p>${escapeHtml(copy.teamBody)}</p>
          <ul class="meet-team-highlights">
            ${copy.teamHighlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
      </article>
    </section>
  `
}

function renderSectionDivider() {
  return `
    <div class="section-divider" aria-hidden="true">
      <span></span><span></span><span></span><span></span>
    </div>
  `
}

function renderContact(block = {}) {
  const copy = ui()
  const w = warranty()
  const heading = block.heading || {
    eyebrow: copy.contactDefaultEyebrow,
    title: copy.contactDefaultTitle,
    body: copy.contactDefaultBody
  }

  return `
    <section id="contact" class="contact-section">
      <div class="contact-layout">
        <div class="contact-details">
          ${sectionHeading(heading.eyebrow, heading.title, heading.body)}

          <div class="contact-trust-badges" aria-label="${escapeHtml(copy.contactTrustAria)}">
            <span class="contact-badge">${escapeHtml(copy.contactBadgeInsured)}</span>
            <span class="contact-badge">${escapeHtml(copy.contactBadgeWarranty)}</span>
            <span class="contact-badge">${escapeHtml(copy.contactBadgeEstimates)}</span>
            <span class="contact-badge">${escapeHtml(copy.contactBadgeLocal)}</span>
          </div>

          <p class="contact-seasonal">
            <span class="contact-seasonal-label">${escapeHtml(copy.contactSeasonalLabel)}</span>
            ${escapeHtml(copy.contactSeasonalBody)}
          </p>

          <p class="contact-response-note">
            ${escapeHtml(copy.contactResponseNoteBefore)} <strong>${escapeHtml(copy.contactResponseNoteHours)}</strong> ${escapeHtml(copy.contactResponseNoteAfter)}
          </p>

          <div class="contact-channels">
            <a class="contact-channel" href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_contact">
              <span class="contact-channel-label">${escapeHtml(copy.contactPhoneLabel)}</span>
              <span class="contact-channel-value">${escapeHtml(CONTACT_PHONE_DISPLAY)}</span>
              <span class="contact-channel-hint">${escapeHtml(copy.contactPhoneHint)}</span>
            </a>
            <a class="contact-channel" href="mailto:${escapeHtml(CONTACT_EMAIL)}">
              <span class="contact-channel-label">${escapeHtml(copy.contactEmailLabel)}</span>
              <span class="contact-channel-value">${escapeHtml(CONTACT_EMAIL)}</span>
              <span class="contact-channel-hint">${escapeHtml(copy.contactEmailHint)}</span>
            </a>
            <div class="contact-channel">
              <span class="contact-channel-label">${escapeHtml(copy.contactAreaLabel)}</span>
              <span class="contact-channel-value">${escapeHtml(copy.contactAreaValue)}</span>
              <span class="contact-channel-hint">${escapeHtml(copy.contactAreaHint)}</span>
            </div>
          </div>

          <div class="contact-social" aria-label="${escapeHtml(copy.contactSocialAria)}">
            <a class="contact-social-pill" href="${escapeHtml(INSTAGRAM_URL)}" target="_blank" rel="noopener noreferrer">
              <span aria-hidden="true">◆</span> ${escapeHtml(copy.contactSocialInstagram)}
            </a>
            <a class="contact-social-pill" href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer">
              <span aria-hidden="true">◆</span> ${escapeHtml(copy.contactSocialFacebook)}
            </a>
          </div>

          <div class="map-embed contact-map">
            <iframe
              title="${escapeHtml(copy.contactMapTitle)}"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Lake%20Nona%2C%20FL&output=embed"
            ></iframe>
          </div>

          <p class="contact-warranty-note">${escapeHtml(w.quoteNote)} <a href="${escapeHtml(route(''))}#warranty">${escapeHtml(copy.contactWarrantyReview)}</a>.</p>
        </div>

        <div class="contact-form-column">
          <div class="contact-form-hook">
            <span class="eyebrow">${escapeHtml(copy.contactFormHookEyebrow)}</span>
            <p class="contact-form-hook-lead">${escapeHtml(copy.contactFormHookLead)}</p>
          </div>
          ${renderQuoteFormInner(formCopy().title, true, {
            intro: copy.contactFormIntro,
            photoHint: copy.contactFormPhotoHint
          })}
          <div class="contact-next-steps" aria-label="${escapeHtml(copy.contactNextAria)}">
            <h3>${escapeHtml(copy.contactNextTitle)}</h3>
            <ol class="contact-timeline">
              ${copy.contactNextSteps
                .map(
                  (step, index) => `
              <li class="contact-timeline-step">
                <span class="contact-timeline-num" aria-hidden="true">${index + 1}</span>
                <div>
                  <strong>${escapeHtml(step.title)}</strong>
                  <p>${escapeHtml(step.body)}</p>
                </div>
              </li>`
                )
                .join('')}
            </ol>
          </div>
        </div>
      </div>
    </section>
  `
}

function renderTextLinkCta(block) {
  return `
    <section class="section-cta-link">
      <div class="section-actions">
        <a class="text-link" href="${escapeHtml(route(block.href || 'contact/'))}" data-track="text_link_cta">${escapeHtml(block.label || ui().getFreeQuote)}</a>
      </div>
      ${block.note ? `<p class="cta-note">${escapeHtml(block.note)}</p>` : ''}
    </section>
  `
}

function renderPrivacyPolicy() {
  const p = privacyCopy()
  const emailLink = `<a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a>`
  const phoneLink = `<a href="tel:${escapeHtml(CONTACT_PHONE_TEL)}">${escapeHtml(CONTACT_PHONE_DISPLAY)}</a>`
  const contactBody = escapeHtml(p.contactBody)
    .replace('{email}', emailLink)
    .replace('{phone}', phoneLink)

  return `
    <section class="privacy-policy">
      <div class="privacy-content">
        <p><strong>${escapeHtml(p.lastUpdated)}</strong> ${new Date().getFullYear()}</p>
        <h2>${escapeHtml(p.collectTitle)}</h2>
        <p>${escapeHtml(p.collectBody)}</p>
        <h2>${escapeHtml(p.useTitle)}</h2>
        <p>${escapeHtml(p.useBody)}</p>
        <h2>${escapeHtml(p.formTitle)}</h2>
        <p>${escapeHtml(p.formBody)}</p>
        <h2>${escapeHtml(p.contactTitle)}</h2>
        <p>${contactBody}</p>
      </div>
    </section>
  `
}

function renderBlock(block) {
  if (block.type === 'quoteForm') return renderQuoteForm()
  if (block.type === 'services') return renderServices(block)
  if (block.type === 'projectShowcase') return renderProjectShowcase(block)
  if (block.type === 'socialGalleryIntro') return renderSocialGalleryIntro()
  if (block.type === 'processSteps') return renderProcessSteps()
  if (block.type === 'benefits') return renderBenefits()
  if (block.type === 'serviceAreas') return renderServiceAreas()
  if (block.type === 'testimonials') return renderTestimonials(block)
  if (block.type === 'textSplit') return renderTextSplit(block)
  if (block.type === 'values') return renderValues(block)
  if (block.type === 'textLinkCta') return renderTextLinkCta(block)
  if (block.type === 'contact') return renderContact(block)
  if (block.type === 'instagramStrip') return renderInstagramStrip()
  if (block.type === 'warrantyPanel') return renderWarrantyPanel()
  if (block.type === 'warrantyStrip') return renderWarrantyStrip(block)
  if (block.type === 'meetTeam') return renderMeetTeam()
  if (block.type === 'privacyPolicy') return renderPrivacyPolicy()
  return ''
}

function renderFooter() {
  const copy = ui()
  const w = warranty()
  return `
    <footer>
      <div>
        <a href="${escapeHtml(href(''))}" class="footer-logo"><img src="${escapeHtml(href('logo.png'))}" alt="${escapeHtml(COMPANY_LEGAL_NAME)}" /></a>
        <p>${escapeHtml(copy.footerBlurb)}</p>
        <p class="footer-warranty">${escapeHtml(w.footerLine)} <a href="${escapeHtml(route(''))}#warranty">${escapeHtml(copy.footerReviewTerms)}</a></p>
      </div>
      <nav aria-label="${escapeHtml(copy.footerNav)}">
        ${getNav()
          .map((item) => `<a href="${escapeHtml(href(item.path))}">${escapeHtml(item.label)}</a>`)
          .join('')}
        <a href="${escapeHtml(href('kitchen-renovations/'))}">${escapeHtml(copy.footerKitchen)}</a>
        <a href="${escapeHtml(href('bathroom-renovations/'))}">${escapeHtml(copy.footerBathroom)}</a>
        <a href="${escapeHtml(href('privacy/'))}">${escapeHtml(copy.footerPrivacy)}</a>
      </nav>
      <div class="footer-cta">
        <a href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_footer">${escapeHtml(CONTACT_PHONE_DISPLAY)}</a>
        <a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a>
        <a href="${escapeHtml(INSTAGRAM_URL)}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.viewInstagram)}</a>
        <a href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.viewFacebook)}</a>
        <span>${escapeHtml(copy.footerServing)}</span>
      </div>
    </footer>
  `
}

function bindScrollMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  document.querySelectorAll('main > section:not(.home-hero):not(.page-hero)').forEach((section) => {
    section.classList.add('motion-section')
    if (prefersReduced) {
      section.classList.add('motion-visible')
      return
    }
    section.classList.add('motion-hidden')
  })

  if (!prefersReduced) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-visible')
            entry.target.classList.remove('motion-hidden')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    document.querySelectorAll('.motion-section.motion-hidden').forEach((section) => observer.observe(section))

    // Keep the home hero static so the landmark panorama remains stable.
  }

  const logoImg = document.querySelector('.logo img')
  if (logoImg) {
    logoImg.classList.add('logo-pulse')
    logoImg.addEventListener(
      'animationend',
      () => {
        logoImg.classList.remove('logo-pulse')
      },
      { once: true }
    )
  }
}

function bindInteractions(app) {
  const navToggle = document.querySelector('.nav-toggle')
  navToggle?.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open')
    navToggle.setAttribute('aria-expanded', String(isOpen))
  })

  document.querySelectorAll('#primary-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open')
      navToggle?.setAttribute('aria-expanded', 'false')
    })
  })

  app.querySelectorAll('.lead-form').forEach(bindForm)

  app.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => {
      const name = el.getAttribute('data-track')
      if (name) trackEvent(name)
    })
  })

  document.querySelector('.mobile-sticky-cta')?.addEventListener('click', () => {
    trackEvent('sticky_cta_click')
  })

  bindScrollMotion()
}

export function mountPage(pageKey) {
  setActiveLocale(detectLocale())
  const app = document.querySelector('#app')
  const page = getPages()[pageKey]
  if (!app || !page) return

  initAnalytics()
  setMeta(page)
  injectLocalBusinessSchema()

  const copy = ui()
  const html = `
    <div class="wrapper ${pageKey === 'home' ? 'home-wrapper' : ''}">
      ${renderHeader(pageKey)}
      ${renderServiceSubnav(pageKey)}
      <main id="main-content">
        ${renderHero(page, pageKey)}
        ${page.blocks
          .map((block, index) => `${index > 0 ? renderSectionDivider() : ''}${renderBlock(block)}`)
          .join('')}
      </main>
      ${renderFooter()}
      ${pageKey !== 'home' && pageKey !== 'contactPage' ? `<a class="mobile-sticky-cta" href="${escapeHtml(href('contact/'))}" aria-label="${escapeHtml(copy.stickyCtaAria)}">${escapeHtml(copy.getFreeQuote)}</a>` : ''}
    </div>
  `

  app.innerHTML = html
  bindInteractions(app)
}
