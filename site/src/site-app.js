import './style.css'
import {
  href,
  absoluteUrl,
  COMPANY_LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  BUSINESS_LOCATION,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  SITE_URL,
  OG_IMAGE,
  HERO_IMAGE
} from './legal/constants.js'
import {
  nav,
  serviceSubnav,
  services,
  serviceGroups,
  testimonials,
  projectShowcase,
  whyChooseUs,
  serviceAreas,
  processSteps,
  pages,
  WARRANTY_HEADLINE,
  WARRANTY_SUMMARY,
  WARRANTY_QUOTE_NOTE,
  WARRANTY_FOOTER_LINE,
  WARRANTY_STRIP_TEXT,
  WARRANTY_TERMS_PLACEHOLDER
} from './content/index.js'
import { initAnalytics, trackEvent } from './analytics.js'
import { escapeHtml } from './security/html.js'
import { renderQuoteFormInner, bindForm } from './forms/quote-form.js'

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
  document.title = page.title
  const description = page.description
  upsertMeta('name', 'description', description)

  const ogImage = absoluteUrl(page.ogImage || OG_IMAGE)
  const ogUrl = absoluteUrl(page.path || '')
  upsertLink('canonical', ogUrl)
  upsertMeta('property', 'og:title', page.title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:image', ogImage)
  upsertMeta('property', 'og:url', ogUrl)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', COMPANY_LEGAL_NAME)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', page.title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', ogImage)
}

function injectLocalBusinessSchema() {
  if (document.getElementById('local-business-schema')) return
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
    image: absoluteUrl('logo.png'),
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
  })
  document.head.appendChild(script)
}

function route(path) {
  if (!path) return href('')
  if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) return path
  return href(path)
}

function renderPrimaryAction(label = 'Get a Free Quote', path = 'contact/') {
  return `
    <div class="actions">
      <a class="btn btn-primary" href="${escapeHtml(route(path))}">${escapeHtml(label)}</a>
    </div>
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
  const links = serviceSubnav
    .map((item) => {
      const isCurrent = item.page === pageKey && (!item.anchor || hash === item.anchor)
      return `<a href="${escapeHtml(href(item.path))}"${isCurrent ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`
    })
    .join('')
  return `
    <div class="service-subnav" aria-label="Specialty services">
      <div class="service-subnav-inner">
        <span class="service-subnav-label">Popular services</span>
        <div class="service-subnav-links">
          ${links}
        </div>
      </div>
    </div>
  `
}

function renderHeader(pageKey) {
  return `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <header class="site-header">
      <div class="header-brand">
        <a href="${escapeHtml(href(''))}" class="logo" aria-label="${escapeHtml(COMPANY_LEGAL_NAME)} home">
          <img src="${escapeHtml(href('logo.png'))}" alt="${escapeHtml(COMPANY_LEGAL_NAME)}" />
        </a>
      </div>
      <nav id="primary-nav" aria-label="Primary navigation">
        ${nav
          .map(
            (item) =>
              `<a href="${escapeHtml(href(item.path))}" ${item.page === pageKey ? 'aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`
          )
          .join('')}
      </nav>
      <div class="header-actions">
        <a class="header-phone" href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_header">${escapeHtml(CONTACT_PHONE_DISPLAY)}</a>
      </div>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
        <span class="sr-only">Toggle navigation</span>
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
  if (pageKey === 'home') {
    return `
      <section class="hero home-hero" id="top">
        <div class="hero-shell">
          <div class="hero-banner">
            <img src="${escapeHtml(href(HERO_IMAGE))}" alt="Lake Nona landmark panorama featuring the VA Medical Center architecture, Town Center with the Disco dog and Wave Hotel, and Boxi Park container buildings in one seamless scene" />
          </div>
          <div class="hero-split">
            <div class="hero-copy-primary">
              <span class="eyebrow">${escapeHtml(page.hero.eyebrow)}</span>
              <h1>${escapeHtml(page.hero.headline)}</h1>
              <p class="hero-proof"><span aria-hidden="true">★</span> <a href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer">5.0 neighbor reviews</a> · <a href="#warranty">Written warranty</a> · Free estimates</p>
              ${page.hero.lead ? `<p class="hero-lead">${escapeHtml(page.hero.lead)}</p>` : ''}
            </div>
            <aside class="hero-form-panel hero-panel hero-panel-form" id="quote">
              ${renderQuoteFormInner('Request a Free Quote', true)}
            </aside>
            <div class="hero-copy-secondary">
              ${page.hero.body ? `<p class="hero-body">${escapeHtml(page.hero.body)}</p>` : ''}
              ${
                page.hero.highlights?.length
                  ? `<ul class="hero-highlights">${page.hero.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
                  : ''
              }
              <p class="hero-trust">${escapeHtml(page.hero.microcopy)} · <a href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_hero">Call ${escapeHtml(CONTACT_PHONE_DISPLAY)}</a></p>
            </div>
          </div>
        </div>
      </section>
    `
  }

  if (pageKey === 'servicesPage' || pageKey === 'projectsPage' || pageKey === 'contactPage') {
    const proofSuffix =
      pageKey === 'servicesPage'
        ? 'Same PM from quote to finish'
        : pageKey === 'projectsPage'
          ? 'Same PM start to finish'
          : 'Free on-site estimates'
    const statsLabel =
      pageKey === 'servicesPage'
        ? 'Service categories'
        : pageKey === 'projectsPage'
          ? 'What you get on every project'
          : 'Why reach out now'

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
          <p class="hero-proof"><span aria-hidden="true">★</span> <a href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer">5.0 neighbor reviews</a> · <a href="${escapeHtml(route(''))}#warranty">Written warranty</a> · ${escapeHtml(proofSuffix)}</p>
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
              ? `<p class="hero-trust">${escapeHtml(page.hero.trust)} · <a href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_hero">Call ${escapeHtml(CONTACT_PHONE_DISPLAY)}</a></p>`
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
          <p class="hero-proof"><span aria-hidden="true">★</span> <a href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer">5.0 neighbor reviews</a> · Referral-driven · <a href="${escapeHtml(route(''))}#warranty">Written warranty</a></p>
          ${page.hero.lead ? `<p class="hero-lead">${escapeHtml(page.hero.lead)}</p>` : ''}
          ${page.hero.body ? `<p class="hero-body">${escapeHtml(page.hero.body)}</p>` : ''}
          ${
            page.hero.stats?.length
              ? `<ul class="hero-stats" aria-label="Why neighbors trust Pixel Paint">${page.hero.stats
                  .map(
                    (stat) =>
                      `<li class="hero-stat"><strong>${escapeHtml(stat.label)}</strong><span>${escapeHtml(stat.detail)}</span></li>`
                  )
                  .join('')}</ul>`
              : ''
          }
          ${
            page.hero.trust
              ? `<p class="hero-trust">${escapeHtml(page.hero.trust)} · <a href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_hero">Call ${escapeHtml(CONTACT_PHONE_DISPLAY)}</a></p>`
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
  return `
    <section id="quote" class="quote-section">
      <div class="quote-layout">
        ${sectionHeading(
          'Free Estimate',
          'Request a free quote',
          'Share your project details and optional photos so we can provide an accurate estimate.'
        )}
        ${renderQuoteFormInner('Request a Free Quote')}
      </div>
    </section>
  `
}

const accentClasses = ['service-accent-blue', 'service-accent-magenta', 'service-accent-yellow']

function renderServiceCard(index, featured = false) {
  const service = services[index]
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
      ${service.learnHref ? `<a class="learn-link" href="${escapeHtml(route(service.learnHref))}">Learn more</a>` : ''}
    </article>`
}

const defaultServicesHeading = {
  eyebrow: 'What We Do',
  title: 'Painting and renovation services for every part of your home',
  body:
    'Whether you need a full exterior repaint, a kitchen refresh, or prep-for-sale touch-ups, Pixel Paint delivers organized crews and warranty-backed results.'
}

function renderServices(block = {}) {
  const full = typeof block === 'boolean' ? block : Boolean(block.full)
  const heading = typeof block === 'object' && block.heading ? block.heading : defaultServicesHeading

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
        <div class="section-actions"><a class="text-link" href="${escapeHtml(href('contact/'))}">Get a Free Quote</a></div>
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
  return `
    <section class="gallery-intro">
      ${sectionHeading(
        'More Photos',
        'Follow us for the latest project updates',
        'We post fresh before-and-after photos on Instagram and Facebook — kitchens, exteriors, bathrooms, and whole-home repaints across Central Florida.'
      )}
      <div class="social-gallery-actions">
        <a class="text-link" href="${escapeHtml(INSTAGRAM_URL)}" target="_blank" rel="noopener noreferrer" data-track="social_instagram">View Instagram</a>
        <a class="text-link" href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer" data-track="social_facebook">View Facebook</a>
      </div>
    </section>
  `
}

function getProjectItems(block) {
  let pool = projectShowcase
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

const defaultProjectShowcaseHeading = {
  eyebrow: 'Project Showcase',
  title: 'Work you can picture in your home',
  body:
    'Recent project types we handle every week across Lake Nona, Orlando, and the surrounding metro.'
}

const fullProjectShowcaseHeading = {
  eyebrow: 'Project Showcase',
  title: 'Work you can picture in your home',
  body:
    'Every image is from a real Pixel Paint job — protected prep, premium materials, and finishes built for Central Florida.'
}

function renderProjectShowcase(block) {
  const items = getProjectItems(block)
  const isFeatured = block.layout === 'featured'
  const defaultHeading = block.full ? fullProjectShowcaseHeading : defaultProjectShowcaseHeading
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
          : `<div class="section-actions"><a class="text-link" href="${escapeHtml(href('projects/'))}">View All Projects</a></div>`
      }
    </section>
  `
}

function renderProcessSteps() {
  return `
    <section id="process" class="process-section">
      ${sectionHeading(
        'How It Works',
        'Three steps, no guesswork',
        'Know the price before work starts, stay comfortable while we paint, and get a finish backed in writing.'
      )}
      <ol class="process-grid">
        ${processSteps
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
  return `
    <section id="why-us">
      ${sectionHeading(
        'Why Choose Pixel Paint',
        'Trusted. Professional. Local.',
        'Homeowners across Central Florida choose Pixel Paint for communication, craftsmanship, and follow-through that lasts beyond the final walkthrough.'
      )}
      <div class="benefit-grid">
        ${whyChooseUs
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
  return `
    <section id="areas">
      ${sectionHeading(
        'Areas We Serve',
        'Serving Lake Nona, Orlando, and Central Florida',
        'Pixel Paint and Renovations works across the Orlando metro and surrounding communities.'
      )}
      <div class="areas-grid">
        ${serviceAreas
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
      <section id="reviews" class="reviews-section" aria-label="Customer reviews">
        ${sectionHeading(
          'Customer Reviews',
          'What homeowners say about Pixel Paint',
          'Real feedback from painting and renovation clients across Central Florida.'
        )}
        <article class="review-featured">
          <span class="eyebrow">Neighbor review</span>
          <blockquote>${escapeHtml(featured.quote)}</blockquote>
          <footer><span aria-hidden="true">★★★★★</span><span class="sr-only">5 out of 5 stars</span> · Lake Nona homeowner · ${escapeHtml(featured.service)}</footer>
        </article>
        <div class="${gridClasses.join(' ')}" role="region" aria-label="More customer reviews">
          ${items.map((item) => renderReviewCard(item, { source: block.source })).join('')}
        </div>
      </section>
    `
  }

  if (!block.all) {
    items = items.slice(0, limit)
  }

  const headingEyebrow =
    block.heading?.eyebrow || (block.source === 'Google' ? 'Google Reviews' : 'Customer Reviews')
  const headingTitle =
    block.heading?.title ||
    (block.source === 'Google'
      ? 'What neighbors say on Google'
      : 'What homeowners say about Pixel Paint')
  const headingLead =
    block.heading?.body ||
    (block.source === 'Google'
      ? 'Real Google reviews from painting and renovation clients across Central Florida.'
      : 'Real feedback from painting and renovation clients across Central Florida.')

  return `
    <section id="reviews" class="reviews-section" aria-label="Customer reviews">
      ${sectionHeading(headingEyebrow, headingTitle, headingLead)}
      <div class="${gridClasses.join(' ')}" role="region" aria-label="Customer review cards">
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
  return `
    <section id="values">
      ${sectionHeading('Our Values', 'How we show up on every job')}
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
  return `
    <section class="instagram-strip">
      <span class="eyebrow">Fresh project photos</span>
      <p>
        See before-and-after kitchens, exteriors, and whole-home repaints on
        <a href="${escapeHtml(INSTAGRAM_URL)}" target="_blank" rel="noopener noreferrer" data-track="social_instagram">@pixelpaint.renovations</a>
        — updated weekly across Central Florida.
      </p>
    </section>
  `
}

function renderWarrantyPanel() {
  return `
    <section id="warranty" class="warranty-panel">
      ${sectionHeading('Our Warranty', WARRANTY_HEADLINE, `${WARRANTY_SUMMARY} ${WARRANTY_QUOTE_NOTE}`)}
      <div class="warranty-terms-panel">
        <p class="warranty-terms-intro">${escapeHtml(WARRANTY_QUOTE_NOTE)}</p>
        <dl class="warranty-terms-list">
          ${WARRANTY_TERMS_PLACEHOLDER.map(
            ({ term, detail }) => `
              <div class="warranty-term">
                <dt>${escapeHtml(term)}</dt>
                <dd>${escapeHtml(detail)}</dd>
              </div>`
          ).join('')}
        </dl>
        <p class="warranty-terms-note">
          <span class="eyebrow">Pending review</span>
          Replace all XXX placeholders with final legal language before launch.
        </p>
      </div>
    </section>
  `
}

function renderWarrantyStrip(block) {
  const warrantyHref = block.homeWarranty ? `${route('')}#warranty` : '#warranty'
  const stripText = block.text || WARRANTY_STRIP_TEXT
  return `
    <section class="warranty-strip" aria-label="Warranty">
      <span class="eyebrow">Warranty-backed</span>
      <p>
        ${escapeHtml(stripText)}
        <a href="${escapeHtml(warrantyHref)}">Review full warranty terms</a>
      </p>
    </section>
  `
}

function renderMeetTeam() {
  return `
    <section id="team" class="meet-team">
      ${sectionHeading(
        'Local crew',
        'Meet the team behind Pixel Paint and Renovations',
        `${escapeHtml(COMPANY_LEGAL_NAME)} serves Lake Nona, Orlando, and Central Florida.`
      )}
      <article class="meet-team-card">
        <div class="meet-team-visual">
          <img
            class="meet-team-badge"
            src="${escapeHtml(href('logo-icon.png'))}"
            alt="Pixel Paint and Renovations logo badge"
            width="120"
            height="120"
          />
        </div>
        <div class="meet-team-copy">
          <h3>Pixel Paint and Renovations</h3>
          <p class="meet-team-role">Lake Nona painting &amp; renovation</p>
          <p>
            We built Pixel Paint around jobs we would trust in our own homes — organized crews, honest timelines,
            and coatings that survive Florida heat and humidity. One project manager coordinates painters and renovation subs directly,
            so your questions go to one team that knows your scope.
          </p>
          <ul class="meet-team-highlights">
            <li>On-site for walkthroughs, mid-project check-ins, and punch lists</li>
            <li>Direct line for schedule changes and warranty questions</li>
            <li>Lake Nona–based — serving Orlando and the wider metro daily</li>
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
  const heading = block.heading || {
    eyebrow: 'Get in touch',
    title: 'We are ready to help with your next project',
    body: 'Reach out by phone, email, or the form. Follow us on Instagram and Facebook for recent project photos.'
  }

  return `
    <section id="contact" class="contact-section">
      <div class="contact-layout">
        <div class="contact-details">
          ${sectionHeading(heading.eyebrow, heading.title, heading.body)}

          <div class="contact-trust-badges" aria-label="Why homeowners reach out">
            <span class="contact-badge">Fully insured</span>
            <span class="contact-badge">Written warranty</span>
            <span class="contact-badge">Free estimates</span>
            <span class="contact-badge">Local crew</span>
          </div>

          <p class="contact-seasonal">
            <span class="contact-seasonal-label">Florida season</span>
            Book exterior and humidity-sensitive work before peak summer heat — interior refreshes and cabinet painting stay year-round.
          </p>

          <p class="contact-response-note">
            Most quotes answered within <strong>XXX hours</strong> when you include photos and your target start window.
          </p>

          <div class="contact-channels">
            <a class="contact-channel" href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_contact">
              <span class="contact-channel-label">Phone</span>
              <span class="contact-channel-value">${escapeHtml(CONTACT_PHONE_DISPLAY)}</span>
              <span class="contact-channel-hint">Talk to our team directly</span>
            </a>
            <a class="contact-channel" href="mailto:${escapeHtml(CONTACT_EMAIL)}">
              <span class="contact-channel-label">Email</span>
              <span class="contact-channel-value">${escapeHtml(CONTACT_EMAIL)}</span>
              <span class="contact-channel-hint">Attach photos anytime</span>
            </a>
            <div class="contact-channel">
              <span class="contact-channel-label">Service area</span>
              <span class="contact-channel-value">${escapeHtml(BUSINESS_LOCATION)} &amp; Central Florida</span>
              <span class="contact-channel-hint">On-site walkthroughs across the metro</span>
            </div>
          </div>

          <div class="contact-social" aria-label="Follow Pixel Paint">
            <a class="contact-social-pill" href="${escapeHtml(INSTAGRAM_URL)}" target="_blank" rel="noopener noreferrer">
              <span aria-hidden="true">◆</span> Instagram · @pixelpaint.renovations
            </a>
            <a class="contact-social-pill" href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer">
              <span aria-hidden="true">◆</span> Facebook · Recent project photos
            </a>
          </div>

          <div class="map-embed contact-map">
            <iframe
              title="Lake Nona, Florida map"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Lake%20Nona%2C%20FL&output=embed"
            ></iframe>
          </div>

          <p class="contact-warranty-note">${escapeHtml(WARRANTY_QUOTE_NOTE)} <a href="${escapeHtml(route(''))}#warranty">Review placeholder terms</a>.</p>
        </div>

        <div class="contact-form-column">
          <div class="contact-form-hook">
            <span class="eyebrow">Start here</span>
            <p class="contact-form-hook-lead">Photos beat guesswork — snap your room, cabinets, or exterior and attach below.</p>
          </div>
          ${renderQuoteFormInner('Request a Free Quote', true, {
            intro:
              'Tell us what you are planning — room, timeline, and colors. We reply with next steps and a free on-site estimate.',
            photoHint:
              'A quick phone photo of the space helps us quote accurately on the first reply — kitchens, baths, and exteriors welcome.'
          })}
          <div class="contact-next-steps" aria-label="What happens after you submit">
            <h3>What happens next</h3>
            <ol class="contact-timeline">
              <li class="contact-timeline-step">
                <span class="contact-timeline-num" aria-hidden="true">1</span>
                <div>
                  <strong>We reply personally</strong>
                  <p>Target within XXX hours — your questions answered or a free home visit scheduled, not an auto-reply.</p>
                </div>
              </li>
              <li class="contact-timeline-step">
                <span class="contact-timeline-num" aria-hidden="true">2</span>
                <div>
                  <strong>Free home visit</strong>
                  <p>We see the space, discuss your goals, and leave you with a written quote — price, materials, and schedule spelled out.</p>
                </div>
              </li>
              <li class="contact-timeline-step">
                <span class="contact-timeline-num" aria-hidden="true">3</span>
                <div>
                  <strong>You approve with confidence</strong>
                  <p>Everything is in writing before work starts — cost, prep plan, and warranty terms. No surprise bills or strangers on site.</p>
                </div>
              </li>
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
        <a class="text-link" href="${escapeHtml(route(block.href || 'contact/'))}" data-track="text_link_cta">${escapeHtml(block.label || 'Get a Free Quote')}</a>
      </div>
      ${block.note ? `<p class="cta-note">${escapeHtml(block.note)}</p>` : ''}
    </section>
  `
}

function renderPrivacyPolicy() {
  return `
    <section class="privacy-policy">
      <div class="privacy-content">
        <p><strong>Last updated:</strong> ${new Date().getFullYear()}</p>
        <h2>Information we collect</h2>
        <p>When you submit our quote form, we collect your name, email, phone number, optional address, service interest, optional project photo, and message. We use this information only to respond to your request and provide an estimate.</p>
        <h2>How we use your information</h2>
        <p>We contact you about your project, schedule walkthroughs, and follow up on quotes. We do not sell or rent your personal information to third parties.</p>
        <h2>Form processing</h2>
        <p>Form submissions are delivered securely to our team via a third-party form service. Optional photos you upload are used solely to understand your project scope.</p>
        <h2>Contact</h2>
        <p>Questions about this policy? Email <a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a> or call <a href="tel:${escapeHtml(CONTACT_PHONE_TEL)}">${escapeHtml(CONTACT_PHONE_DISPLAY)}</a>.</p>
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
  return `
    <footer>
      <div>
        <a href="${escapeHtml(href(''))}" class="footer-logo"><img src="${escapeHtml(href('logo.png'))}" alt="${escapeHtml(COMPANY_LEGAL_NAME)}" /></a>
        <p>${escapeHtml(COMPANY_LEGAL_NAME)} — professional painting and home renovations serving Lake Nona, Orlando, and Central Florida.</p>
        <p class="footer-warranty">${escapeHtml(WARRANTY_FOOTER_LINE)} <a href="${escapeHtml(route(''))}#warranty">Review terms</a></p>
      </div>
      <nav aria-label="Footer navigation">
        ${nav.map((item) => `<a href="${escapeHtml(href(item.path))}">${escapeHtml(item.label)}</a>`).join('')}
        <a href="${escapeHtml(href('kitchen-renovations/'))}">Kitchen Renovations</a>
        <a href="${escapeHtml(href('bathroom-renovations/'))}">Bathroom Refresh</a>
        <a href="${escapeHtml(href('privacy/'))}">Privacy</a>
      </nav>
      <div class="footer-cta">
        <a href="tel:${escapeHtml(CONTACT_PHONE_TEL)}" data-track="phone_footer">${escapeHtml(CONTACT_PHONE_DISPLAY)}</a>
        <a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a>
        <a href="${escapeHtml(INSTAGRAM_URL)}" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="${escapeHtml(FACEBOOK_URL)}" target="_blank" rel="noopener noreferrer">Facebook</a>
        <span>Serving ${escapeHtml(BUSINESS_LOCATION)} and Central Florida.</span>
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
  const app = document.querySelector('#app')
  const page = pages[pageKey]
  if (!app || !page) return

  initAnalytics()
  setMeta(page)
  injectLocalBusinessSchema()

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
      ${pageKey !== 'home' && pageKey !== 'contactPage' ? `<a class="mobile-sticky-cta" href="${escapeHtml(href('contact/'))}" aria-label="Get a free quote — contact page">Get a Free Quote</a>` : ''}
    </div>
  `

  app.innerHTML = html
  bindInteractions(app)
}
