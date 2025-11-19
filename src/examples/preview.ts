import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadScenesFromJson, simulateScene } from '../vn/sceneLoader'

function main(){
  const path = resolve(process.cwd(), 'scenes', 'example.json')
  const raw = readFileSync(path, 'utf-8')
  const { scenes, errors } = loadScenesFromJson(raw)
  if(errors.length){
    console.error('Scene load errors:', errors)
    process.exitCode = 1
    return
  }
  const intro = scenes.find(s=> s.id==='intro') || scenes[0]
  if(!intro){
    console.error('No scenes found in example.json')
    process.exitCode = 1
    return
  }
  const log = simulateScene(intro)
  console.log('--- Simulated Scene:', intro.id, '---')
  for(const line of log){ console.log(line) }
}

main()
