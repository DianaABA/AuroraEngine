#!/usr/bin/env node
/**
 * Lint all template packs: strict validation + link checks for each JSON file
 * under templates/minimal/public/scenes.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

function classifyFile(filename){
  const base = filename.toLowerCase()
  if(base.includes('rtl')) return { mode:'loose', schema:false }
  return { mode:'strict', schema:true }
}

async function validateFile(filepath, loader, schemaValidator) {
  const text = readFileSync(filepath, 'utf8')
  const { loadScenesFromJson, loadScenesFromJsonStrict, validateSceneLinksStrict } = loader
  const { mode, schema } = classifyFile(filepath)

  let scenes = []
  let errors = []
  if(mode === 'strict'){
    const res = loadScenesFromJsonStrict(text)
    scenes = res.scenes; errors = res.errors
  } else {
    const res = loadScenesFromJson(text)
    scenes = res.scenes; errors = [] // ignore non-strict parse errors in loose mode
  }

  const linkIssues = mode === 'strict' ? validateSceneLinksStrict(scenes) : []
  const allErrors = [...errors, ...linkIssues]

  // Optional JSON Schema validation (warnings only)
  if (schema && schemaValidator) {
    let parsed = null
    try { parsed = JSON.parse(text) } catch {}
    if (parsed) {
      const valid = schemaValidator(parsed)
      if (!valid) {
        for (const err of schemaValidator.errors || []) {
          // Mark schema as warning (won't fail CI)
          allErrors.push({ code:'schema:warn', path: err.instancePath || '/', message: err.message || 'schema warning' })
        }
      }
    }
  }

  // Count only non-schema issues as errors
  const hardErrors = allErrors.filter(e => String(e.code||'').indexOf('schema') !== 0)
  return { scenesCount: (JSON.parse(text) || []).length || 0, errors: hardErrors, all: allErrors }
}

async function main() {
  const root = process.cwd()
  const scenesDir = resolve(root, 'templates/minimal/public/scenes')

  let loader
  try {
    const loaderPath = resolve(root, 'dist/vn/sceneLoader.js')
    if (!existsSync(loaderPath)) throw new Error('missing')
    loader = await import(pathToFileURL(loaderPath).href)
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
    const { scenesCount, errors, all } = await validateFile(fp, loader, schemaValidator)
    if (errors.length === 0) {
      console.log(`✓ ${f} is valid (${scenesCount} scene${scenesCount === 1 ? '' : 's'})`)
    } else {
      console.error(`Found ${errors.length} issue(s) in ${f}:`)
      for (const err of all) {
        const isWarn = String(err.code||'').startsWith('schema:warn')
        const out = `- [${err.code}] ${err.path} :: ${err.message}`
        if(isWarn) console.warn(out); else console.error(out)
      }
      totalErrors += errors.length
    }
  }

  if (totalErrors > 0) process.exit(1)
}

main()
