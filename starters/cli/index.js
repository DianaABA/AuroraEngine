#!/usr/bin/env node
/**
 * Minimal starter copier for AuroraEngine.
 *
 * Usage:
 *   node starters/cli/index.js my-game
 *
 * Copies templates/minimal into ./my-game (excluding node_modules/dist),
 * then optionally runs npm install if --install is passed.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const args = process.argv.slice(2)
const targetDir = args[0] || 'aurora-game'
const shouldInstall = args.includes('--install')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templateDir = path.resolve(__dirname, '..', '..', 'templates', 'minimal')
const destDir = path.resolve(process.cwd(), targetDir)

if(fs.existsSync(destDir)){
  console.error(`Destination ${destDir} already exists. Aborting.`)
  process.exit(1)
}

const skip = new Set(['node_modules', 'dist', '.DS_Store'])

function copyDir(src, dst){
  fs.mkdirSync(dst, { recursive: true })
  for(const entry of fs.readdirSync(src, { withFileTypes: true })){
    if(skip.has(entry.name)) continue
    const from = path.join(src, entry.name)
    const to = path.join(dst, entry.name)
    if(entry.isDirectory()){
      copyDir(from, to)
    } else {
      fs.copyFileSync(from, to)
    }
  }
}

console.log(`Copying template from ${templateDir} -> ${destDir}`)
copyDir(templateDir, destDir)

if(shouldInstall){
  console.log('Installing dependencies...')
  execSync('npm install', { cwd: destDir, stdio: 'inherit' })
}

console.log('Done. Next steps:')
console.log(`  cd ${targetDir}`)
console.log('  npm install   # if you did not use --install')
console.log('  npm run dev')
