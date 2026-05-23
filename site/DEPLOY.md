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

### First-time setup (same auth as dbx-solutions)

From the repo root, use [`deploy2github.sh`](../deploy2github.sh) — it creates the GitHub repo (if needed), sets `origin` without storing credentials, pushes `main` with a PAT in the push URL only, and enables Pages (GitHub Actions source).

```bash
export GITHUB_PAT="your_github_pat"   # or GH_TOKEN — same as dbx
chmod +x deploy2github.sh
./deploy2github.sh
```

Alternatively, push manually after setting a clean remote:

```bash
git remote add origin https://github.com/rdebiasec/pixel-renovations.git
git push https://$GITHUB_PAT@github.com/rdebiasec/pixel-renovations.git main
```

> **Authentication tips:** If your shell does not have credentials cached, export `GITHUB_PAT` or `GH_TOKEN` before running `deploy2github.sh`, or enter the PAT at the secure prompt. Generate tokens from GitHub **Settings → Developer settings → Personal access tokens**. Use fine-grained tokens scoped to this repo with **Contents: Read & Write** and **Pages: Read and write** (or classic `repo` scope).

After the first push, confirm the **Deploy to GitHub Pages** workflow succeeds in the Actions tab.

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
