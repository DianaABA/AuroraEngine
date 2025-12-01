import { describe, it, expect } from 'vitest'
import { readdirSync, statSync } from 'fs'
import { join, extname, relative } from 'path'

function findViolations(dir: string, root: string, out: string[]){
  for(const name of readdirSync(dir)){
    const fp = join(dir, name)
    const st = statSync(fp)
    if(st.isDirectory()) findViolations(fp, root, out)
    else if(st.isFile()){
      const ext = extname(name)
      if(ext === '.js' || ext === '.d.ts' || ext === '.js.map'){
        out.push(relative(root, fp))
      }
    }
  }
}

describe('no compiled artifacts under src/', () => {
  it('ensures src contains only .ts sources', () => {
    const root = process.cwd()
    const src = join(root, 'src')
    const violations: string[] = []
    findViolations(src, root, violations)
    expect(violations, `Compiled files found in src:\n${violations.join('\n')}`).toHaveLength(0)
  })
})
