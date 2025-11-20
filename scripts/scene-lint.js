#!/usr/bin/env node
/**
 * Scene lint: strict validation + link checks for AuroraEngine scene files.
 *
 * Usage:
 *   node scripts/scene-lint.js --file scenes/example.json
 *
 * Notes:
 * - Requires a build so that dist/vn/sceneLoader.js exists.
 * - Exits 1 on errors, 0 on success.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function parseArgs() {
  const args = process.argv.slice(2)
  const opts = { file: '' }
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--file' || a === '-f') {
      opts.file = args[i + 1] || ''
      i++
    }
  }
  if (!opts.file && args[0]) opts.file = args[0]
  return opts
}

async function main() {
  const { file } = parseArgs()
  if (!file) {
    console.error('Usage: node scripts/scene-lint.js --file <path-to-json>')
    process.exit(1)
  }
  const filepath = resolve(process.cwd(), file)
  let text = ''
  try {
    text = readFileSync(filepath, 'utf8')
  } catch (e) {
    console.error(`Failed to read ${filepath}:`, e.message)
    process.exit(1)
  }

  let loader
  try {
    loader = await import('../dist/vn/sceneLoader.js')
  } catch (e) {
    console.error('Failed to load dist/vn/sceneLoader.js. Run "npm run build" first.')
    process.exit(1)
  }

  const { loadScenesFromJsonStrict, validateSceneLinksStrict } = loader
  const { scenes, errors } = loadScenesFromJsonStrict(text)
  const linkIssues = validateSceneLinksStrict(scenes)
  const allErrors = [...errors, ...linkIssues]

  if (allErrors.length === 0) {
    console.log(`✓ ${file} is valid (${scenes.length} scene${scenes.length === 1 ? '' : 's'})`)
    process.exit(0)
  }

  console.error(`Found ${allErrors.length} issue(s) in ${file}:\n`)
  for (const err of allErrors) {
    console.error(`- [${err.code}] ${err.path} :: ${err.message}`)
  }
  process.exit(1)
}

main()
