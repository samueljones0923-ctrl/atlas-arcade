# Publish Atlas Arcade

Atlas Arcade can be public on Cloudflare Pages and GitHub Pages at the same
time. Cloudflare Pages is the recommended primary address because it gives the
project a short free `pages.dev` hostname and automatically redeploys from the
existing GitHub repository.

## Recommended: Cloudflare Pages

Follow [`CLOUDFLARE-PAGES-GUIDE.md`](CLOUDFLARE-PAGES-GUIDE.md). The exact
build values are:

```text
Production branch: main
Framework preset: None
Build command: node build_public.mjs
Build output directory: _site
Root directory: blank
```

The project name controls the free hostname. When `atlas-arcade` is available,
the production address is:

```text
https://atlas-arcade.pages.dev/
```

Every later commit to `main` triggers a new Cloudflare deployment.

## Alternative: GitHub Pages

The project also includes `.github/workflows/deploy-pages.yml`.

1. Put the project files at the root of a GitHub repository.
2. Open **Settings → Pages**.
3. Set the source to **GitHub Actions**.
4. Open **Actions** and run or wait for **Deploy Atlas Arcade to GitHub Pages**.
5. Open the deployment address shown by GitHub.

The included workflow runs `node build_public.mjs` and deploys only `_site`.

## Shared fastest times and accounts

The public game does not require Supabase. Without it, all six modes work and
best Competitive times remain local to each browser.

To enable shared fastest-time boards:

1. Create a Supabase project.
2. Run the complete `supabase/schema.sql` in **SQL Editor**.
3. Copy the Project URL and Publishable key.
4. Add them to `config.js`.
5. Set `leaderboardEnabled` to `true`.
6. Set `siteUrl` to the exact public address, including the trailing slash.
7. Commit `config.js` to GitHub and wait for deployment.

Example for Cloudflare Pages:

```js
window.ATLAS_CONFIG = Object.freeze({
  supabaseUrl: 'https://YOUR_PROJECT_ID.supabase.co',
  supabasePublishableKey: 'sb_publishable_YOUR_KEY',
  leaderboardEnabled: true,
  accountsEnabled: false,
  siteUrl: 'https://atlas-arcade.pages.dev/'
});
```

Set `accountsEnabled` to `true` only when account creation and cross-device
progress are wanted. Then set the same production address under Supabase
**Authentication → URL Configuration** as the Site URL and an allowed Redirect
URL.

Never expose a Supabase secret key, `service_role` key, database password, SMTP
password, or GitHub token in frontend files.

## Update the live game

After editing source files:

```bash
node build_public.mjs
python build_standalone.py
git add .
git commit -m "Update Atlas Arcade"
git push
```

With Cloudflare Git integration, the push starts a new deployment
automatically. With GitHub Pages, the included workflow does the same.
