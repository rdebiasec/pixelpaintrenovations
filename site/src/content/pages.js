import { OG_IMAGE } from '../legal/constants.js'
import { WARRANTY_QUOTE_NOTE, WARRANTY_SUMMARY } from './warranty.js'

export const pages = {
  home: {
    path: '',
    title: 'Pixel Paint Renovations | House Painting & Home Renovations in Orlando',
    description:
      'Lake Nona painting and renovation crew — interior & exterior painting, kitchen and bathroom updates, warranty-backed craftsmanship, and free estimates across Central Florida.',
    hero: {
      eyebrow: 'House Painting & Renovations · Lake Nona & Orlando',
      headline: "Lake Nona's trusted paint & renovation team.",
      lead:
        'Interior and exterior painting, kitchen cabinet refinishing, bathroom tile refresh, pressure washing, paver sealing, and prep-for-sale touch-ups — one local crew, one project manager, and a warranty neighbors talk about.',
      body:
        'Pixel Paint and Renovations oversees every project from walkthrough to final payment — written scope, protected job sites, and premium materials chosen for Florida humidity, sun, and stucco.',
      highlights: [
        'Free on-site walkthroughs and written estimates — no pressure',
        'Background-checked crews who respect your home and clean up daily',
        'Kitchen & bathroom refreshes without months of demolition dust',
        'Exterior repaints, stucco crack sealing, and paver wash-and-seal',
        'Warranty support after final payment — full written terms with every quote (details pending final review)'
      ],
      microcopy:
        'Fully insured · Background-checked crew · Free estimates · Written warranty with every quote · Lake Nona, Orlando & Central Florida'
    },
    blocks: [
      { type: 'services' },
      { type: 'processSteps' },
      { type: 'projectShowcase', limit: 3, layout: 'featured' },
      {
        type: 'textSplit',
        sections: [
          {
            title: 'Local team. Real accountability.',
            body:
              'Pixel Paint and Renovations Inc grew through referrals across Lake Nona, Laureate Park, and the greater Orlando area — not ads. Our team stays on your project from the first walkthrough to the final walkthrough, with crews who treat your home like their own.'
          },
          {
            title: 'Built for Florida homes',
            body:
              'Humidity, stucco cracks, harsh sun, and HOA timelines are part of the job here. We choose paint grades, sealers, and prep steps that hold up in Central Florida — whether you are refreshing one room or coordinating a kitchen update before listing.'
          }
        ]
      },
      { type: 'benefits' },
      { type: 'serviceAreas' },
      { type: 'instagramStrip' },
      { type: 'warrantyPanel' },
      { type: 'testimonials', limit: 6, featured: true }
    ]
  },
  servicesPage: {
    path: 'services/',
    title: 'Services | Pixel Paint Renovations',
    description:
      'Book Lake Nona paint and renovation — interiors, kitchens, baths, stucco prep — without contractor chaos: written quotes, the same crew and PM from walkthrough to finish, and warranty-backed craftsmanship across Orlando and Central Florida.',
    hero: {
      eyebrow: 'Lake Nona & Orlando · Referral-backed paint & renovation',
      headline: 'The crew who quotes your home is the crew who paints it.',
      lead:
        'Tell us what you want refreshed — interior and exterior paint, cabinets and trim, a kitchen or bath update, stucco repair, or listing prep. We walk the home, send a written quote with a clear start date, and schedule the same background-checked team — one project manager from first visit to final walkthrough.',
      body:
        'Pixel Paint and Renovations grew through Lake Nona neighbor referrals because we skip the usual contractor headaches: no surprise subs, no vague allowances, protected job sites every day, and a PM you can still reach after final payment. For Orlando homes, that means humidity-smart prep on stucco and wood, floors covered and rooms usable between coats, and a posted schedule you can plan around — not a chain of stranger handoffs. Warranty included with every quote.',
      stats: [
        { label: 'PAINT', detail: 'Interiors, exteriors & cabinets — one crew, one schedule' },
        { label: 'RENOVATE', detail: 'Kitchens & baths without months of dust' },
        { label: 'EXTERIOR CARE', detail: 'Stucco repair, wash, seal & curb appeal' },
        { label: 'RESTORE', detail: 'Touch-ups before you go to market' }
      ],
      trust:
        'Referral-driven · Fully insured · Background-checked crew · Written warranty with every quote · Free on-site walkthroughs · Lake Nona, Orlando & Central Florida'
    },
    blocks: [
      {
        type: 'textSplit',
        accent: 'blue',
        sections: [
          {
            title: 'Exterior painting built for Central Florida',
            body:
              'Stucco crack repair, thorough wash-and-scrape prep, trim and fascia detail, and premium exterior grades chosen for harsh sun and rain. We coordinate HOA-friendly schedules across Lake Nona, Laureate Park, and the greater Orlando area — one crew from walkthrough to final touch-ups.'
          },
          {
            title: 'Interior painting without the mess',
            body:
              'Whole-home repaints, accent walls, ceiling refreshes, and cabinet-adjacent trim with floors covered, furniture protected, and rooms left usable at the end of each day. Premium interior grades, clean edges, and a project manager who stays reachable until final walkthrough.'
          }
        ]
      },
      {
        type: 'services',
        full: true,
        heading: {
          eyebrow: 'What We Do',
          title: 'Pick your project — we handle the crew, prep, and cleanup',
          body:
            'Four categories cover everything Pixel Paint delivers in Central Florida: premium paint work, smart renovations, exterior care, and restore-and-list prep. Same organized teams, same project manager, zero juggling vendors.'
        }
      },
      { type: 'warrantyStrip', homeWarranty: true },
      { type: 'testimonials', all: true, columns: 3, source: 'Google' }
    ]
  },
  kitchenPage: {
    path: 'kitchen-renovations/',
    title: 'Kitchen Renovations | Pixel Paint Renovations',
    description:
      'Kitchen cabinet painting, countertops, backsplash, lighting, and hardware updates in Lake Nona and Orlando — without months of demolition.',
    hero: {
      eyebrow: 'Kitchen Renovations',
      headline: 'A kitchen you are proud to host in — without starting from scratch',
      body:
        'Durable cabinet finishes for Florida humidity, updated counters and backsplash, under-cabinet lighting, and modern hardware — coordinated by Pixel Paint and Renovations so your kitchen feels new in days, not months.'
    },
    blocks: [
      {
        type: 'textSplit',
        sections: [
          {
            title: 'Cabinet painting that lasts',
            body:
              'Factory-smooth finishes in colors you will love, with expert pairing for uppers and lowers, flat black or brushed hardware, and coatings chosen to stand up to steam, grease, and daily use.'
          },
          {
            title: 'Counters, backsplash & lighting',
            body:
              'One schedule for countertop replacement, backsplash install, and lighting updates — so the finished kitchen feels intentional, brighter, and ready for guests.'
          },
          {
            title: 'Your timeline, step by step',
            body:
              'Walkthrough → written quote → color selection → protected prep → install coordination → final walkthrough. Most kitchen refreshes run on a focused calendar with minimal disruption to your routine.'
          }
        ]
      },
      { type: 'projectShowcase', filter: 'kitchen', limit: 3 },
      { type: 'testimonials', filter: 'Kitchen', limit: 3 },
      { type: 'textLinkCta', label: 'Get a Free Quote', href: 'contact/', note: 'Tell us about your kitchen — photos help us quote faster.' }
    ]
  },
  bathroomPage: {
    path: 'bathroom-renovations/',
    title: 'Bathroom Refresh | Pixel Paint Renovations',
    description:
      'Cost-effective bathroom refreshes with tile refinishing, wallpaper removal, and professional painting in Lake Nona and Central Florida.',
    hero: {
      eyebrow: 'Bathroom Refresh',
      headline: 'A brighter bathroom — without weeks of demolition',
      body:
        'Refinish existing tile, strip dated wallpaper, retexture walls, and apply moisture-aware paint. Ideal for Orlando humidity, HOA-friendly timelines, and homeowners who want a modern look on a practical budget.'
    },
    blocks: [
      {
        type: 'textSplit',
        sections: [
          {
            title: 'Tile refinishing & paint',
            body:
              'When a full remodel is not the plan, refinishing tile and updating wall color can make a 1990s bathroom feel current — with finishes selected for moisture and everyday cleaning.'
          },
          {
            title: 'Respectful work while you live at home',
            body:
              'Pathways stay open, surrounding rooms stay protected, and you know each day\'s schedule before crews arrive. Wallpaper removal, texture repair, and paint are sequenced to limit dust and downtime.'
          },
          {
            title: 'What to expect',
            body:
              'Most bathroom refreshes finish in a few focused days depending on tile condition and wall repairs. You will know when fixtures are back in use before work starts.'
          }
        ]
      },
      { type: 'projectShowcase', filter: 'bathroom', limit: 2 },
      { type: 'testimonials', filter: 'Bathroom', limit: 2 },
      { type: 'textLinkCta', label: 'Get a Free Quote', href: 'contact/', note: 'Send a few photos of your bathroom — we respond quickly.' }
    ]
  },
  aboutPage: {
    path: 'about/',
    title: 'About | Pixel Paint Renovations',
    description:
      'Lake Nona painting and renovation team from Pixel Paint and Renovations — referral-driven, warranty-backed, and built on clear communication across Central Florida.',
    hero: {
      eyebrow: 'About · Lake Nona & Orlando',
      headline: 'A local paint and renovation crew neighbors actually recommend',
      lead:
        'Pixel Paint and Renovations Inc grew through repeat clients and word of mouth across Lake Nona, Laureate Park, and Orlando — not flashy ads or subcontractor handoffs.',
      body:
        'Pixel Paint and Renovations leads every project with written scope, protected job sites, and premium materials chosen for Florida humidity and sun. One accountable project manager from walkthrough to warranty follow-up.',
      stats: [
        { label: 'Rooted here', detail: 'Lake Nona & Central Florida focus' },
        { label: 'Referrals', detail: 'Repeat clients & neighbor recommendations' },
        { label: 'Warranty', detail: 'Written terms with every quote — pending final review' },
        { label: 'Vetted crew', detail: 'Background-checked painters on site' }
      ],
      trust:
        'Fully insured · Written warranty with every project · Free on-site estimates · Lake Nona, Orlando & Central Florida'
    },
    blocks: [
      {
        type: 'textSplit',
        sections: [
          {
            title: 'Booked because neighbors vouch — not coupons',
            body:
              'Most new clients find Pixel Paint through a friend, HOA group, or a second project at the same address. That keeps us focused on communication, schedule discipline, and finishes that hold up — the reasons people come back.'
          },
          {
            title: 'What happens from first call to final walkthrough',
            body:
              'On-site walkthrough and written scope. Color and material selection locked before prep. Floors, furniture, and pathways protected daily. Progress updates when it matters. Punch-list and warranty details spelled out before you pay.'
          }
        ]
      },
      { type: 'meetTeam' },
      { type: 'benefits' },
      {
        type: 'values',
        items: [
          ['Quality first', 'Premium paint grades, proper prep, and finishes chosen for Florida conditions.'],
          ['Clear communication', 'Timely updates and a project manager on site when it matters most.'],
          ['Respect for your home', 'Clean job sites, protected floors and furniture, and considerate neighbors.'],
          ['Warranty & follow-through', `${WARRANTY_SUMMARY} ${WARRANTY_QUOTE_NOTE}`]
        ]
      },
      { type: 'warrantyStrip', homeWarranty: true }
    ]
  },
  contactPage: {
    path: 'contact/',
    title: 'Contact | Pixel Paint Renovations',
    description:
      'Request a free painting or renovation quote from Pixel Paint and Renovations in Lake Nona and Orlando, FL.',
    hero: {
      eyebrow: 'Free Quote · Lake Nona & Orlando',
      headline: 'Your project deserves a reply you can actually plan around',
      lead:
        'Most quote requests get a personal response within XXX hours — often faster when you include photos and your ideal start date.',
      body:
        'Summer humidity, hurricane prep, and pre-listing touch-ups keep Central Florida crews busy. Tell us what you are planning now and we will scope it on a free walkthrough — with written warranty terms before work starts.',
      stats: [
        { label: 'Response', detail: 'XXX hours — personal reply target' },
        { label: 'Estimates', detail: 'Free on-site walkthroughs' },
        { label: 'Service area', detail: 'Lake Nona, Orlando & metro' },
        { label: 'Warranty', detail: 'Written terms with every quote' }
      ],
      trust:
        'Fully insured · Background-checked crew · Photo uploads welcome · Florida-ready materials'
    },
    blocks: [
      {
        type: 'contact',
        heading: {
          eyebrow: 'Reach Pixel Paint',
          title: 'One message starts your quote — no phone tag required',
          body:
            'Call us directly, email project photos, or use the form. Every path lands with the same project manager who runs your walkthrough and warranty follow-up.'
        }
      },
      { type: 'warrantyStrip', homeWarranty: true },
      {
        type: 'testimonials',
        limit: 6,
        columns: 3,
        heading: {
          eyebrow: 'Neighbor proof',
          title: 'Homeowners who started with one message',
          body:
            'Real feedback from Lake Nona and Orlando clients who reached out the same way you are about to — before crews ever arrived.'
        }
      }
    ]
  },
  projectsPage: {
    path: 'projects/',
    title: 'Projects | Pixel Paint Renovations',
    description:
      'How Pixel Paint runs painting and renovation projects in Lake Nona and Orlando — free home visit, written quote, protected prep, and warranty-backed finishes.',
    ogImage: OG_IMAGE,
    hero: {
      eyebrow: 'How We Run Jobs · Lake Nona & Orlando',
      headline: 'Clear price. Clean job site. Finish you will love.',
      lead:
        'Every project starts with a free home visit and written quote, runs with one project manager and protected prep, and ends with a walkthrough plus warranty in writing.',
      body:
        'Homeowners tell us they want three things: know the cost upfront, keep the house livable during work, and trust the crew will stand behind the finish. That is how we run every paint and renovation job in Lake Nona and Orlando.',
      stats: [
        { label: 'Clear quote', detail: 'Free visit, written price before prep starts' },
        { label: 'Prep done right', detail: 'Stucco repair, primer, coatings chosen for Florida' },
        { label: 'Clean job site', detail: 'Protected floors, daily cleanup, one crew' },
        { label: 'Backed finish', detail: 'Final walkthrough plus written warranty' }
      ],
      trust:
        'Fully insured · Background-checked crew · Free on-site estimates'
    },
    blocks: [
      {
        type: 'projectShowcase',
        full: true,
        heading: {
          eyebrow: 'Finished Work',
          title: 'Real outcomes from the same simple process',
          body:
            'Every project below started with a free visit and written quote, ran with protected prep and daily cleanup, and finished with a walkthrough — kitchens, exteriors, and whole-home repaints across Lake Nona and Orlando.'
        }
      },
      { type: 'warrantyStrip', homeWarranty: true },
      { type: 'socialGalleryIntro' }
    ]
  },
  privacyPage: {
    path: 'privacy/',
    title: 'Privacy Policy | Pixel Paint Renovations',
    description:
      'How Pixel Paint and Renovations Inc collects and uses information submitted through our website quote form.',
    hero: {
      eyebrow: 'Privacy Policy',
      headline: 'Your information stays with us',
      body:
        'We use contact details only to respond to quote requests and project questions. We do not sell personal information.'
    },
    blocks: [{ type: 'privacyPolicy' }]
  }
}

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

export function getSeoRoutes() {
  return seoRoutes.map(({ pageKey, html }) => {
    const page = pages[pageKey]
    return {
      html,
      path: page.path,
      title: page.title,
      description: page.description
    }
  })
}
