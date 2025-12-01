#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const pub = path.join(root, 'templates', 'minimal', 'public')
const packsPath = path.join(pub, 'packs.json')

function err(msg){ console.error(`[packs:validate] ${msg}`) }
function ok(msg){ console.log(`[packs:validate] ${msg}`) }

let errors = 0
if(!fs.existsSync(packsPath)){
  err(`Missing packs.json at ${packsPath}`)
  process.exit(1)
}

const raw = fs.readFileSync(packsPath, 'utf-8')
let manifest
try{ manifest = JSON.parse(raw) }catch(e){ err('packs.json is not valid JSON'); process.exit(1) }
if(!manifest || !Array.isArray(manifest.packs)){ err('packs.json missing packs[]'); process.exit(1) }

// unique ids
const ids = new Set()
for(const p of manifest.packs){
  if(!p.id || typeof p.id !== 'string'){ err('pack missing string id'); errors++ }
  if(ids.has(p.id)){ err(`duplicate id: ${p.id}`); errors++ }
  ids.add(p.id)
}

// referenced files exist and starts resolve
for(const p of manifest.packs){
  const rel = String(p.scenesUrl||'').replace(/^\//,'')
  if(!rel){ err(`pack ${p.id} missing scenesUrl`); errors++; continue }
  const file = path.join(pub, rel)
  if(!fs.existsSync(file)){ err(`pack ${p.id} scenes missing: ${rel}`); errors++; continue }
  try{
    const txt = fs.readFileSync(file,'utf-8')
    const arr = JSON.parse(txt)
    if(!Array.isArray(arr)){ err(`pack ${p.id} scenes is not an array`); errors++ }
    const start = (p.meta && p.meta.start) || 'intro'
    const hasStart = Array.isArray(arr) && arr.some(s => s && s.id === start)
    if(!hasStart){ err(`pack ${p.id} start scene not found: ${start}`); errors++ }
  }catch(e){ err(`pack ${p.id} parse error: ${e.message}`); errors++ }
  if(p.assetsBaseUrl && typeof p.assetsBaseUrl !== 'string'){
    err(`pack ${p.id} assetsBaseUrl must be string`); errors++
  }
}

if(errors){ err(`validation failed with ${errors} error(s)`); process.exit(1) }
ok('packs.json validated')
