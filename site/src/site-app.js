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

const nav = [
  { page: 'home', path: '', label: 'Home' },
  { page: 'servicesPage', path: 'services/', label: 'Services' },
  { page: 'projectsPage', path: 'projects/', label: 'Projects' },
  { page: 'aboutPage', path: 'about/', label: 'About' },
  { page: 'contactPage', path: 'contact/', label: 'Contact' }
]

const serviceOptions = [
  'Interior painting',
  'Exterior painting',
  'Kitchen renovations',
  'Bathroom refresh',
  'Cabinet painting & refinishing',
  'Pressure washing & paver sealing',
  'Fence & deck staining',
  'Stucco repair & prep-for-sale touch-ups',
  'Other'
]

const services = [
  {
    title: 'Interior Painting',
    body: 'Full-home and room-by-room interior painting with premium grades, careful prep, and clean job sites every day.',
    learnHref: 'services/'
  },
  {
    title: 'Exterior Painting',
    body: 'Weather-ready exterior coatings, crack sealing, and thorough surface prep built for Florida sun, rain, and heat.',
    learnHref: 'services/'
  },
  {
    title: 'Kitchen Renovations',
    body: 'Cabinet painting, countertops, backsplash, lighting, and hardware updates that transform how you use your kitchen.',
    learnHref: 'kitchen-renovations/'
  },
  {
    title: 'Bathroom Refresh',
    body: 'Tile refinishing, wallpaper removal, texture repair, and modern paint finishes without a full gut renovation.',
    learnHref: 'bathroom-renovations/'
  },
  {
    title: 'Cabinet Painting',
    body: 'Factory-smooth cabinet refinishing with durable finishes, color guidance, and updated hardware options.',
    learnHref: 'services/'
  },
  {
    title: 'Pressure Washing',
    body: 'Driveways, pavers, siding, and outdoor surfaces cleaned, sanded, and sealed to look new again.',
    learnHref: 'services/'
  },
  {
    title: 'Fence & Deck Staining',
    body: 'Even stain application over imperfect surfaces with neighbor-friendly prep and a polished final finish.',
    learnHref: 'services/'
  },
  {
    title: 'Stucco & Touch-Ups',
    body: 'Crack sealing, stucco repair, and listing-ready touch-ups so your home shows beautifully inside and out.',
    learnHref: 'services/'
  }
]

const whyChooseUs = [
  ['Responsive communication', 'Mauricio and your project manager stay in touch with clear updates from quote through completion.'],
  ['Background-checked crew', 'Professional painters who respect your home, keep work areas clean, and minimize disruption.'],
  ['Premium materials & prep', 'High-quality paint grades, crack sealing, color samples, and prep that holds up in Florida conditions.'],
  ['Warranty you can trust', 'Post-job follow-through and warranty support that customers mention again and again in reviews.'],
  ['Flexible & detail-oriented', 'Last-minute changes, small extras, and thoughtful fixes handled without losing momentum.'],
  ['Competitive, transparent pricing', 'Fair quotes, on-time schedules, and craftsmanship that neighbors recommend.']
]

const serviceAreas = [
  {
    title: 'Lake Nona & Southeast Orlando',
    areas: ['Lake Nona', 'Laureate Park', 'Narcoossee', 'St. Cloud', 'Medical City']
  },
  {
    title: 'Central Orlando',
    areas: ['Orlando', 'Winter Park', 'Baldwin Park', 'College Park', 'Downtown Orlando']
  },
  {
    title: 'Southwest Metro',
    areas: ['Kissimmee', "Hunter's Creek", 'Meadow Woods', 'Southchase', 'Celebration']
  },
  {
    title: 'Greater Central Florida',
    areas: ['Surrounding communities by request', 'HOA and multi-unit projects welcome']
  }
]

const projectShowcase = [
  {
    title: 'Exterior painting & paver sealing',
    body: 'Full exterior repaints, pressure washing, sanding, and paver sealing built for Florida weather.',
    image: 'projects/project-exterior-painting-paver-sealing.jpg'
  },
  {
    title: 'Kitchen transformations',
    body: 'Cabinet painting, countertops, backsplash, lighting, and hardware updates.',
    image: 'projects/project-kitchen-transformations.jpg'
  },
  {
    title: 'Interior whole-home painting',
    body: 'Premium interior finishes with protected floors, furniture, and spotless daily cleanup.',
    image: 'projects/project-interior-whole-home-painting.jpg'
  },
  {
    title: 'Bathroom refresh & tile refinishing',
    body: 'Modernize dated bathrooms with tile refinishing, wallpaper removal, and new paint.',
    image: 'projects/project-bathroom-tile-refinishing.jpg'
  },
  {
    title: 'Exterior pressure washing',
    body: 'Driveways, siding, pavers, and outdoor surfaces cleaned and restored to like-new condition.',
    image: 'projects/project-exterior-pressure-washing.jpg'
  },
  {
    title: 'Fence & deck staining',
    body: 'Even stain application with neighbor-friendly prep and polished results.',
    image: 'projects/project-fence-deck-staining.jpg'
  },
  {
    title: 'Business projects',
    body: 'Organized crews for offices, retail, HOA, and multi-unit properties with clear communication.',
    image: 'projects/project-business-projects.jpg'
  },
  {
    title: 'Prep-for-sale touch-ups',
    body: 'Listing-ready painting, stucco repair, and fast turnarounds before market.',
    image: 'projects/project-prep-for-sale-touch-ups.jpg'
  }
]

const testimonials = [
  {
    name: 'Larry Truong',
    service: 'Exterior painting',
    quote:
      'Mauricio and the Pixel Paint team did a fantastic job with a full cleaning and exterior painting of my home as well as pressure washing, sanding and sealing pavers. He provided regular updates, and I appreciated him taking care of smaller items during the process.'
  },
  {
    name: 'Ricardo De Biase',
    service: 'Exterior painting',
    quote:
      'Great price. The crew Mauricio runs is amazing and very professional, my house was painted perfectly, on time and within a reasonable price and no one beats Pixel\'s warranty.'
  },
  {
    name: 'Irene Montanaro',
    service: 'Bathroom refresh',
    quote:
      'He was able to paint and refinish our tile making it appear much more modern. He also stripped two layers of old wallpaper, textured the wall and painted it. The entire process was very professional and the work area was kept clean.'
  },
  {
    name: 'Jennifer Fitzgerald',
    service: 'Kitchen renovation',
    quote:
      'Mauricio and his team at Pixel Paint completely transformed what was a very brown dull kitchen into something I am so excited to host friends and family in! Process was smooth and quick from start to finish.'
  },
  {
    name: 'Justin Q',
    service: 'Exterior painting',
    quote:
      'Pixel Paint is one of the few companies that doesn\'t forget you even after the job is done. When we had an issue years later, Mauricio replied within minutes that he\'d take care of us. They live up to their word.'
  },
  {
    name: 'Eric Whitten',
    service: 'Kitchen renovation',
    quote:
      'We used Mauricio and his team to renovate our kitchen, including painting cabinets, new countertops, new backsplash, and new lighting. Responsive, easy to work with, and a great overall value.'
  },
  {
    name: 'Kristina Herndon',
    service: 'Interior painting',
    quote:
      'We had them do a full interior paint job of our house — it looks great! The crew was friendly, professional, and quiet as a mouse while they worked. We highly recommend their services.'
  },
  {
    name: 'Josie Kassem',
    service: 'Exterior painting',
    quote:
      'Pixel Paint Renovations did an outstanding job providing us with information about different types of paint and painting our house professionally. Their warranty is second to none.'
  },
  {
    name: 'Pamela Bolingbroke',
    service: 'Interior painting',
    quote:
      'I managed a paint manufacturing company for 15 years and typically painted my homes myself. I feel qualified to give Pixel Paint Renovations a five star rating for workmanship and materials.'
  },
  {
    name: 'Michelle Ospina',
    service: 'Commercial painting',
    quote:
      'Highly recommend. They are very responsive and solution-oriented. All workers are background checked and the project manager is regularly on site overseeing all work.'
  },
  {
    name: 'Luis D',
    service: 'Exterior painting',
    quote:
      'From the very beginning Mauricio was great in explaining everything and going over color options. Jonathan and John did a phenomenal job painting and were great at keeping the site as clean as possible.'
  },
  {
    name: 'Kristi House',
    service: 'Interior & exterior',
    quote:
      'We had a great experience with Mauricio and his team. They are professional, detailed and easy to work with. Highly recommend!'
  }
]

const pages = {
  home: {
    path: '',
    title: 'Pixel Paint Renovations | House Painting & Home Renovations in Orlando',
    description:
      'Trusted painting and renovation team serving Lake Nona, Orlando, and Central Florida. Interior & exterior painting, kitchen and bathroom updates, and warranty-backed craftsmanship.',
    hero: {
      eyebrow: 'House Painting & Renovations',
      headline: 'Trusted painters and renovators for homes across Central Florida',
      body:
        'Looking for a reliable local team for painting or renovations? Pixel Paint and Renovations delivers quality craftsmanship, clear communication, and results that last — backed by a warranty customers rave about.',
      microcopy: 'Licensed & insured · Background-checked crew · Free estimates · Serving Lake Nona & Orlando metro'
    },
    blocks: [
      { type: 'services' },
      { type: 'projectShowcase', limit: 3 },
      {
        type: 'textSplit',
        sections: [
          {
            title: 'Renovation excellence rooted in Lake Nona',
            body:
              'Pixel Paint and Renovations Inc was built on Mauricio Tascon\'s commitment to treating every home like his own. From single-room refreshes to full exterior repaints and kitchen transformations, the team has earned repeat business across Orlando through word of mouth and neighbor referrals.'
          },
          {
            title: 'From quote to final walkthrough',
            body:
              'Whether you need help choosing paint grades, sealing Florida stucco cracks, or coordinating a kitchen update before listing your home, Pixel brings organized crews, on-site oversight, and the kind of follow-through that keeps clients coming back for the next project.'
          }
        ]
      },
      { type: 'benefits' },
      { type: 'serviceAreas' },
      { type: 'testimonials', limit: 6 }
    ]
  },
  servicesPage: {
    path: 'services/',
    title: 'Services | Pixel Paint Renovations',
    description:
      'Interior and exterior painting, kitchen renovations, bathroom refreshes, cabinet refinishing, pressure washing, and stucco repair in Central Florida.',
    hero: {
      eyebrow: 'Our Services',
      headline: 'Complete painting and renovation services for your home',
      body:
        'From premium interior and exterior painting to kitchen cabinets, bathroom tile refinishing, and prep-for-sale touch-ups, Pixel Paint handles projects with the same care on every job site.'
    },
    blocks: [{ type: 'services', full: true }, { type: 'testimonials', limit: 4 }]
  },
  kitchenPage: {
    path: 'kitchen-renovations/',
    title: 'Kitchen Renovations | Pixel Paint Renovations',
    description:
      'Kitchen cabinet painting, countertops, backsplash, lighting, and hardware updates in Lake Nona and Orlando.',
    hero: {
      eyebrow: 'Kitchen Renovations',
      headline: 'Transform your kitchen without starting from scratch',
      body:
        'Refresh dated cabinets with durable finishes, update countertops and backsplash, add under-cabinet lighting, and modernize hardware — all managed by a responsive local team.'
    },
    blocks: [
      {
        type: 'textSplit',
        sections: [
          {
            title: 'Cabinet painting & refinishing',
            body:
              'Factory-smooth cabinet finishes in modern colors, with expert color pairing for upper and lower cabinets, flat black hardware, and under-cabinet lighting where it makes the biggest impact.'
          },
          {
            title: 'Counters, backsplash & lighting',
            body:
              'Coordinate countertop replacement, backsplash installation, and lighting updates in one project so your kitchen feels cohesive, brighter, and ready for guests.'
          }
        ]
      },
      { type: 'testimonials', filter: 'Kitchen', limit: 3 }
    ]
  },
  bathroomPage: {
    path: 'bathroom-renovations/',
    title: 'Bathroom Renovations | Pixel Paint Renovations',
    description:
      'Cost-effective bathroom refreshes with tile refinishing, wallpaper removal, texture repair, and professional painting in Central Florida.',
    hero: {
      eyebrow: 'Bathroom Refresh',
      headline: 'Modernize a dated bathroom without a full gut renovation',
      body:
        'Paint and refinish existing tile, remove old wallpaper, retexture walls, and deliver a cleaner, brighter bathroom while keeping noise and disruption to a minimum.'
    },
    blocks: [
      {
        type: 'textSplit',
        sections: [
          {
            title: 'Tile refinishing & paint updates',
            body:
              'When a full remodel isn\'t in the budget, refinishing tile and updating wall finishes can make a dated bathroom feel dramatically more modern.'
          },
          {
            title: 'Clean, respectful work sites',
            body:
              'Pixel teams protect surrounding areas, keep pathways usable, and communicate clearly so you can stay comfortable at home during the refresh.'
          }
        ]
      },
      { type: 'testimonials', filter: 'Bathroom', limit: 2 }
    ]
  },
  aboutPage: {
    path: 'about/',
    title: 'About | Pixel Paint Renovations',
    description:
      'Meet Mauricio Tascon and the Pixel Paint team — professional painters and renovators serving Lake Nona and Central Florida.',
    hero: {
      eyebrow: 'About Pixel Paint',
      headline: 'Professional painters who treat your home like their own',
      body:
        'Led by Mauricio Tascon, Pixel Paint and Renovations Inc combines organized project management, premium materials, and the warranty-backed service that keeps neighbors recommending the team.'
    },
    blocks: [
      {
        type: 'textSplit',
        sections: [
          {
            title: 'Built on trust and referrals',
            body:
              'Pixel Paint grew through word of mouth from homeowners across Lake Nona, Laureate Park, and the greater Orlando area. Clients return for second projects because the team communicates clearly, shows up on schedule, and stands behind the work.'
          },
          {
            title: 'How we work',
            body:
              'Every project starts with a thorough walk-through, clear scope, and realistic timeline. Crews are background checked, sites are protected daily, and Mauricio stays involved from color selection through final walkthrough.'
          }
        ]
      },
      { type: 'benefits' },
      {
        type: 'values',
        items: [
          ['Quality first', 'Premium paint grades, proper prep, and finishes chosen for Florida conditions.'],
          ['Clear communication', 'Timely updates and a project manager on site when it matters most.'],
          ['Respect for your home', 'Clean job sites, protected floors and furniture, and considerate neighbors.'],
          ['Warranty & follow-through', 'Support after the job is done — because great service doesn\'t end at final payment.']
        ]
      }
    ]
  },
  contactPage: {
    path: 'contact/',
    title: 'Contact | Pixel Paint Renovations',
    description:
      'Request a free painting or renovation quote from Pixel Paint and Renovations in Lake Nona and Orlando, FL.',
    hero: {
      eyebrow: 'Contact',
      headline: 'Request a free quote or ask a question',
      body:
        'Call, email, or send project details below. Share photos of your space and the services you need — we\'ll respond quickly with next steps.'
    },
    blocks: [{ type: 'contact' }, { type: 'testimonials', limit: 6 }]
  },
  projectsPage: {
    path: 'projects/',
    title: 'Projects | Pixel Paint Renovations',
    description:
      'Recent painting and renovation projects across Lake Nona, Orlando, and Central Florida. See our work on Instagram and Facebook.',
    ogImage: OG_IMAGE,
    hero: {
      eyebrow: 'Our Projects',
      headline: 'Quality craftsmanship across Central Florida homes',
      body:
        'From exterior repaints and kitchen updates to community hallway projects, Pixel Paint delivers organized crews, premium materials, and results homeowners recommend.'
    },
    blocks: [
      { type: 'socialGalleryIntro' },
      { type: 'projectShowcase', full: true }
    ]
  }
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

function setMeta(page) {
  document.title = page.title
  const description = page.description
  upsertMeta('name', 'description', description)

  const ogImage = absoluteUrl(page.ogImage || OG_IMAGE)
  const ogUrl = absoluteUrl(page.path || '')
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
    areaServed: 'Central Florida',
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
      <a class="btn btn-primary" href="${route(path)}">${label}</a>
    </div>
  `
}

function renderActions(primaryLabel, primaryHref, secondaryLabel, secondaryHref) {
  const primary = route(primaryHref || 'contact/')
  const secondary = secondaryHref ? route(secondaryHref) : ''
  return `
    <div class="actions">
      <a class="btn btn-primary" href="${primary}"${attrsForExternal(primary)}>${primaryLabel}</a>
      ${
        secondaryLabel
          ? `<a class="btn btn-secondary" href="${secondary}"${attrsForExternal(secondary)}>${secondaryLabel}</a>`
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

function renderHeader(pageKey) {
  return `
    <header class="site-header">
      <div class="header-brand">
        <a href="${href('')}" class="logo" aria-label="${COMPANY_LEGAL_NAME} home">
          <img src="${href('logo.png')}" alt="${COMPANY_LEGAL_NAME}" />
        </a>
      </div>
      <nav id="primary-nav" aria-label="Primary navigation">
        ${nav
          .map(
            (item) =>
              `<a href="${href(item.path)}" ${item.page === pageKey ? 'aria-current="page"' : ''}>${item.label}</a>`
          )
          .join('')}
      </nav>
      <div class="header-actions">
        <a class="header-phone" href="tel:${CONTACT_PHONE_TEL}">${CONTACT_PHONE_DISPLAY}</a>
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
      ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
      <h2>${title}</h2>
      ${body ? `<p>${body}</p>` : ''}
    </div>
  `
}

function renderHero(page, pageKey) {
  if (pageKey === 'home') {
    return `
      <section class="hero home-hero" id="top">
        <div class="hero-banner">
          <img src="${href(HERO_IMAGE)}" alt="Pixel Paint Renovations serving Lake Nona and Central Florida" />
        </div>
        <div class="hero-grid">
          <div class="hero-copy">
            <span class="eyebrow">${page.hero.eyebrow}</span>
            <h1>${page.hero.headline}</h1>
            <p>${page.hero.body}</p>
            <p class="hero-trust">${page.hero.microcopy} · <a href="tel:${CONTACT_PHONE_TEL}">Call ${CONTACT_PHONE_DISPLAY}</a></p>
          </div>
          <div class="hero-form-panel" id="quote">
            ${renderQuoteFormInner('Request a Free Quote', true)}
          </div>
        </div>
      </section>
    `
  }

  return `
    <section class="hero page-hero" id="top">
      <div class="hero-copy">
        <span class="eyebrow">${page.hero.eyebrow}</span>
        <h1>${page.hero.headline}</h1>
        <p>${page.hero.body}</p>
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

function renderQuoteFormInner(title, compact = false) {
  return `
    <form class="lead-form quote-form ${compact ? 'quote-form-compact' : ''}" novalidate>
      <h2>${title}</h2>
      <p class="form-intro">Tell us about your project and we will follow up quickly.</p>
      <label for="name">Your Name*
        <input id="name" name="name" type="text" required autocomplete="name" />
      </label>
      <label for="email">Your Email*
        <input id="email" name="email" type="email" required autocomplete="email" />
      </label>
      <label for="phone">Phone Number*
        <input id="phone" name="phone" type="tel" required autocomplete="tel" />
      </label>
      <label for="address">Address
        <input id="address" name="address" type="text" autocomplete="street-address" />
      </label>
      <label for="service">I'm Interested In*
        <select id="service" name="service" required>
          <option value="">Please choose an option</option>
          ${serviceOptions.map((option) => `<option value="${option}">${option}</option>`).join('')}
        </select>
      </label>
      <label for="photo">Upload a photo of your project (optional)
        <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
      </label>
      <label class="full-field" for="message">How may we help you?*
        <textarea id="message" name="message" rows="4" required placeholder="Share project details, timeline, or questions."></textarea>
      </label>
      <button class="btn btn-primary" type="submit">Submit Request</button>
      <p class="form-confirmation" hidden>Thank you! Your request has been captured. We will contact you shortly.</p>
    </form>
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

function renderServices(full = false) {
  return `
    <section id="services">
      ${sectionHeading(
        'What We Do',
        'Painting and renovation services for every part of your home',
        'Whether you need a full exterior repaint, a kitchen refresh, or prep-for-sale touch-ups, Pixel Paint delivers organized crews and warranty-backed results.'
      )}
      <div class="services-grid${full ? '' : ' services-bento'}">
        ${services
          .map(
            (service, index) => `
              <article class="service-card${!full && (index === 2 || index === 3) ? ' service-card-featured' : ''}">
                <span class="service-icon service-icon-${(index % 4) + 1}" aria-hidden="true"></span>
                <h3>${service.title}</h3>
                <p>${service.body}</p>
                ${service.learnHref ? `<a class="learn-link" href="${route(service.learnHref)}">Learn more</a>` : ''}
              </article>`
          )
          .join('')}
      </div>
      ${full ? `<div class="section-actions"><a class="text-link" href="${href('contact/')}">Get a Free Quote</a></div>` : ''}
    </section>
  `
}

function renderSocialGalleryIntro() {
  return `
    <section class="gallery-intro">
      ${sectionHeading(
        'Project Photos',
        'See our latest work online',
        'We post fresh project photos on Instagram and Facebook. Follow Pixel Paint for before-and-after updates, finished kitchens, exterior repaints, and more.'
      )}
      <div class="social-gallery-actions">
        <a class="text-link" href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer">View Instagram</a>
      </div>
    </section>
  `
}

function renderProjectShowcase(block) {
  const limit = block.limit || projectShowcase.length
  const items = projectShowcase.slice(0, limit)

  return `
    <section id="projects" class="projects-section">
      ${sectionHeading(
        'Project Showcase',
        'Painting and renovation work homeowners trust',
        block.full
          ? 'A sample of the services Pixel Paint delivers across Lake Nona, Orlando, and Central Florida.'
          : 'Recent project types we handle every week across the Orlando metro.'
      )}
      <div class="projects-grid">
        ${items
          .map(
            (item) => `
              <article class="project-card">
                <img src="${href(item.image)}" alt="${item.title}" loading="lazy" />
                <div class="project-card-body">
                  <h3>${item.title}</h3>
                  <p>${item.body}</p>
                </div>
              </article>`
          )
          .join('')}
      </div>
      ${
        block.full
          ? ''
          : `<div class="section-actions"><a class="text-link" href="${href('projects/')}">View All Projects</a></div>`
      }
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
                <h3>${title}</h3>
                <p>${body}</p>
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
                <h3>${group.title}</h3>
                <ul>${group.areas.map((area) => `<li>${area}</li>`).join('')}</ul>
              </article>`
          )
          .join('')}
      </div>
    </section>
  `
}

function renderTestimonials(block) {
  const limit = block.limit || testimonials.length
  const filter = block.filter
  const items = testimonials
    .filter((item) => !filter || item.service.toLowerCase().includes(filter.toLowerCase()))
    .slice(0, limit)

  return `
    <section id="reviews" class="reviews-section">
      ${sectionHeading(
        'Customer Reviews',
        'What homeowners say about Pixel Paint',
        'Real feedback from painting and renovation clients across Central Florida.'
      )}
      <div class="reviews-grid reviews-carousel">
        ${items
          .map(
            (item) => `
              <article class="review-card">
                <div class="review-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>${item.quote}</blockquote>
                <footer>
                  <strong>${item.name}</strong>
                  <span>${item.service}</span>
                </footer>
              </article>`
          )
          .join('')}
      </div>
    </section>
  `
}

function renderTextSplit(block) {
  return `
    <section class="text-split">
      ${block.sections.map((item) => `<article><h2>${item.title}</h2><p>${item.body}</p></article>`).join('')}
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
                <h3>${title}</h3>
                <p>${body}</p>
              </article>`
          )
          .join('')}
      </div>
    </section>
  `
}

function renderCta(block) {
  return `
    <section class="cta-panel ${block.final ? 'final-cta' : ''}">
      <span class="eyebrow">${block.final ? 'Ready to start?' : 'Next step'}</span>
      <h2>${block.title}</h2>
      <p>${block.body}</p>
      ${renderPrimaryAction('Get a Free Quote', 'contact/')}
      <p class="cta-note">${block.note}</p>
    </section>
  `
}

function renderContact() {
  return `
    <section id="contact" class="contact-layout">
      <div class="contact-details">
        ${sectionHeading(
          'Get in touch',
          'We are ready to help with your next project',
          'Reach out by phone, email, or the form. Follow us on Instagram and Facebook for recent project photos.'
        )}
        <ul class="contact-list">
          <li><strong>Phone</strong> <a href="tel:${CONTACT_PHONE_TEL}">${CONTACT_PHONE_DISPLAY}</a></li>
          <li><strong>Email</strong> <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></li>
          <li><strong>Location</strong> ${BUSINESS_LOCATION}</li>
          <li><strong>Instagram</strong> <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer">@pixelpaint.renovations</a></li>
          <li><strong>Facebook</strong> <a href="${FACEBOOK_URL}" target="_blank" rel="noopener noreferrer">Pixel Paint and renovations Inc</a></li>
        </ul>
        <div class="map-embed">
          <iframe
            title="Lake Nona, Florida map"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Lake%20Nona%2C%20FL&output=embed"
          ></iframe>
        </div>
      </div>
      ${renderQuoteFormInner('Request a Free Quote')}
    </section>
  `
}

function renderBlock(block) {
  if (block.type === 'quoteForm') return renderQuoteForm()
  if (block.type === 'services') return renderServices(block.full)
  if (block.type === 'projectShowcase') return renderProjectShowcase(block)
  if (block.type === 'socialGalleryIntro') return renderSocialGalleryIntro()
  if (block.type === 'benefits') return renderBenefits()
  if (block.type === 'serviceAreas') return renderServiceAreas()
  if (block.type === 'testimonials') return renderTestimonials(block)
  if (block.type === 'textSplit') return renderTextSplit(block)
  if (block.type === 'values') return renderValues(block)
  if (block.type === 'cta') return renderCta(block)
  if (block.type === 'contact') return renderContact()
  return ''
}

function renderFooter() {
  return `
    <footer>
      <div>
        <a href="${href('')}" class="footer-logo"><img src="${href('logo.png')}" alt="${COMPANY_LEGAL_NAME}" /></a>
        <p>${COMPANY_LEGAL_NAME} — professional painting and home renovations serving Lake Nona, Orlando, and Central Florida.</p>
      </div>
      <nav aria-label="Footer navigation">
        ${nav.map((item) => `<a href="${href(item.path)}">${item.label}</a>`).join('')}
        <a href="${href('kitchen-renovations/')}">Kitchen Renovations</a>
        <a href="${href('bathroom-renovations/')}">Bathroom Refresh</a>
        <a href="${href('projects/')}">Projects</a>
      </nav>
      <div class="footer-cta">
        <a href="tel:${CONTACT_PHONE_TEL}">${CONTACT_PHONE_DISPLAY}</a>
        <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
        <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="${FACEBOOK_URL}" target="_blank" rel="noopener noreferrer">Facebook</a>
        <span>Serving ${BUSINESS_LOCATION} and Central Florida.</span>
      </div>
    </footer>
  `
}

function bindForm(form) {
  form?.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    const confirmation = form.querySelector('.form-confirmation')
    if (confirmation) confirmation.hidden = false
    form.querySelector('button[type="submit"]')?.setAttribute('disabled', 'true')
  })
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
}

export function mountPage(pageKey) {
  const app = document.querySelector('#app')
  const page = pages[pageKey]
  if (!app || !page) return

  setMeta(page)
  injectLocalBusinessSchema()

  const html = `
    <div class="wrapper ${pageKey === 'home' ? 'home-wrapper' : ''}">
      ${renderHeader(pageKey)}
      <main>
        ${renderHero(page, pageKey)}
        ${page.blocks.map(renderBlock).join('')}
      </main>
      ${renderFooter()}
      ${pageKey !== 'home' && pageKey !== 'contactPage' ? `<a class="mobile-sticky-cta" href="${href('contact/')}">Get a Free Quote</a>` : ''}
    </div>
  `

  app.innerHTML = html
  bindInteractions(app)
}
