# Pixel Paint Renovations — Deployment

## Local development

```bash
cd site
npm install   # once
npm run dev
```

Open **http://localhost:5180/** (port 5180, root base path `/`).

Preview the production bundle locally:

```bash
VITE_BASE_PATH=/pixel-renovations/ npm run build
npm run preview
```

Then open **http://localhost:5180/pixel-renovations/** (assets use the repo subpath).

## Production — GitHub Pages

**URL (current):** https://rdebiasec.github.io/pixel-renovations/

Deploys automatically when `main` changes under `site/**` via [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

### First-time setup

1. Create public repo `rdebiasec/pixel-renovations` on GitHub.
2. Push `main`:
   ```bash
   git remote add origin git@github.com:rdebiasec/pixel-renovations.git
   git push -u origin main
   ```
3. **Repo Settings → Pages → Build and deployment:**
   - Source: **GitHub Actions**
4. Confirm the **Deploy to GitHub Pages** workflow succeeds in the Actions tab.

### Build behavior

- **No custom domain:** `VITE_BASE_PATH=/pixel-renovations/` (repo subpath).
- **With custom domain:** add `site/public/CNAME` containing `pixelpaint.renovations`. The workflow sets `VITE_BASE_PATH=/` and copies CNAME into `dist/`. Update `SITE_URL` in `src/legal/constants.js` to match.

### Verify after deploy

- https://rdebiasec.github.io/pixel-renovations/
- https://rdebiasec.github.io/pixel-renovations/services/
- https://rdebiasec.github.io/pixel-renovations/projects/
- https://rdebiasec.github.io/pixel-renovations/projects/project-kitchen-transformations.jpg

Hard-refresh if static JPGs look stale (browsers cache `/projects/*.jpg` URLs).

## Future custom domain (`pixelpaint.renovations`)

1. Add `site/public/CNAME` with `pixelpaint.renovations`.
2. Set `SITE_URL` in `src/legal/constants.js` to `https://pixelpaint.renovations`.
3. DNS (GitHub Pages):
   - Apex A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` CNAME → `rdebiasec.github.io`
4. Enable **Enforce HTTPS** in repo Pages settings.

Push to `main`; the workflow rebuilds with root base path `/`.
