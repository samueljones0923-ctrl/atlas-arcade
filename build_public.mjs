#!/usr/bin/env node
/** Build the exact static directory deployed to Cloudflare Pages or GitHub Pages. */
import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, '_site');
const runtimeFiles = [
  'index.html',
  'styles.css',
  'config.js',
  'data.js',
  'app.js',
  'manifest.webmanifest',
  'service-worker.js',
  '_headers',
  'robots.txt',
  '.nojekyll'
];
const runtimeDirectories = ['assets'];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const missing = [];
for (const relative of runtimeFiles) {
  const source = join(root, relative);
  try {
    await stat(source);
    await cp(source, join(output, relative));
  } catch {
    missing.push(relative);
  }
}

for (const relative of runtimeDirectories) {
  const source = join(root, relative);
  try {
    await stat(source);
    await cp(source, join(output, relative), { recursive: true });
  } catch {
    missing.push(relative);
  }
}

if (missing.length) {
  console.error(`Missing required runtime files: ${missing.join(', ')}`);
  process.exitCode = 1;
} else {
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) files.push(...await walk(fullPath));
      else if (entry.isFile()) files.push(fullPath);
    }
    return files;
  }

  const files = await walk(output);
  let bytes = 0;
  for (const file of files) bytes += (await stat(file)).size;
  console.log(`Built ${output} with ${files.length} files (${bytes.toLocaleString('en-US')} bytes)`);
}
