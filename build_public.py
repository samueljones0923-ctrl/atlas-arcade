#!/usr/bin/env python3
"""Create the small, static Atlas Arcade directory deployed to the web."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "_site"
RUNTIME_FILES = (
    "index.html",
    "styles.css",
    "config.js",
    "data.js",
    "app.js",
    "manifest.webmanifest",
    "service-worker.js",
    "_headers",
    "robots.txt",
    ".nojekyll",
)
RUNTIME_DIRECTORIES = ("assets",)

if OUTPUT.exists():
    shutil.rmtree(OUTPUT)
OUTPUT.mkdir(parents=True)

missing: list[str] = []
for relative in RUNTIME_FILES:
    source = ROOT / relative
    if not source.exists():
        missing.append(relative)
        continue
    shutil.copy2(source, OUTPUT / relative)

for relative in RUNTIME_DIRECTORIES:
    source = ROOT / relative
    if not source.exists():
        missing.append(relative)
        continue
    shutil.copytree(source, OUTPUT / relative)

if missing:
    raise SystemExit(f"Missing required runtime files: {', '.join(missing)}")

files = [path for path in OUTPUT.rglob("*") if path.is_file()]
size = sum(path.stat().st_size for path in files)
print(f"Built {OUTPUT} with {len(files)} files ({size:,} bytes)")
