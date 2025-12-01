import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { loadScenesFromJsonStrict, indexScenes, simulateScene } from '../src/vn/sceneLoader'

function readPack(name: string){
  const file = path.join(__dirname, '..', 'templates', 'minimal', 'public', 'scenes', `${name}.json`)
  return fs.readFileSync(file, 'utf-8')
}

describe('packs switching (runtime smoke)', () => {
  it('loads example then expressions and both produce valid scene maps', () => {
    const ex = readPack('example')
    const exStrict = loadScenesFromJsonStrict(ex)
    expect(exStrict.errors).toEqual([])
    const exMap = indexScenes(exStrict.scenes)
    expect(exMap.has('intro')).toBe(true)

    const expr = readPack('expressions')
    const exprStrict = loadScenesFromJsonStrict(expr)
    expect(exprStrict.errors).toEqual([])
    const exprMap = indexScenes(exprStrict.scenes)
    expect(exprMap.has('intro')).toBe(true)

    // quick simulate smoke on first scene of each
    const exIntro = exMap.get('intro')!
    const exprIntro = exprMap.get('intro')!
    const exLog = simulateScene(exIntro)
    const exprLog = simulateScene(exprIntro)
    expect(exLog.length).toBeGreaterThan(0)
    expect(exprLog.length).toBeGreaterThan(0)
  })
})
