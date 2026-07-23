# Supabase setup for Atlas Arcade

Supabase is optional. Without it, all six game modes work, progress stays in the
current browser, and every mode keeps its own local best competitive time.

With Supabase, Atlas Arcade can provide:

- Shared fastest-time boards for Locate, Capitals, Flags, Map → Name, Mixed
  Mission, and Spell All
- One best completed 197-country competitive time per player and mode
- Optional email/password accounts
- Private cross-device progress, favorites, achievements, and best times

## Install the schema

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Paste the complete `schema.sql` file into a new query.
4. Run it.

The script creates:

- `public.atlas_sprint_scores`
- `public.atlas_player_progress`
- `public.submit_atlas_sprint(...)`
- supporting indexes, grants, and row-level security policies

The `sprint` names are retained internally for database compatibility. Players
see the feature as **Competitive**.

## Add the public configuration

Copy the project URL and publishable key from the project's Connect/API Keys
area, then edit the root `config.js`:

```js
window.ATLAS_CONFIG = Object.freeze({
  supabaseUrl: 'https://YOUR_PROJECT_ID.supabase.co',
  supabasePublishableKey: 'sb_publishable_YOUR_KEY',
  leaderboardEnabled: true,
  accountsEnabled: true,
  siteUrl: 'https://YOUR_PUBLIC_SITE/'
});
```

The publishable key is intended for frontend use when row-level security and
least-privilege grants are configured. Never expose a secret key,
`service_role` key, database password, or SMTP password.

## Authentication URLs

For accounts, set the exact production address under **Authentication → URL
Configuration** as the Site URL and add it to Redirect URLs. Add
`http://localhost:8000/**` only when local testing is needed.

## Email

Accounts use email confirmation and password-reset messages. Configure a custom
SMTP provider before a public launch. Keep SMTP credentials in Supabase.

The shared leaderboard can be enabled with `accountsEnabled: false`; guest
players receive a persistent browser identity and never need email.

## Public leaderboard data

Visitors can read only these score columns:

- rules version
- game mode
- player name
- raw elapsed time
- mistakes
- generated final time
- completion date

The one-way player key and optional account ID are not granted through the
public query.

## Private progress

`atlas_player_progress` is available only to the signed-in user whose Auth ID
matches the row. Guests never receive access to that table and continue using
local storage.

## Anti-cheat boundary

The submission function rejects unsupported modes or versions, non-197
completions, out-of-range times and mistakes, invalid names and identities,
rapid repeated submissions, and direct public table writes. It keeps only a
player's faster time.

Because the game runs in the browser, a determined person can still inspect or
automate the client. Treat this as a friendly public leaderboard. High-stakes
competition requires trusted server-side session and answer verification.
