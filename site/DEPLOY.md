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
VITE_BASE_PATH=/pixelpaintrenovations/ npm run build
npm run preview
```

Then open **http://localhost:5180/pixelpaintrenovations/** (assets use the repo subpath).

## Deployment targets (dbx-solutions pattern)

The build pipeline understands two hosting contexts — same single workflow on `main`, auto-detected at build time:

- **Dev — GitHub Pages subpath:** `https://rdebiasec.github.io/pixelpaintrenovations/`  
  When no `CNAME` file exists, the workflow sets `VITE_BASE_PATH=/pixelpaintrenovations/` so assets resolve under the repository subpath.

- **Prod — custom domain:** `https://pixelpaint.renovations/` (future)  
  Add `site/public/CNAME` containing `pixelpaint.renovations`. The workflow sets `VITE_BASE_PATH=/`, copies CNAME into `dist/`, and GitHub Pages serves the apex domain. Update `SITE_URL` in `src/legal/constants.js` to match.

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
git remote add origin https://github.com/rdebiasec/pixelpaintrenovations.git
git push https://$GITHUB_PAT@github.com/rdebiasec/pixelpaintrenovations.git main
```

> **Authentication tips:** If your shell does not have credentials cached, export `GITHUB_PAT` or `GH_TOKEN` before running `deploy2github.sh`, or enter the PAT at the secure prompt. Generate tokens from GitHub **Settings → Developer settings → Personal access tokens**. Use fine-grained tokens scoped to this repo with **Contents: Read & Write** and **Pages: Read and write** (or classic `repo` scope).

After the first push, confirm the **Deploy to GitHub Pages** workflow succeeds in the Actions tab.

### Verify after deploy

**Dev (GitHub Pages subpath):**

- https://rdebiasec.github.io/pixelpaintrenovations/
- https://rdebiasec.github.io/pixelpaintrenovations/services/
- https://rdebiasec.github.io/pixelpaintrenovations/projects/
- https://rdebiasec.github.io/pixelpaintrenovations/projects/project-kitchen-transformations.jpg

**Prod (after custom domain):**

- https://pixelpaint.renovations/
- https://pixelpaint.renovations/services/

Hard-refresh if static JPGs look stale (browsers cache `/projects/*.jpg` URLs).

## Future custom domain (`pixelpaint.renovations`)

1. Add `site/public/CNAME` with `pixelpaint.renovations`.
2. Set `SITE_URL` in `src/legal/constants.js` to `https://pixelpaint.renovations`.
3. DNS (GitHub Pages):
   - Apex A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` CNAME → `rdebiasec.github.io`
4. Enable **Enforce HTTPS** in repo Pages settings.

Push to `main`; the workflow rebuilds with root base path `/`.
