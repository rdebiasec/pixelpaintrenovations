# Pixel Paint Renovations (site + template kit)

Marketing site for **Pixel Paint and Renovations Inc** — Vite multi-page app under [`site/`](site/), published to GitHub Pages at [pixelpaint-renovations.com](https://pixelpaint-renovations.com/).

This repo is also the **reference instance** for cloning additional brand sites. See [`TEMPLATE.md`](TEMPLATE.md).

## Local development (“deploy” = local)

When we say **deploy** in day-to-day chat, we usually mean **local dev**, not production:

```bash
cd site
npm install
npm run dev
```

Open **http://localhost:5180/**.

Prod-like check:

```bash
cd site
npm run build
npm run preview
```

**Never** `git push` / publish to production without an explicit request.

## Production

- **Live:** https://pixelpaint-renovations.com/
- **Deploy path:** push/merge to `main` (paths under `site/**`) → GitHub Actions → GitHub Pages
- Full runbooks: [`site/DEPLOY.md`](site/DEPLOY.md)

### Owner handoff (not automated)

1. Rotate **`BACKUP_GITHUB_TOKEN`** to a durable fine-grained PAT — steps in [`site/DEPLOY.md`](site/DEPLOY.md).
2. Apply **Cloudflare** response-header Transform Rules — checklist in the same doc.
3. Lead form (Formspree/HubSpot) is **deferred**; phone/email remain the lead path.

## Brand identity

Edit [`site/src/brand/config.js`](site/src/brand/config.js) for company, contact, socials, and `SITE_URL`. Helpers re-export from [`site/src/legal/constants.js`](site/src/legal/constants.js).

## Security baseline (already in this instance)

- XSS escaping, CSP meta (+ CI assert), form honeypot/MIME limits (form endpoint deferred)
- Branch protection requires PR + status check **`build`**
- Private git mirror backup workflow
- Dependabot for npm + GitHub Actions (hold major Actions bumps until SHA re-pin + smoke)

## Ignore / do not commit

Palette scratch files (`DBX_*`, `PALETA_*`) and duplicate docs (`site/DEPLOY 2.md`) are gitignored — keep them local only.
