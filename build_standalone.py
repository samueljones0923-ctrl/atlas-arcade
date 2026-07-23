#!/usr/bin/env python3
"""Build Atlas Arcade's offline single-file edition."""
from __future__ import annotations

import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
css = (ROOT / 'styles.css').read_text(encoding='utf-8')
config = (ROOT / 'config.js').read_text(encoding='utf-8')
data = (ROOT / 'data.js').read_text(encoding='utf-8')
app = (ROOT / 'app.js').read_text(encoding='utf-8')

flag_data = base64.b64encode((ROOT / 'assets' / 'flag-sprite.webp').read_bytes()).decode('ascii')
# Chromium limits the size of a single CSS token. Build a small blob URL from
# the embedded bytes instead of placing the multi-megabyte data URI in CSS.
css = css.replace('url("assets/flag-sprite.webp")', 'none')
css = css.replace("url('assets/flag-sprite.webp')", 'none')

icon_data = base64.b64encode((ROOT / 'assets' / 'icon.svg').read_bytes()).decode('ascii')
html = html.replace('href="assets/icon.svg"', f'href="data:image/svg+xml;base64,{icon_data}"')
html = html.replace('<link href="manifest.webmanifest" rel="manifest"/>\n', '')
html = html.replace('<link href="styles.css" rel="stylesheet"/>', f'<style>\n{css}\n</style>')

# A single-file copy has no external service worker. Online services remain
# disabled in the embedded default config; the full project is the publishable build.
app = app.replace('  registerServiceWorker();\n', '')

def safe_script(text: str) -> str:
    return text.replace('</script', '<\\/script')

sprite_bootstrap = f'''(() => {{
  const binary = atob('{flag_data}');
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  const spriteUrl = URL.createObjectURL(new Blob([bytes], {{ type: 'image/webp' }}));
  document.documentElement.style.setProperty('--flag-sprite-url', `url("${{spriteUrl}}")`);
  addEventListener('pagehide', () => URL.revokeObjectURL(spriteUrl), {{ once: true }});
}})();'''

inline_scripts = (
    f'<script>\n{safe_script(config)}\n</script>'
    f'<script>\n{safe_script(sprite_bootstrap)}\n</script>'
    f'<script>\n{safe_script(data)}\n</script>\n'
    f'<script>\n{safe_script(app)}\n</script>'
)
html = html.replace('<script src="config.js"></script><script src="data.js"></script>\n<script src="app.js"></script>', inline_scripts)
html = html.replace('assets/social-preview.png', '')

output = ROOT / 'standalone.html'
output.write_text(html, encoding='utf-8')
print(f'Built {output} ({output.stat().st_size:,} bytes)')
