#!/usr/bin/env node
/**
 * Extract the latest changelog section (or a specific version) and print it to stdout.
 * Usage: TARGET_VERSION=v0.0.4 node scripts/gen-release-notes.js
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = join(__dirname, '..')
const target = process.env.TARGET_VERSION || ''

function parseChangelog(text) {
  const lines = text.split(/\r?\n/)
  const sections = []
  let current = null
  for (const line of lines) {
    const match = /^##\s*(v[^\s]+)\s*/i.exec(line)
    if (match) {
      if (current) sections.push(current)
      current = { version: match[1], lines: [] }
      continue
    }
    if (current) current.lines.push(line)
  }
  if (current) sections.push(current)
  return sections
}

function main() {
  const changelogPath = join(root, 'CHANGELOG.md')
  let text = ''
  try { text = readFileSync(changelogPath, 'utf8') } catch (e) {
    console.error('Failed to read CHANGELOG.md', e)
    process.exit(1)
  }
  const sections = parseChangelog(text)
  if (!sections.length) {
    console.error('No changelog sections found')
    process.exit(1)
  }
  let section = sections[0]
  if (target) {
    const found = sections.find(s => s.version === target)
    if (found) section = found
  }
  const body = section.lines.join('\n').trim()
  if (!body) {
    console.error('Selected changelog section is empty')
    process.exit(1)
  }
  console.log(body)
}

main()
