#!/usr/bin/env node
/**
 * Release gate: runs the core build/test/lint/template steps and checks required dist files.
 * Cross-platform (uses node:child_process).
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const steps = [
  { name: 'build (root)', cmd: ['npm', 'run', 'build'], cwd: '.' },
  { name: 'test (root)', cmd: ['npm', 'test'], cwd: '.' },
  { name: 'build:ui', cmd: ['npm', 'run', 'build:ui'], cwd: '.' },
  { name: 'build template', cmd: ['npm', 'run', 'build'], cwd: 'templates/minimal' },
  { name: 'scene lint', cmd: ['node', 'scripts/scene-lint.js', '--file', 'templates/minimal/public/scenes/example.json'], cwd: '.' },
]

const requiredFiles = [
  'dist/index.js',
  'dist/state/modules/Achievements.js',
  'dist/state/modules/Gallery.js'
]

function runStep({ name, cmd, cwd }) {
  console.log(`\n==> ${name}`)
  const [exe, ...args] = cmd
  const result = spawnSync(exe, args, {
    cwd: cwd ? resolve(process.cwd(), cwd) : process.cwd(),
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })
  if (result.status !== 0) {
    console.error(`✗ ${name} failed (exit ${result.status})`)
    process.exit(result.status || 1)
  }
  console.log(`✓ ${name} ok`)
}

function checkFiles(files) {
  console.log('\n==> Checking required dist files')
  const missing = files.filter(f => !existsSync(resolve(process.cwd(), f)))
  if (missing.length) {
    console.error('✗ Missing files:\n - ' + missing.join('\n - '))
    process.exit(1)
  }
  console.log('✓ Dist files present')
}

for (const step of steps) runStep(step)
checkFiles(requiredFiles)

console.log('\nAll release checks passed.')
