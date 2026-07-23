# Publish Atlas Arcade and connect the leaderboards

This guide takes the complete project from a downloaded folder to a public
website with six mode-specific fastest-time boards and optional accounts.

## 1. Test the project before uploading

Open a terminal in the project folder and run:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. Start a normal game, then enable **Competitive
timing** and start another. Confirm that the map and flag artwork load. Stop
the server with `Ctrl+C` when finished.

## 2. Create the GitHub repository

Create a new repository on GitHub. A public repository works with GitHub Pages
on GitHub Free. Keep the repository empty when creating it; this project
already includes its README, license, `.gitignore`, and deployment workflow.

The folder you upload must directly contain `index.html`, `app.js`,
`build_public.py`, and `.github`. Do not upload only `standalone.html` if you
want the installable app, offline cache, automatic updates, accounts, and
shared leaderboards.

## 3. Push the files

Run these commands from inside the project folder:

```bash
git init
git add .
git commit -m "Publish Atlas Arcade"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace the final address with the repository you created.

## 4. Enable GitHub Pages

In the repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Open the **Actions** tab.
4. Wait for **Deploy Atlas Arcade to GitHub Pages** to finish successfully.
5. Open the deployment URL shown by the workflow.

For a normal project repository, the address is usually:

```text
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
```

Every later push to `main` or `master` rebuilds and redeploys the site.

At this stage the full game is public. Best times remain local to each browser
until the next section is completed.

## 5. Create the Supabase database

1. Create a Supabase project.
2. Wait for it to finish initializing.
3. Open **SQL Editor**.
4. Create a new query.
5. Copy the complete contents of `supabase/schema.sql` into the editor.
6. Press **Run**.

After a successful run, the Table Editor contains:

- `atlas_sprint_scores`
- `atlas_player_progress`

The database also contains the `submit_atlas_sprint` function. Those names are
kept for compatibility, but the public interface calls the feature
**Competitive**.

## 6. Copy the browser-safe project values

In the Supabase project's **Connect** dialog or **Settings → API Keys**, copy:

- The **Project URL**, such as `https://abcxyz.supabase.co`
- The **Publishable key**, normally beginning with `sb_publishable_`

Do not use a secret key, legacy `service_role` key, or database password. Every
visitor can download frontend JavaScript, so private credentials cannot be
stored there.

## 7. Edit `config.js`

Use the exact public site URL, including the repository path and trailing slash:

```js
window.ATLAS_CONFIG = Object.freeze({
  supabaseUrl: 'https://YOUR_PROJECT_ID.supabase.co',
  supabasePublishableKey: 'sb_publishable_YOUR_KEY',
  leaderboardEnabled: true,
  accountsEnabled: true,
  siteUrl: 'https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/'
});
```

`leaderboardEnabled: true` enables shared leaderboard reads and submissions.

`accountsEnabled: true` adds account creation, sign-in, password reset, and
private cross-device progress. Set it to `false` to keep shared leaderboards
while allowing guest-only play.

## 8. Configure account redirects

This section is required only when `accountsEnabled` is `true`.

In Supabase, open **Authentication → URL Configuration**:

1. Set **Site URL** to the exact deployed Atlas Arcade URL.
2. Add the same URL to **Redirect URLs**.
3. For local account testing, optionally add `http://localhost:8000/**`.

The published URL and `siteUrl` in `config.js` should agree. A mismatch is the
most common reason confirmation and password-reset links return to the wrong
page.

## 9. Configure account email for a public launch

Leave the Email provider enabled under **Authentication → Providers**.

Before opening accounts to a large audience, configure a custom SMTP provider
inside Supabase. Keep SMTP credentials in Supabase; never place them in Atlas
Arcade files.

Accounts are optional. Shared guest leaderboards work with
`accountsEnabled: false` and require no email.

## 10. Publish the online configuration

Commit and push the edited file:

```bash
git add config.js
git commit -m "Connect Atlas Arcade leaderboards"
git push
```

Wait for the Pages workflow to turn green again.

## 11. Test the public launch

Use a private/incognito window and a second device.

1. Open all six game modes.
2. Confirm the full-screen home has no floating outer window.
3. Confirm desktop play does not scroll and the control panel stays beside the
   map.
4. Confirm the phone control drawer collapses and the clue remains visible.
5. Confirm Flags shows artwork rather than two-letter abbreviations.
6. Confirm no floating bordered answer card appears after a guess.
7. Enable Competitive in each mode and verify the game starts with all
   197 countries.
8. Complete one competitive game and confirm its result appears only under the
   matching mode tab.
9. Submit a slower second time and confirm the faster personal best remains.
10. When accounts are enabled, test account creation, confirmation, sign-in,
    cloud sync, password reset, and sign-out.
11. Install the site on a phone home screen and reopen it.
12. Reload after the service worker has cached the app shell.

## 12. Update the live game later

After editing source files:

```bash
python build_standalone.py
git add .
git commit -m "Update Atlas Arcade"
git push
```

GitHub Pages redeploys automatically.

## Custom domain

Add the domain under **GitHub → Settings → Pages** and follow GitHub's DNS
instructions. Then update all three places:

1. `siteUrl` in `config.js`
2. Supabase **Site URL**
3. Supabase **Redirect URLs**

Push `config.js` again and retest confirmation and password-reset links.

## What is and is not protected

The supplied database uses row-level security and a security-definer submission
function. It stores one best time per hidden identity and mode, calculates the
final time from raw milliseconds plus the fixed mistake penalty, rejects
obviously impossible or malformed values, and blocks direct public edits and
deletes.

It does not turn client-side JavaScript into a tamper-proof tournament system.
For cash prizes or formal records, add a trusted server or Edge Function that
issues sessions and validates answer events.
