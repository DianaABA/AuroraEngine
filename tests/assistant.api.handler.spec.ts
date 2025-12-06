import { describe, it, expect } from 'vitest'
import { handleAuroraAssistant } from '../assistant/api/aurora-assistant'

function makeReq(body:any, headers:any={}){
  return { method:'POST', body: JSON.stringify(body), headers }
}
function makeRes(){
  const chunks: any[] = []
  return {
    statusCode: 200,
    headers: {} as Record<string,string>,
    setHeader(k:string,v:string){ this.headers[k]=v },
    write(d:string){ chunks.push(d) },
    end(d?:string){ if(d) chunks.push(d) },
    _chunks: chunks
  }
}

describe('Aurora Assistant handler (skeleton)', () => {
  it('rejects missing api key', async () => {
    const req = makeReq({ provider:'openai', model:'gpt-4o-mini', messages:[{role:'user', content:'hi'}] })
    const res = makeRes()
    await handleAuroraAssistant(req as any, res as any)
    expect(res.statusCode).toBe(401)
  })

  it('rejects unsupported provider/model', async () => {
    const req = makeReq({ provider:'openai', model:'not-allowed', messages:[{role:'user', content:'hi'}] }, { 'x-openai-key':'key' })
    const res = makeRes()
    await handleAuroraAssistant(req as any, res as any)
    expect(res.statusCode).toBe(400)
  })
})
