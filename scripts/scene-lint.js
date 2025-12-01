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
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const schemaPath = resolve(__dirname, '../docs/scene-schema.json')

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
  // If no file provided, lint all scene JSON files in standard locations.
  let files = []
  if (file) {
    files = [file]
  } else {
    const roots = ['scenes', 'templates/minimal/public/scenes']
    for (const root of roots) {
      try {
        const dirPath = resolve(process.cwd(), root)
        const entries = await import('node:fs').then(m => m.readdirSync(dirPath, { withFileTypes: true }))
        for (const ent of entries) {
          if (ent.isFile() && ent.name.endsWith('.json')) {
            files.push(root + '/' + ent.name)
          }
        }
      } catch { /* ignore missing */ }
    }
    if (files.length === 0) {
      console.error('No scene JSON files found. Provide --file <path-to-json>.')
      process.exit(1)
    }
  }

  const results = []
  let totalErrors = 0
  let totalScenes = 0

  let loader
  try {
    loader = await import('../dist/vn/sceneLoader.js')
  } catch (e) {
    console.error('Failed to load dist/vn/sceneLoader.js. Run "npm run build" first.')
    process.exit(1)
  }

  // Optional JSON Schema validation (if ajv is available)
  let schemaValidator = null
  try {
    const { default: Ajv } = await import('ajv')
    const ajv = new Ajv({ allErrors: true })
    const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
    schemaValidator = ajv.compile(schema)
  } catch {
    // ajv not installed; skip schema validation
  }

  const { loadScenesFromJsonStrict, validateSceneLinksStrict } = loader

  for (const f of files) {
    const filepath = resolve(process.cwd(), f)
    let text = ''
    try { text = readFileSync(filepath, 'utf8') } catch (e) {
      console.error(`Failed to read ${filepath}:`, e.message)
      totalErrors++
      results.push({ file: f, scenes: 0, errors: [{ code: 'fs', path: filepath, message: e.message || 'read failed' }] })
      continue
    }
    const { scenes, errors } = loadScenesFromJsonStrict(text)
    const linkIssues = validateSceneLinksStrict(scenes)
    const allErrors = [...errors, ...linkIssues]
    totalScenes += scenes.length
    // Schema validation (optional)
    if (schemaValidator) {
      let parsed = null
      try { parsed = JSON.parse(text) } catch {}
      if (parsed) {
        const valid = schemaValidator(parsed)
        if (!valid) {
          for (const err of schemaValidator.errors || []) {
            allErrors.push({ code:'schema', path: err.instancePath || '/', message: err.message || 'schema error' })
          }
        }
      }
    }
    totalErrors += allErrors.length
    results.push({ file: f, scenes: scenes.length, errors: allErrors })
  }

  // Summary output
  for (const r of results) {
    if (r.errors.length === 0) {
      console.log(`✓ ${r.file} valid (${r.scenes} scene${r.scenes === 1 ? '' : 's'})`)
    } else {
      console.error(`Found ${r.errors.length} issue(s) in ${r.file}:`)
      for (const err of r.errors) {
        console.error(`- [${err.code}] ${err.path} :: ${err.message}`)
      }
    }
  }
  if (totalErrors === 0) {
    console.log(`✓ All ${files.length} file(s) valid (${totalScenes} total scene${totalScenes === 1 ? '' : 's'})`)
    process.exit(0)
  } else {
    console.error(`✗ ${totalErrors} total issue(s) across ${files.length} file(s)`) 
    process.exit(1)
  }
}

main()
