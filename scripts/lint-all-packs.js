#!/usr/bin/env node
/**
 * Lint all template packs: strict validation + link checks for each JSON file
 * under templates/minimal/public/scenes.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

async function validateFile(filepath, loader, schemaValidator) {
  const text = readFileSync(filepath, 'utf8')
  const { loadScenesFromJsonStrict, validateSceneLinksStrict } = loader
  const { scenes, errors } = loadScenesFromJsonStrict(text)
  const linkIssues = validateSceneLinksStrict(scenes)
  const allErrors = [...errors, ...linkIssues]

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

  return { scenesCount: (JSON.parse(text) || []).length || 0, errors: allErrors }
}

async function main() {
  const root = process.cwd()
  const scenesDir = resolve(root, 'templates/minimal/public/scenes')

  let loader
  try {
    loader = await import(resolve(root, 'dist/vn/sceneLoader.js'))
  } catch (e) {
    console.error('Failed to load dist/vn/sceneLoader.js. Run "npm run build" first.')
    process.exit(1)
  }

  // Optional JSON Schema validation (if ajv is available)
  let schemaValidator = null
  try {
    const { default: Ajv } = await import('ajv')
    const schema = JSON.parse(readFileSync(resolve(root, 'docs/scene-schema.json'), 'utf8'))
    const ajv = new Ajv({ allErrors: true })
    schemaValidator = ajv.compile(schema)
  } catch {
    // ajv not installed; skip schema validation
  }

  const files = readdirSync(scenesDir).filter(f => f.endsWith('.json'))
  if (files.length === 0) {
    console.error('No scene JSON files found in templates/minimal/public/scenes')
    process.exit(1)
  }

  let totalErrors = 0
  for (const f of files) {
    const fp = join(scenesDir, f)
    const { scenesCount, errors } = await validateFile(fp, loader, schemaValidator)
    if (errors.length === 0) {
      console.log(`✓ ${f} is valid (${scenesCount} scene${scenesCount === 1 ? '' : 's'})`)
    } else {
      console.error(`Found ${errors.length} issue(s) in ${f}:`)
      for (const err of errors) {
        console.error(`- [${err.code}] ${err.path} :: ${err.message}`)
      }
      totalErrors += errors.length
    }
  }

  if (totalErrors > 0) process.exit(1)
}

main()
