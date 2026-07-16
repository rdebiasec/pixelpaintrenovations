# Template kit — clone this site for another brand

Use this checklist when forking **Pixel Paint** into a new production marketing site. Pixel remains the live reference instance; do not wipe its brand config unless you intend to.

**Time:** ~20–30 minutes for a first clone (excluding DNS/registrar waits).

## Prerequisites

- GitHub account; **public** repo if staying on GitHub Free + Pages
- Domain (optional) with DNS you control — prefer Cloudflare for HTTP security headers
- Node 22+ locally

## 1. Fork / clone → new repo

1. Create a new GitHub repository (public for Free Pages).
2. Push a copy of this codebase (or use GitHub “Use this template” if enabled later).
3. Do **not** enable Pages on a private backup mirror repo.

## 2. Brand config (identity)

Edit [`site/src/brand/config.js`](site/src/brand/config.js):

- `COMPANY_LEGAL_NAME`, phones, email, location
- `INSTAGRAM_URL` / `FACEBOOK_URL`
- `SITE_URL` (must match the live HTTPS origin)
- `OG_IMAGE` / `HERO_IMAGE` filenames (files live under `site/public/`)

[`site/src/legal/constants.js`](site/src/legal/constants.js) re-exports these values — prefer editing `brand/config.js` only.

## 3. Assets

Replace under [`site/public/`](site/public/):

- Logos / favicon (`logo.png`, `logo-icon.png`, `favicon.png`)
- `hero.jpg`, `og-image.jpg`, `projects/*`
- [`site/public/CNAME`](site/public/CNAME) and root [`CNAME`](CNAME) → your apex domain (or remove for `username.github.io/repo` mode)

## 4. Content + legal copy

Replace marketing copy in [`site/src/content/`](site/src/content/) (pages, services, projects, testimonials, warranty).

Update privacy content for the new brand (do not ship Pixel’s privacy text on another business).

## 5. Secrets & leads

| Secret | Needed? | Notes |
|--------|---------|--------|
| `BACKUP_GITHUB_TOKEN` | If you keep a private mirror | Fine-grained PAT; see [`site/DEPLOY.md`](site/DEPLOY.md) |
| `VITE_FORMSPREE_FORM_ID` / HubSpot | **Deferred** by default | Until configured, the quote form shows phone/email — never fake success |
| `VITE_PLAUSIBLE_DOMAIN` / `VITE_GA4_ID` | Optional | Allowlisted; never put private API keys in `VITE_*` |

## 6. Hosting + edge

1. Enable GitHub Pages from Actions (this repo’s workflow).
2. Point DNS A/CNAME to GitHub Pages; enable **Enforce HTTPS**.
3. If DNS is on Cloudflare, apply the **Transform Rules** header checklist in [`site/DEPLOY.md`](site/DEPLOY.md) (`nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`).
4. Keep prod **public** on GitHub Free if using Pages.

## 7. Change control (solo owner model)

This reference uses:

- PRs required into `main`
- Required status check: **`build`**
- `required_approving_review_count = 0`, `enforce_admins = false` (avoids lockout)

Document the same for forks unless you have a second reviewer.

## 8. Smoke checklist

After first deploy:

- [ ] Home / contact / services return **200**
- [ ] View Source: meta CSP includes `form-action`
- [ ] Contact map loads (iframe host matches CSP `frame-src`)
- [ ] Phone `tel:` and email `mailto:` work
- [ ] Quote submit shows **not configured** + phone/email (until form is wired)
- [ ] Actions: Deploy green; Mirror green if configured
- [ ] Optional a11y: keyboard to primary CTA, form labels present, no obvious contrast breakage

## 9. Supply chain hold

Dependabot may open **major** GitHub Actions upgrades (checkout v7, deploy-pages v5, etc.). **Hold** those until you re-pin commit SHAs in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) and smoke a Pages deploy. Safe to merge npm patch/minor bumps when the PR **`build`** check is green (e.g. vite / sharp).

## Restore / DR

See [`site/DEPLOY.md`](site/DEPLOY.md) — private mirror restore, rollback via `git revert`, human lead path (phone/email).

## Out of scope for a clone pass

- Multi-tenant single deploy for N brands
- Staging Pages environment
- Formspree/HubSpot wiring (explicit follow-up)
- Aggressive CSP tightening (`style-src` / `img-src`) without visual QA
