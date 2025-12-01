#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const srcDir = path.join(root, 'src');

const badExts = new Set(['.js', '.d.ts', '.js.map']);
let violations = [];

function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return }
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp)
    else if (e.isFile()) {
      const ext = path.extname(e.name);
      if (badExts.has(ext)) violations.push(path.relative(root, fp));
    }
  }
}

if (fs.existsSync(srcDir)) {
  walk(srcDir);
}

if (violations.length) {
  console.error('[no-compiled-in-src] Found compiled artifacts under src:');
  for (const v of violations) console.error(' -', v);
  console.error('\nDelete these files and rebuild to restore only dist/.');
  process.exit(1);
} else {
  process.exit(0);
}
