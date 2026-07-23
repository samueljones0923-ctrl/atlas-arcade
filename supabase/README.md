# Supabase setup for Atlas Arcade

Supabase is optional. Without it, all six modes work, progress stays in the
current browser, and every mode keeps its own local best Competitive time.

With Supabase, Atlas Arcade can provide:

- Shared fastest-time boards for Locate, Capitals, Flags, Map → Name, Mixed
  Mission, and Spell All
- One best completed 197-country Competitive time per player and mode
- Optional email/password accounts
- Private cross-device progress, favorites, achievements, and mode history

## Install the schema

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Paste the complete `schema.sql` file into a new query.
4. Run it.

The script creates:

- `public.atlas_sprint_scores`
- `public.atlas_player_progress`
- `public.submit_atlas_sprint(...)`
- supporting indexes, grants, validation, and row-level security policies

The internal `sprint` names are retained for database compatibility. Players
see the feature as **Competitive**.

## Add the public configuration

Copy the Project URL and Publishable key, then edit the root `config.js`:

```js
window.ATLAS_CONFIG = Object.freeze({
  supabaseUrl: 'https://YOUR_PROJECT_ID.supabase.co',
  supabasePublishableKey: 'sb_publishable_YOUR_KEY',
  leaderboardEnabled: true,
  accountsEnabled: true,
  siteUrl: 'https://atlas-arcade.pages.dev/'
});
```

Replace the example address with the exact deployed site. Keep the trailing
slash.

A publishable key is intended for frontend use when row-level security and
least-privilege grants are configured. Never expose a secret key,
`service_role` key, database password, or SMTP password.

## Authentication URLs

Accounts require the exact production address under **Authentication → URL
Configuration**:

1. Set it as the Site URL.
2. Add it to Redirect URLs.
3. Add `http://localhost:8000/**` only when local testing is needed.

## Email

Accounts use confirmation and password-reset email. Configure a custom SMTP
provider before opening accounts to a large audience. Keep SMTP credentials in
Supabase.

Shared leaderboards can be enabled with `accountsEnabled: false`; guest players
receive a persistent browser identity and do not need email.

## Public score data

Visitors can read only the public ranking fields: rules version, game mode,
player name, elapsed time, mistakes, official time, and completion date. The
one-way player key and optional account ID are not exposed through the public
column grant.

## Private progress

`atlas_player_progress` is available only to the signed-in user whose Auth ID
matches the row. Guests continue using local storage.

## Anti-cheat boundary

The submission function rejects unsupported modes and versions, non-197
completions, out-of-range times and mistakes, invalid names and identities,
rapid duplicate submissions, and direct public table writes. It keeps only a
player's faster result.

Because the game runs in a browser, a determined person can still inspect or
automate the client. Treat it as a friendly public leaderboard. High-stakes
competition needs trusted server-side sessions and answer-event verification.
