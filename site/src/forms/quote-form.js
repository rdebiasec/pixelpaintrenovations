import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from '../legal/constants.js'
import { serviceOptions } from '../content/index.js'
import { trackEvent } from '../analytics.js'
import { escapeHtml } from '../security/html.js'

const ALLOWED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const FORMSPREE_ID_PATTERN = /^[A-Za-z0-9]+$/

let formInstanceSeq = 0

function isValidFormspreeId(formId) {
  return typeof formId === 'string' && FORMSPREE_ID_PATTERN.test(formId)
}

function validatePhoto(file) {
  if (!file || !file.size) return null
  if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
    return 'Please upload a JPEG, PNG, or WebP image.'
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return 'Photos must be 5 MB or smaller. Please choose a smaller image.'
  }
  return null
}

export function renderQuoteFormInner(title, compact = false, options = {}) {
  formInstanceSeq += 1
  const prefix = `quote-${formInstanceSeq}`
  const half = compact ? ' class="field-half"' : ''
  const full = compact ? ' class="full-field field-full"' : ' class="full-field"'
  const intro =
    options.intro ||
    'Share your project — we respond quickly with next steps and a free estimate.'
  const photoHint = options.photoHint
    ? `<p class="form-photo-hint">${escapeHtml(options.photoHint)}</p>`
    : ''

  const idName = `${prefix}-name`
  const idEmail = `${prefix}-email`
  const idPhone = `${prefix}-phone`
  const idAddress = `${prefix}-address`
  const idService = `${prefix}-service`
  const idPhoto = `${prefix}-photo`
  const idMessage = `${prefix}-message`
  const idGotcha = `${prefix}-gotcha`

  const optionsHtml = serviceOptions
    .map((option) => {
      const safe = escapeHtml(option)
      return `<option value="${safe}">${safe}</option>`
    })
    .join('')

  return `
    <form class="lead-form quote-form ${compact ? 'quote-form-compact' : ''}" novalidate>
      <h2>${escapeHtml(title)}</h2>
      <p class="form-intro">${escapeHtml(intro)}</p>
      ${photoHint}
      <div class="hp-field" aria-hidden="true">
        <label for="${idGotcha}">Leave blank</label>
        <input id="${idGotcha}" type="text" name="_gotcha" tabindex="-1" autocomplete="off" />
      </div>
      <label for="${idName}"${half}>Your Name*
        <input id="${idName}" name="name" type="text" required autocomplete="name" />
      </label>
      <label for="${idEmail}"${half}>Your Email*
        <input id="${idEmail}" name="email" type="email" required autocomplete="email" />
      </label>
      <label for="${idPhone}"${half}>Phone Number*
        <input id="${idPhone}" name="phone" type="tel" required autocomplete="tel" />
      </label>
      <label for="${idAddress}"${half}>Address
        <input id="${idAddress}" name="address" type="text" autocomplete="street-address" />
      </label>
      <label for="${idService}"${compact ? ' class="field-full"' : ''}>I'm Interested In*
        <select id="${idService}" name="service" required>
          <option value="">Please choose an option</option>
          ${optionsHtml}
        </select>
      </label>
      <label${full} for="${idPhoto}">Upload a photo (optional)
        <input id="${idPhoto}" name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
      </label>
      <label${full} for="${idMessage}">How may we help you?*
        <textarea id="${idMessage}" name="message" rows="${compact ? 3 : 4}" required placeholder="Room(s), timeline, colors, or anything we should know."></textarea>
      </label>
      <p class="form-privacy field-full">We use your information only to respond to your quote request.</p>
      <button class="btn btn-primary field-full" type="submit">Submit Request</button>
      <div class="form-status field-full" aria-live="polite" aria-atomic="true">
        <p class="form-confirmation" hidden>Thank you! Your request has been sent. We will contact you shortly.</p>
        <p class="form-error" hidden role="alert"></p>
      </div>
    </form>
  `
}

export function bindForm(form) {
  const rawFormId = import.meta.env.VITE_FORMSPREE_FORM_ID
  const formId = isValidFormspreeId(rawFormId) ? rawFormId : ''
  const submitBtn = form?.querySelector('button[type="submit"]')
  const defaultLabel = submitBtn?.textContent?.trim() || 'Submit Request'

  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const confirmation = form.querySelector('.form-confirmation')
    const errorEl = form.querySelector('.form-error')

    const showError = (message) => {
      if (confirmation) confirmation.hidden = true
      if (errorEl) {
        errorEl.textContent = message
        errorEl.hidden = false
      }
    }

    const showSuccess = () => {
      if (errorEl) errorEl.hidden = true
      if (confirmation) confirmation.hidden = false
      form.reset()
      submitBtn?.setAttribute('disabled', 'true')
      submitBtn.textContent = 'Request Sent'
    }

    const photoInput = form.querySelector('input[name="photo"]')
    const photoFile = photoInput?.files?.[0]
    const photoError = validatePhoto(photoFile)
    if (photoError) {
      showError(photoError)
      trackEvent('quote_form_error', { reason: 'invalid_photo' })
      return
    }

    if (!formId) {
      showError(
        `Online requests are not configured yet. Please call ${CONTACT_PHONE_DISPLAY} or email ${CONTACT_EMAIL}.`
      )
      trackEvent('quote_form_error', { reason: 'not_configured' })
      return
    }

    if (errorEl) errorEl.hidden = true
    if (confirmation) confirmation.hidden = true
    submitBtn?.setAttribute('disabled', 'true')
    submitBtn.textContent = 'Sending…'

    const formData = new FormData(form)
    formData.append('_subject', 'New quote request — Pixel Paint website')
    const email = formData.get('email')
    if (email) formData.append('_replyto', email)

    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || 'Submission failed')
      }

      showSuccess()
      trackEvent('quote_form_submit', { page: document.title })
    } catch {
      showError(
        `Something went wrong. Please try again or call ${CONTACT_PHONE_DISPLAY} for immediate help.`
      )
      trackEvent('quote_form_error', { reason: 'network' })
      submitBtn?.removeAttribute('disabled')
      submitBtn.textContent = defaultLabel
    }
  })
}
