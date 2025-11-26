import { describe, it, expect, vi } from 'vitest'

// Mock local engine from @mlc-ai/web-llm
vi.mock('@mlc-ai/web-llm', () => ({
  CreateMLCEngine: vi.fn(async () => ({
    chat: {
      completions: {
        create: vi.fn(async ({ messages }: any) => ({
          choices: [ { message: { content: 'LOCAL_RESPONSE:' + (messages?.length || 0) } } ]
        }))
      }
    }
  }))
}))

// Mock OpenAI client
vi.mock('openai', () => ({
  OpenAI: class {
    apiKey: string
    constructor(cfg: any){ this.apiKey = cfg.apiKey }
    chat = {
      completions: {
        create: async ({ messages }: any) => ({
          choices: [ { message: { content: 'REMOTE_RESPONSE:' + (messages?.length || 0) } } ]
        })
      }
    }
  }
}))

import { getAIAdapters } from '../src/utils/aiModes'

describe('getAIAdapters', () => {
  it('returns local adapters for local mode', async () => {
    const res = await getAIAdapters('local')
    expect(res.mode).toBe('local')
    expect(res.local).toBeTruthy()
    const out = await res.local!.convertScriptToJSON('hello world')
    expect(out.startsWith('LOCAL_RESPONSE')).toBe(true)
  })

  it('throws if remote mode without key', async () => {
    await expect(getAIAdapters('byok')).rejects.toThrow(/API key/i)
  })

  it('returns remote adapters with key', async () => {
    const res = await getAIAdapters('byok', 'abc123')
    expect(res.remote).toBeTruthy()
    const out = await res.remote!.generateScene('scene prompt')
    expect(out.startsWith('REMOTE_RESPONSE')).toBe(true)
  })
})
