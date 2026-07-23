# Launch Atlas Arcade free on Cloudflare Pages

Cloudflare Pages gives the game a normal public web address that anyone can
open in Chrome, Safari, Edge, or Firefox. No GitHub account is needed to play.
If the project name is available, the address will be:

```text
https://atlas-arcade.pages.dev/
```

The `atlas-arcade` name is first-come, first-served. If Cloudflare says it is
already taken, use a close alternative such as `play-atlas-arcade`; the rest of
this guide stays the same.

## Before connecting Cloudflare

Make sure the newest Atlas Arcade files are in the GitHub repository. At the
repository's top level, you should be able to see these files directly:

```text
index.html
app.js
styles.css
data.js
build_public.mjs
config.js
```

Do not put them inside another `atlas-arcade` folder in the repository.

## Connect the existing GitHub repository

1. Create a free Cloudflare account or sign in to the Cloudflare dashboard.
2. Open **Workers & Pages**.
3. Select **Create application**.
4. Select the **Pages** tab.
5. Select **Connect to Git** or **Import an existing Git repository**.
6. Choose **GitHub**.
7. When GitHub asks for permission, authorize Cloudflare Pages.
8. Choose **Only select repositories** when that option appears.
9. Select the repository named **atlas-arcade**.
10. Return to Cloudflare and select that repository.
11. Select **Begin setup**.

## Enter the build settings exactly

Use these values on the setup screen:

| Setting | Value |
|---|---|
| Project name | `atlas-arcade` |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `node build_public.mjs` |
| Build output directory | `_site` |
| Root directory | Leave blank |
| Environment variables | None |

Then select **Save and Deploy**.

The first build normally takes a minute or two. The build log should show a
line beginning with `Built` and end in a successful deployment. Select
**Continue to project**, then open the production link shown by Cloudflare.

## Confirm the public site

Test the new address in a private/incognito window and on a phone:

1. Open the home page.
2. Start Locate, Capitals, Flags, Map → Name, Mixed Mission, and Spell All.
3. Confirm there is no page scrolling during an active game.
4. Confirm the mission panel remains on the left on desktop.
5. Confirm the phone drawer opens and closes.
6. Confirm flags render as artwork.
7. Confirm Competitive is optional in every mode.
8. Reload once and confirm the game still opens.

## How future updates work

Cloudflare is connected to the repository's `main` branch. Every time a change
is committed to `main`, Cloudflare automatically runs the build and replaces
the live site. You do not need to upload the site separately to Cloudflare.

When updating through the GitHub website:

1. Open the repository's **Code** page.
2. Select **Add file → Upload files**.
3. Drag the updated project files into the upload area.
4. Wait for GitHub to finish reading the files.
5. Use a message such as `Update Atlas Arcade`.
6. Select **Commit changes**.
7. Open Cloudflare **Workers & Pages → atlas-arcade → Deployments**.
8. Wait for the newest deployment to show **Success**.

## GitHub Pages can stay online

The existing GitHub Pages address and the Cloudflare Pages address can both
remain active. They are separate public copies of the same game. Once the
Cloudflare address is tested, you may keep GitHub Pages as a backup or disable
its workflow to avoid maintaining two public addresses.

## Connect the shared leaderboards after deployment

The game works immediately without a database. In that state, progress and
best Competitive times are saved in each browser.

To enable shared times and optional accounts:

1. Create a Supabase project.
2. Open **SQL Editor** in Supabase.
3. Copy and run the complete `supabase/schema.sql` file.
4. Copy the Supabase **Project URL** and **Publishable key**.
5. Edit `config.js` as shown below.

```js
window.ATLAS_CONFIG = Object.freeze({
  supabaseUrl: 'https://YOUR_PROJECT_ID.supabase.co',
  supabasePublishableKey: 'sb_publishable_YOUR_KEY',
  leaderboardEnabled: true,
  accountsEnabled: true,
  siteUrl: 'https://atlas-arcade.pages.dev/'
});
```

Use your actual Cloudflare address when the project name differs. Never place a
secret key, `service_role` key, database password, or SMTP password in
`config.js`.

When accounts are enabled, open **Authentication → URL Configuration** in
Supabase. Set **Site URL** to the exact Cloudflare address and add the same
address to **Redirect URLs**. Commit the edited `config.js` to GitHub and wait
for Cloudflare to deploy it.

Set `accountsEnabled` to `false` if you want shared guest leaderboards without
email accounts. Set both online options to `false` to keep everything local.

## Troubleshooting

### The deployment says the build command failed

Confirm that `build_public.mjs` is visible at the root of the GitHub repository
and that the build command is exactly:

```text
node build_public.mjs
```

### The deployment succeeds but the site says 404

Confirm that the build output directory is exactly:

```text
_site
```

Then open the latest deployment log and confirm `_site/index.html` was created.

### The old design still appears

Wait for the newest deployment to finish, then use a private/incognito window.
Atlas Arcade has an offline cache, so a browser that already opened the old
version may need a hard refresh or a closed-and-reopened tab.

### Cloudflare will not give the exact hostname

The project name is already in use. Choose another project name before the
first deployment. A Pages subdomain is tied to its project name, so pick the
name carefully.
