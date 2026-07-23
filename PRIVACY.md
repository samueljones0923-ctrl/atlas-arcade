# Atlas Arcade privacy notes

Atlas Arcade contains no analytics, advertising trackers, or third-party sign-in
buttons by default.

## Guest play

Without online services configured, progress, settings, favorites, achievements,
and local sprint records are stored only in the browser's local storage. A player
can export or erase that progress from the Progress panel.

## Worldwide leaderboards

When the publisher enables the Supabase leaderboard, a completed 197-country
sprint submits the public player name, mode, raw time, mistake count, official
time, and completion date. The database stores a one-way hash of the guest
browser identity or account ID to keep one best record per player and mode. The
private identity value is not granted through the public leaderboard query.

## Optional accounts

When accounts are enabled, Supabase Auth stores the player's email and account
credentials. Atlas Arcade stores the player's display name and private progress
record in a row protected by row-level security. Account creation is optional;
guests can use every game mode.

The person publishing the site is responsible for adapting this note to their
jurisdiction, hosting setup, domain, contact details, retention policy, and any
additional services they add.
