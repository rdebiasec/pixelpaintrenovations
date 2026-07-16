# Pixel Paint Renovations — Deployment

> **Agent note — "deploy" terminology:** When the user says **"deploy"**, they usually mean **local dev** (`cd site && npm run dev` → http://localhost:5180/), **not** a git push or GitHub Pages release. **Never push to GitHub or production** (`git push`, `deploy2github.sh`, etc.) without explicit user approval — e.g. "push to GitHub", "deploy to prod", or "push to production".

## Environment map

| Environment | URL | How it runs |
|-------------|-----|-------------|
| **Dev (local)** | http://localhost:5180/ | `cd site && npm run dev` |
| **Prod** | https://pixelpaint-renovations.com/ | Push to `main` (paths under `site/**` or this workflow) → GitHub Actions → GitHub Pages |

There is **no separate staging Pages** environment in this phase. Prod-like checks locally:

```bash
cd site
npm run build
npm run preview
```

Open **http://localhost:5180/** (with `site/public/CNAME` present, production builds use `VITE_BASE_PATH=/`).

`SITE_URL` in [`src/legal/constants.js`](src/legal/constants.js) is `https://pixelpaint-renovations.com` and must stay aligned with the live custom domain.

## Local development

```bash
cd site
npm install   # once
npm run dev
```

Open **http://localhost:5180/** (port 5180, root base path `/`).

### Quote form (Formspree — interim)

Lead capture uses [Formspree](https://formspree.io) until HubSpot Forms is wired (planned last). No backend in this repo; optional photo uploads.

**Security notes (client-side site):**

- `VITE_FORMSPREE_FORM_ID` is embedded in the production JS bundle. Treat it as a **public endpoint ID**, not a secret. Real protection is Formspree dashboard settings (spam filters, reCAPTCHA if enabled) plus the site honeypot (`_gotcha`), MIME/size checks, and CSP `form-action` / `connect-src`.
- Optional photo uploads: JPEG/PNG/WebP only, **max 5 MB** (validated in the browser before POST).
- GitHub Pages serves CSP via `<meta http-equiv>` (see `scripts/generate-seo.mjs`). Directives like `frame-ancestors` / `X-Frame-Options` require **HTTP response headers** and are not enforceable via meta tags — add them later if you put a CDN (e.g. Cloudflare) in front of Pages.

1. Create a free Formspree account and a new form.
2. Set the notification email to the business address in `src/legal/constants.js` (`CONTACT_EMAIL`).
3. Copy the form ID from the endpoint URL (`https://formspree.io/f/`**`abc123xyz`**).
4. Create `site/.env` from the example:

```bash
cp .env.example .env
# Edit .env and set VITE_FORMSPREE_FORM_ID=your_form_id
```

5. Restart the dev server and submit a test quote from the home hero or contact page.

Without a Form ID, the form shows a clear error with phone and email — it never fakes success. Call/email in the UI remain the business backup path.

### Secrets checklist (`VITE_*`)

| Name | Where | Notes |
|------|--------|--------|
| `VITE_FORMSPREE_FORM_ID` | `site/.env` (local), Actions secret (prod) | Public in client bundle |
| `VITE_PLAUSIBLE_DOMAIN` | optional | Hostname-like; invalid values ignored |
| `VITE_GA4_ID` | optional | Must match `G-…`; invalid values ignored |

**Never** put private API keys, HubSpot private app tokens, or PATs in `VITE_*` — anything prefixed `VITE_` is exposed to the browser.

For **production builds**, add secrets under **Settings → Secrets and variables → Actions**. The deploy workflow passes them into `npm run build`.

## Production (GitHub Pages)

**Live domain:** https://pixelpaint-renovations.com/  
**Repo:** https://github.com/rdebiasec/pixelpaintrenovations (**public** — required on GitHub Free for GitHub Pages)  
**Backup repo:** https://github.com/rdebiasec/pixelpaintrenovations-backup (**private** mirror)  
**CNAME:** [`site/public/CNAME`](public/CNAME) and root [`CNAME`](../CNAME) → `pixelpaint-renovations.com`  
**HTTPS:** enforced on GitHub Pages (certificate managed by GitHub)

> **Pages + visibility:** On GitHub Free, a **private** production repo cannot serve GitHub Pages. Keep prod **public** for the live site; keep the **backup private** for code DR. GitHub Pro would allow private Pages if you upgrade later.

Because a CNAME is present, the workflow sets `VITE_BASE_PATH=/`. The legacy github.io subpath mode (`/pixelpaintrenovations/`) only applies if those CNAME files are removed.

Deploys automatically when `main` changes under `site/**` (or `.github/workflows/deploy.yml`) via [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml). **Only `main` deploys to Pages** — feature branches do not publish.

### Verify after deploy (prod)

- https://pixelpaint-renovations.com/
- https://pixelpaint-renovations.com/services/
- https://pixelpaint-renovations.com/contact/
- https://pixelpaint-renovations.com/projects/
- View Source on home: meta `Content-Security-Policy` includes `form-action`

Hard-refresh if static JPGs look stale (browsers cache `/projects/*.jpg` URLs).

### First-time / bootstrap (rare)

From the repo root, [`deploy2github.sh`](../deploy2github.sh) can create the GitHub repo, push `main`, and enable Pages. Prefer normal `git push` once the remote exists.

```bash
export GITHUB_PAT="your_github_pat"   # or GH_TOKEN — never commit this
./deploy2github.sh
```

Use fine-grained tokens scoped to this repo (**Contents** + **Pages**), or classic `repo`. PAT stays in the environment / prompt only — never in git.

## Deployment security

- **Workflow permissions:** `contents: read`, `pages: write`, `id-token: write` (OIDC for Pages). Do not broaden.
- **CI gate:** `npm audit --audit-level=high` and `scripts/check-dist.mjs` (requires CSP + `form-action` in `dist`).
- **Public prod repo:** required for GitHub Pages on Free; do not privatize prod unless you have Pro (or another host). Backup stays private.
- **Ship via PR:** prefer pull requests into `main` instead of pushing site changes straight to `main`.
- **Recommended GitHub settings** (manual, in the GitHub UI — not automated by this repo):
  1. **Branches → `main` → Branch protection:** require a pull request before merging; require status checks when the deploy workflow is available as a check. (Available while the repo is public.)
  2. **Environments → `github-pages`:** optional **Required reviewers** so a human must approve before Pages publish.
- **Keep `site/.env` gitignored.** Rotate any leaked PAT immediately.
- **HTTP security headers beyond meta CSP** (e.g. `frame-ancestors`): need a CDN or custom host; out of scope until Cloudflare (or similar) is added.

## Disaster recovery

### Critical assets

| Asset | Location |
|-------|----------|
| Source of truth | GitHub `main` + local clones |
| Hosting | GitHub Pages + custom domain + GitHub-managed TLS |
| DNS / registrar | `pixelpaint-renovations.com` — **DNS registrar: _(fill in provider name)_** (outside this repo) |
| Lead path | Formspree (interim) → HubSpot Forms (planned) |
| Human backup | Phone/email in `src/legal/constants.js` (always on the site) |

**Targets:** RPO = last good commit on `main` (no form DB in our hosting). RTO site ≈ under 30 minutes with revert + green Actions. RTO leads = immediate via phone/email if forms are down.

### Scenario playbook

| Scenario | Dev (local) | Prod |
|----------|-------------|------|
| Bad deploy / blank site | Fix on a branch; do not push to `main` until green | `git revert <bad_sha>` on `main` → push → wait for Actions |
| Actions outage | Keep working locally | Last good Pages build keeps serving |
| DNS / cert failure | N/A | Check Pages custom domain + DNS at registrar; announce phone/email on social if needed |
| Form / secret missing | Graceful “not configured” + phone/email | Same on prod |
| PAT / account compromise | Rotate token | Rotate PAT; review Actions; sign out other sessions |
| Repo deleted | Restore from local clone / GitHub recovery | Same; keep a second remote/mirror if desired |
| npm high/critical vuln | `npm audit` locally | CI fails the build |

### Prod rollback runbook (~15 min)

1. Find last good commit: `git log origin/main --oneline`
2. Prefer `git revert <bad_sha>` (safe history). Hard reset only if you explicitly request it.
3. Push to `main` → confirm **Deploy to GitHub Pages** succeeds.
4. Verify home, `/contact/`, CSP in View Source, form behavior.
5. If DNS is down: do not change registrar records without the domain owner; use phone `(407) 883-7891` / business email for leads.

### Dev runbook

1. `cd site && npm ci && npm run dev`
2. Without Formspree ID, form must fail gracefully (phone/email shown).
3. Prod-like: `npm run build && npm run preview`
4. Do not run `deploy2github.sh` unless explicitly asked to publish.

### Backups

- Git history on GitHub is the primary backup; keep local clones current.
- No application database to dump.
- Images and public assets live under `site/public/` and are versioned in git.

### GitHub mirror backup (private)

| Item | Value |
|------|--------|
| Production repo | `rdebiasec/pixelpaintrenovations` (**public** — Pages on Free) |
| Backup repo | `rdebiasec/pixelpaintrenovations-backup` (**private**) |
| Sync | Workflow [`.github/workflows/mirror-backup.yml`](../.github/workflows/mirror-backup.yml) on every push to `main` (+ manual **workflow_dispatch**) |
| Secret | `BACKUP_GITHUB_TOKEN` — PAT/token that can read prod and write the backup |

**Do not enable GitHub Pages on the backup repo** — it is a code mirror, not a second website.

**Restore (owner only):**

1. From a clean machine: clone the backup, or push its `main` back to prod.
2. Example (overwrite prod `main` from backup — only when recovering):

```bash
git clone --mirror https://github.com/rdebiasec/pixelpaintrenovations-backup.git restore.git
cd restore.git
git remote set-url --push origin https://github.com/rdebiasec/pixelpaintrenovations.git
git push origin --force --prune '+refs/heads/*:refs/heads/*' '+refs/tags/*:refs/tags/*'
```

3. Confirm Actions deploy on prod if `main` changed; smoke https://pixelpaint-renovations.com/

## Static assets checklist

These files live in `public/` and are required for a correct build:

| File | Purpose |
|------|---------|
| `logo.png`, `logo-icon.png`, `favicon.png` | Header, footer, favicon — run `node scripts/process-logo.mjs` from `logo-source.png` |
| `og-image.jpg` | Social previews (generated by `process-logo.mjs`) |
| `hero.jpg` | Homepage hero banner — single seamless Lake Nona landmark panorama (VA Medical Center, Town Center/Disco/Wave, Boxi Park). Regenerate from one master source via `node scripts/process-hero.mjs` |
| `projects/*.jpg` | Project gallery (images referenced in content / `site-app.js`) |

## SEO build step

`npm run build` runs `scripts/generate-seo.mjs`, which:

- Patches HTML shells with canonical URLs, Open Graph, Twitter, and static JSON-LD
- Writes `public/sitemap.xml` and updates `public/robots.txt`

Keep `SITE_URL` aligned with the live domain so canonicals and the sitemap stay correct.

## Analytics (optional)

Set one of these in `.env` locally or as GitHub Actions secrets for production builds:

- `VITE_PLAUSIBLE_DOMAIN` — privacy-friendly Plausible analytics
- `VITE_GA4_ID` — Google Analytics 4 measurement ID

Events tracked: `quote_form_submit`, `quote_form_error`, `phone_header`, `phone_footer`, `phone_hero`, `sticky_cta_click`, and social link clicks.

## HubSpot (planned — last)

Replace Formspree with HubSpot Forms API while keeping the Pixel Paint quote UI. Requires portal ID + form GUID, CSP `connect-src` for `https://api.hsforms.com`, and Actions secrets. **Do not implement until explicitly requested.**

## Alternate / future hostname

If moving off `pixelpaint-renovations.com` to another apex (e.g. a shorter brand domain):

1. Update `site/public/CNAME` and root `CNAME`.
2. Set `SITE_URL` in `src/legal/constants.js`.
3. Point DNS (GitHub Pages apex A records / `www` CNAME → `rdebiasec.github.io`).
4. Enable **Enforce HTTPS** in repo Pages settings.
5. Push to `main` and verify the new host.
