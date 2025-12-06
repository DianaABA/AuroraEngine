#!/usr/bin/env node

import fs from 'node:fs/promises'
import process from 'node:process'
import { convertScriptToScenes, ScriptParseError } from '../utils/scriptConverter'

const BINARY_NAME = 'aurora'

function printUsage() {
  const msg = `
Usage: ${BINARY_NAME} convert <script-file> [--output <target>]

Options:
  --output, -o    Path to write the converted JSON. Defaults to stdout.
  -h, --help      Show this message.

If <script-file> is "-", the converter reads from stdin.
`
  process.stdout.write(msg.trim() + '\n')
}

async function readStdinAsString(): Promise<string> {
  const buffers: Buffer[] = []
  for await (const chunk of process.stdin) {
    if (typeof chunk === 'string') {
      buffers.push(Buffer.from(chunk))
    } else {
      buffers.push(chunk)
    }
  }
  return Buffer.concat(buffers).toString('utf-8')
}

async function run(rawArgs: string[]) {
  if (rawArgs.length === 0) {
    printUsage()
    return
  }
  const [command, target, ...rest] = rawArgs
  if (!command || command === '-h' || command === '--help') {
    printUsage()
    return
  }
  if (command !== 'convert') {
    throw new Error(`Unknown command "${command}"`)
  }
  if (!target) {
    throw new Error('Missing script file path')
  }

  let outputPath: string | null = null
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i]
    if (arg === '-o' || arg === '--output') {
      i++
      if (i >= rest.length) {
        throw new Error(`${arg} requires a value`)
      }
      outputPath = rest[i]
      continue
    }
    if (arg === '-h' || arg === '--help') {
      printUsage()
      return
    }
    throw new Error(`Unknown option "${arg}"`)
  }

  const input = target === '-' ? await readStdinAsString() : await fs.readFile(target, 'utf-8')
  const scenes = convertScriptToScenes(input)
  const payload = JSON.stringify(scenes, null, 2)
  if (outputPath) {
    await fs.writeFile(outputPath, payload + '\n', 'utf-8')
    process.stdout.write(`Wrote ${scenes.length} scene(s) to ${outputPath}\n`)
  } else {
    process.stdout.write(payload + '\n')
  }
}

(async () => {
  try {
    await run(process.argv.slice(2))
  } catch (err) {
    const fallback = (()=>{ try { return String((err as any)?.message ?? err) } catch { return 'unknown_error' } })()
    const message = err instanceof ScriptParseError ? (err as any).message : fallback
    process.stderr.write(`Error: ${message}\n`)
    process.exit(1)
  }
})()
