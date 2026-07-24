/**
 * One-shot extractor: builds catalogs/en.json from current content modules + UI/form strings.
 * Run from site/: node scripts/extract-en-catalog.mjs
 */
import { writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { nav, serviceSubnav, serviceOptions } from '../src/content/nav.js'
import { services, serviceGroups } from '../src/content/services.js'
import { testimonials } from '../src/content/testimonials.js'
import { projectShowcase } from '../src/content/projects.js'
import { whyChooseUs, serviceAreas } from '../src/content/why-choose-us.js'
import { processSteps } from '../src/content/process.js'
import { pages } from '../src/content/pages.js'
import {
  WARRANTY_HEADLINE,
  WARRANTY_SUMMARY,
  WARRANTY_QUOTE_NOTE,
  WARRANTY_FOOTER_LINE,
  WARRANTY_STRIP_TEXT,
  WARRANTY_TERMS_PLACEHOLDER
} from '../src/content/warranty.js'
import { COMPANY_LEGAL_NAME } from '../src/brand/config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const ui = {
  skipToContent: 'Skip to main content',
  primaryNav: 'Primary navigation',
  toggleNav: 'Toggle navigation',
  specialtyServices: 'Specialty services',
  popularServices: 'Popular services',
  footerNav: 'Footer navigation',
  getFreeQuote: 'Get a Free Quote',
  requestFreeQuote: 'Request a Free Quote',
  learnMore: 'Learn more',
  callPrefix: 'Call',
  writtenWarranty: 'Written warranty',
  freeEstimates: 'Free estimates',
  neighborReviews: '5.0 neighbor reviews',
  referralDriven: 'Referral-driven',
  stickyCtaAria: 'Get a free quote — contact page',
  heroAlt:
    'Lake Nona landmark panorama featuring the VA Medical Center architecture, Town Center with the Disco dog and Wave Hotel, and Boxi Park container buildings in one seamless scene',
  proofServices: 'Same PM from quote to finish',
  proofProjects: 'Same PM start to finish',
  proofContact: 'Free on-site estimates',
  statsServices: 'Service categories',
  statsProjects: 'What you get on every project',
  statsContact: 'Why reach out now',
  statsAbout: 'Why neighbors trust Pixel Paint',
  quoteSectionEyebrow: 'Free Estimate',
  quoteSectionTitle: 'Request a free quote',
  quoteSectionBody:
    'Share your project details and optional photos so we can provide an accurate estimate.',
  servicesDefaultEyebrow: 'What We Do',
  servicesDefaultTitle: 'Painting and renovation services for every part of your home',
  servicesDefaultBody:
    'Whether you need a full exterior repaint, a kitchen refresh, or prep-for-sale touch-ups, Pixel Paint delivers organized crews and warranty-backed results.',
  socialEyebrow: 'More Photos',
  socialTitle: 'Follow us for the latest project updates',
  socialBody:
    'We post fresh before-and-after photos on Instagram and Facebook — kitchens, exteriors, bathrooms, and whole-home repaints across Central Florida.',
  projectsEyebrow: 'Project Showcase',
  projectsTitle: 'Work you can picture in your home',
  projectsBodyHome:
    'Recent project types we handle every week across Lake Nona, Orlando, and the surrounding metro.',
  projectsBodyFull:
    'Every image is from a real Pixel Paint job — protected prep, premium materials, and finishes built for Central Florida.',
  processEyebrow: 'How It Works',
  processTitle: 'Three steps, no guesswork',
  processBody:
    'Know the price before work starts, stay comfortable while we paint, and get a finish backed in writing.',
  benefitsEyebrow: 'Why Choose Pixel Paint',
  benefitsTitle: 'Trusted. Professional. Local.',
  benefitsBody:
    'Homeowners across Central Florida choose Pixel Paint for communication, craftsmanship, and follow-through that lasts beyond the final walkthrough.',
  areasEyebrow: 'Areas We Serve',
  areasTitle: 'Serving Lake Nona, Orlando, and Central Florida',
  areasBody: 'Pixel Paint and Renovations works across the Orlando metro and surrounding communities.',
  reviewsEyebrow: 'Customer Reviews',
  reviewsEyebrowGoogle: 'Google Reviews',
  reviewsTitle: 'What homeowners say about Pixel Paint',
  reviewsTitleGoogle: 'What neighbors say on Google',
  reviewsBody: 'Real feedback from painting and renovation clients across Central Florida.',
  reviewsBodyGoogle: 'Real Google reviews from painting and renovation clients across Central Florida.',
  reviewsAria: 'Customer reviews',
  reviewsMoreAria: 'More customer reviews',
  reviewsCardsAria: 'Customer review cards',
  valuesEyebrow: 'Our Values',
  valuesTitle: 'How we show up on every job',
  instagramEyebrow: 'Fresh project photos',
  instagramBodyBefore: 'See before-and-after kitchens, exteriors, and whole-home repaints on',
  instagramBodyAfter: '— updated weekly across Central Florida.',
  warrantyEyebrow: 'Our Warranty',
  warrantyStripEyebrow: 'Warranty-backed',
  warrantyStripAria: 'Warranty',
  warrantyReviewLink: 'Review full warranty terms',
  warrantyPendingEyebrow: 'Pending review',
  warrantyPendingNote: 'Replace all XXX placeholders with final legal language before launch.',
  teamEyebrow: 'Local crew',
  teamTitle: 'Meet the team behind Pixel Paint and Renovations',
  teamIntro: `${COMPANY_LEGAL_NAME} serves Lake Nona, Orlando, and Central Florida.`,
  teamName: 'Pixel Paint and Renovations',
  teamRole: 'Lake Nona painting & renovation',
  teamBody:
    'We built Pixel Paint around jobs we would trust in our own homes — organized crews, honest timelines, and coatings that survive Florida heat and humidity. One project manager coordinates painters and renovation subs directly, so your questions go to one team that knows your scope.',
  teamHighlights: [
    'On-site for walkthroughs, mid-project check-ins, and punch lists',
    'Direct line for schedule changes and warranty questions',
    'Lake Nona–based — serving Orlando and the wider metro daily'
  ],
  teamBadgeAlt: 'Pixel Paint and Renovations logo badge',
  contactDefaultEyebrow: 'Get in touch',
  contactDefaultTitle: 'We are ready to help with your next project',
  contactDefaultBody:
    'Reach out by phone, email, or the form. Follow us on Instagram and Facebook for recent project photos.',
  contactTrustAria: 'Why homeowners reach out',
  contactBadgeInsured: 'Fully insured',
  contactBadgeWarranty: 'Written warranty',
  contactBadgeEstimates: 'Free estimates',
  contactBadgeLocal: 'Local crew',
  contactSeasonalLabel: 'Florida season',
  contactSeasonalBody:
    'Book exterior and humidity-sensitive work before peak summer heat — interior refreshes and cabinet painting stay year-round.',
  contactResponseNoteBefore: 'Most quotes answered within',
  contactResponseNoteHours: 'XXX hours',
  contactResponseNoteAfter: 'when you include photos and your target start window.',
  contactPhoneLabel: 'Phone',
  contactPhoneHint: 'Talk to our team directly',
  contactEmailLabel: 'Email',
  contactEmailHint: 'Attach photos anytime',
  contactAreaLabel: 'Service area',
  contactAreaValue: `${'Lake Nona'} & Central Florida`,
  contactAreaHint: 'On-site walkthroughs across the metro',
  contactSocialAria: 'Follow Pixel Paint',
  contactSocialInstagram: 'Instagram · @pixelpaint.renovations',
  contactSocialFacebook: 'Facebook · Recent project photos',
  contactMapTitle: 'Lake Nona, Florida map',
  contactWarrantyReview: 'Review placeholder terms',
  contactFormHookEyebrow: 'Start here',
  contactFormHookLead:
    'Photos beat guesswork — snap your room, cabinets, or exterior and attach below.',
  contactFormIntro:
    'Tell us what you are planning — room, timeline, and colors. We reply with next steps and a free on-site estimate.',
  contactFormPhotoHint:
    'A quick phone photo of the space helps us quote accurately on the first reply — kitchens, baths, and exteriors welcome.',
  contactNextAria: 'What happens after you submit',
  contactNextTitle: 'What happens next',
  contactNextSteps: [
    {
      title: 'We reply personally',
      body: 'Target within XXX hours — your questions answered or a free home visit scheduled, not an auto-reply.'
    },
    {
      title: 'Free home visit',
      body: 'We see the space, discuss your goals, and leave you with a written quote — price, materials, and schedule spelled out.'
    },
    {
      title: 'You approve with confidence',
      body: 'Everything is in writing before work starts — cost, prep plan, and warranty terms. No surprise bills or strangers on site.'
    }
  ],
  footerBlurb: `${COMPANY_LEGAL_NAME} — professional painting and home renovations serving Lake Nona, Orlando, and Central Florida.`,
  footerReviewTerms: 'Review terms',
  footerKitchen: 'Kitchen Renovations',
  footerBathroom: 'Bathroom Refresh',
  footerPrivacy: 'Privacy',
  footerServing: 'Serving Lake Nona and Central Florida.',
  langSwitcherAria: 'Language',
  schemaOfferCatalog: 'Painting and renovation services'
}

const form = {
  title: 'Request a Free Quote',
  intro: 'Share your project — we respond quickly with next steps and a free estimate.',
  honeypot: 'Leave blank',
  name: 'Your Name*',
  email: 'Your Email*',
  phone: 'Phone Number*',
  address: 'Address',
  service: "I'm Interested In*",
  servicePlaceholder: 'Please choose an option',
  photo: 'Upload a photo (optional)',
  message: 'How may we help you?*',
  messagePlaceholder: 'Room(s), timeline, colors, or anything we should know.',
  privacy: 'We use your information only to respond to your quote request.',
  submit: 'Submit Request',
  sending: 'Sending…',
  sent: 'Request Sent',
  confirmation: 'Thank you! Your request has been sent. We will contact you shortly.',
  photoTypeError: 'Please upload a JPEG, PNG, or WebP image.',
  photoSizeError: 'Photos must be 5 MB or smaller. Please choose a smaller image.',
  notConfigured: 'Online requests are not configured yet. Please call {phone} or email {email}.',
  networkError: 'Something went wrong. Please try again or call {phone} for immediate help.',
  submissionFailed: 'Submission failed'
}

const privacy = {
  lastUpdated: 'Last updated:',
  collectTitle: 'Information we collect',
  collectBody:
    'When you submit our quote form, we collect your name, email, phone number, optional address, service interest, optional project photo, and message. We use this information only to respond to your request and provide an estimate.',
  useTitle: 'How we use your information',
  useBody:
    'We contact you about your project, schedule walkthroughs, and follow up on quotes. We do not sell or rent your personal information to third parties.',
  formTitle: 'Form processing',
  formBody:
    'Form submissions are delivered securely to our team via a third-party form service. Optional photos you upload are used solely to understand your project scope.',
  contactTitle: 'Contact',
  contactBody: 'Questions about this policy? Email {email} or call {phone}.'
}

const warranty = {
  headline: WARRANTY_HEADLINE,
  summary: WARRANTY_SUMMARY,
  quoteNote: WARRANTY_QUOTE_NOTE,
  footerLine: WARRANTY_FOOTER_LINE,
  stripText: WARRANTY_STRIP_TEXT,
  terms: WARRANTY_TERMS_PLACEHOLDER
}

const catalog = {
  meta: {
    siteName: COMPANY_LEGAL_NAME,
    locale: 'en'
  },
  nav,
  serviceSubnav,
  serviceOptions,
  services,
  serviceGroups,
  testimonials,
  projectShowcase,
  whyChooseUs,
  serviceAreas,
  processSteps,
  pages,
  warranty,
  ui,
  form,
  privacy
}

const outPath = resolve(__dirname, '../src/i18n/catalogs/en.json')
await writeFile(outPath, JSON.stringify(catalog, null, 2) + '\n')
console.log(`Wrote ${outPath}`)
