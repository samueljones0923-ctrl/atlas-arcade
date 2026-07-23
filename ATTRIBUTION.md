# Attribution and data notes

## Natural Earth

The generalized world geometry is derived from Natural Earth vector data.
Natural Earth makes its raster and vector map data available in the public
domain.

- Project: https://www.naturalearthdata.com/
- Terms: https://www.naturalearthdata.com/about/terms-of-use/

The runtime geometry is simplified, projected into a Robinson-style SVG map,
and augmented with locator markers and enlarged invisible hit areas for small
island countries and microstates.

## Flag artwork

The bundled flag atlas is rendered from Google’s Noto Color Emoji country-flag
artwork. Packaging the artwork into one local WebP sprite prevents Windows and
other platforms from falling back to two-letter regional-indicator text.

- Project: https://github.com/googlefonts/noto-emoji
- License information: https://github.com/googlefonts/noto-emoji#license

The Noto Emoji project notes that its flag source images are public-domain or
otherwise exempt from copyright, while its font and tooling use the SIL Open
Font License 1.1 and Apache License 2.0 respectively. Atlas Arcade distributes
only the rendered flag atlas, not the font file.

## Country set and boundaries

The game set contains 197 entries: 193 United Nations member states plus
Palestine, Vatican City, Kosovo, and Taiwan. This is a practical quiz set, not
a statement about diplomatic recognition. Natural Earth uses generalized and,
in some places, disputed or de facto boundaries. Publishers should review the
set and map treatment for their intended audience.

Country names, ISO codes, capitals, regions, approximate areas, coordinates,
and border lists are factual metadata assembled into `data.js`. Some states
have more than one constitutional, administrative, legislative, judicial, or
royal center; the study card includes a note for reviewed edge cases.

## Supabase JavaScript client

When online features are enabled, Atlas Arcade loads the official
`@supabase/supabase-js` browser client, pinned to version 2.106.2. That project
is distributed under the MIT License.

- Project: https://github.com/supabase/supabase-js
- Release: https://github.com/supabase/supabase-js/releases/tag/v2.106.2
