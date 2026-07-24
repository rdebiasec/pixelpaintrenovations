import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from '../legal/constants.js'
import { getServiceOptions } from '../content/index.js'
import { getCatalog } from '../i18n/catalog.js'
import { getActiveLocale } from '../i18n/state.js'
import { trackEvent } from '../analytics.js'
import { escapeHtml } from '../security/html.js'

const ALLOWED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const FORMSPREE_ID_PATTERN = /^[A-Za-z0-9]+$/

let formInstanceSeq = 0

function formCopy() {
  return getCatalog(getActiveLocale()).form
}

function fillPlaceholders(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] != null ? String(vars[key]) : ''))
}

function isValidFormspreeId(formId) {
  return typeof formId === 'string' && FORMSPREE_ID_PATTERN.test(formId)
}

function validatePhoto(file) {
  const copy = formCopy()
  if (!file || !file.size) return null
  if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
    return copy.photoTypeError
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return copy.photoSizeError
  }
  return null
}

export function renderQuoteFormInner(title, compact = false, options = {}) {
  const copy = formCopy()
  formInstanceSeq += 1
  const prefix = `quote-${formInstanceSeq}`
  const half = compact ? ' class="field-half"' : ''
  const full = compact ? ' class="full-field field-full"' : ' class="full-field"'
  const intro = options.intro || copy.intro
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

  const optionsHtml = getServiceOptions()
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
        <label for="${idGotcha}">${escapeHtml(copy.honeypot)}</label>
        <input id="${idGotcha}" type="text" name="_gotcha" tabindex="-1" autocomplete="off" />
      </div>
      <label for="${idName}"${half}>${escapeHtml(copy.name)}
        <input id="${idName}" name="name" type="text" required autocomplete="name" />
      </label>
      <label for="${idEmail}"${half}>${escapeHtml(copy.email)}
        <input id="${idEmail}" name="email" type="email" required autocomplete="email" />
      </label>
      <label for="${idPhone}"${half}>${escapeHtml(copy.phone)}
        <input id="${idPhone}" name="phone" type="tel" required autocomplete="tel" />
      </label>
      <label for="${idAddress}"${half}>${escapeHtml(copy.address)}
        <input id="${idAddress}" name="address" type="text" autocomplete="street-address" />
      </label>
      <label for="${idService}"${compact ? ' class="field-full"' : ''}>${escapeHtml(copy.service)}
        <select id="${idService}" name="service" required>
          <option value="">${escapeHtml(copy.servicePlaceholder)}</option>
          ${optionsHtml}
        </select>
      </label>
      <label${full} for="${idPhoto}">${escapeHtml(copy.photo)}
        <input id="${idPhoto}" name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
      </label>
      <label${full} for="${idMessage}">${escapeHtml(copy.message)}
        <textarea id="${idMessage}" name="message" rows="${compact ? 3 : 4}" required placeholder="${escapeHtml(copy.messagePlaceholder)}"></textarea>
      </label>
      <p class="form-privacy field-full">${escapeHtml(copy.privacy)}</p>
      <button class="btn btn-primary field-full" type="submit">${escapeHtml(copy.submit)}</button>
      <div class="form-status field-full" aria-live="polite" aria-atomic="true">
        <p class="form-confirmation" hidden>${escapeHtml(copy.confirmation)}</p>
        <p class="form-error" hidden role="alert"></p>
      </div>
    </form>
  `
}

export function bindForm(form) {
  const rawFormId = import.meta.env.VITE_FORMSPREE_FORM_ID
  const formId = isValidFormspreeId(rawFormId) ? rawFormId : ''
  const copy = formCopy()
  const submitBtn = form?.querySelector('button[type="submit"]')
  const defaultLabel = submitBtn?.textContent?.trim() || copy.submit

  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const liveCopy = formCopy()
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
      submitBtn.textContent = liveCopy.sent
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
        fillPlaceholders(liveCopy.notConfigured, {
          phone: CONTACT_PHONE_DISPLAY,
          email: CONTACT_EMAIL
        })
      )
      trackEvent('quote_form_error', { reason: 'not_configured' })
      return
    }

    if (errorEl) errorEl.hidden = true
    if (confirmation) confirmation.hidden = true
    submitBtn?.setAttribute('disabled', 'true')
    submitBtn.textContent = liveCopy.sending

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
        throw new Error(data.error || liveCopy.submissionFailed)
      }

      showSuccess()
      trackEvent('quote_form_submit', { page: document.title })
    } catch {
      showError(
        fillPlaceholders(liveCopy.networkError, {
          phone: CONTACT_PHONE_DISPLAY,
          email: CONTACT_EMAIL
        })
      )
      trackEvent('quote_form_error', { reason: 'network' })
      submitBtn?.removeAttribute('disabled')
      submitBtn.textContent = defaultLabel
    }
  })
}
