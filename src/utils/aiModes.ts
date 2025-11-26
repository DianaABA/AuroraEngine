import type { ChatCompletionMessageParam } from 'openai/resources/chat'

export type AIMode = 'local' | 'byok'
export type AIProvider = 'openai' | 'anthropic' | 'groq' | 'deepseek'

export type LocalAI = {
  convertScriptToJSON: (script: string) => Promise<string>
  fixGrammar: (text: string) => Promise<string>
  detectSceneErrors: (json: string) => Promise<string>
}

export type RemoteAI = {
  generateScene: (prompt: string) => Promise<string>
  extendDialogue: (scene: any, prompt: string) => Promise<string>
  suggestBranches: (scene: any) => Promise<string>
  generateAssets?: (prompt: string) => Promise<string>
}

async function loadLocalLLM(modelId?: string) {
  // Lazy load WebLLM to avoid bundling cost until needed
  const { CreateMLCEngine } = await import('@mlc-ai/web-llm')
  // Use a tiny model for demo; can be made configurable
  const engine = await CreateMLCEngine(modelId || 'Qwen2-0.5B-Instruct-q4f16_1-MLC')
  return engine
}

async function localChat(messages: { role:'user'|'assistant'|'system'; content:string }[], modelId?: string) {
  const engine = await loadLocalLLM(modelId)
  const reply = await engine.chat.completions.create({ messages, temperature: 0.2 })
  const text = reply.choices?.[0]?.message?.content
  if (!text) throw new Error('Local model returned empty response')
  return text
}

async function openAIChat(apiKey: string, messages: ChatCompletionMessageParam[], opts?: { baseURL?: string; model?: string }) {
  const { OpenAI } = await import('openai')
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true, baseURL: opts?.baseURL || undefined })
  const res = await client.chat.completions.create({
    model: opts?.model || 'gpt-4o-mini',
    temperature: 0.2,
    messages,
    response_format: { type: 'json_object' }
  })
  const txt = res.choices?.[0]?.message?.content
  if (!txt) throw new Error('Empty response from provider')
  return txt
}

const SYSTEM_SCRIPT_TO_JSON = `You are an AuroraEngine scene builder. Convert simple script text into Aurora scene JSON array. Use ids, steps with dialogue, choice (label/goto), background, spriteShow/spriteSwap, music, transition. Return JSON only.`
const SYSTEM_FIX_GRAMMAR = `You are a copy editor. Fix grammar and typos. Return plain text.`
const SYSTEM_DETECT_ERRORS = `You are a scene validator. Given scene JSON, list structural errors/missing fields. Return JSON array of {code,path,message}.`

const SYSTEM_SCENE_GEN = `You are an AuroraEngine authoring assistant. Given a prompt, produce Aurora scene JSON. Use ids, dialogue, choice with goto, transitions where helpful. Return JSON only.`
const SYSTEM_EXTEND = `Extend/continue the given scene JSON with more dialogue/branching. Keep structure valid. Return JSON only.`
const SYSTEM_BRANCH = `Suggest additional branches for the given scene JSON. Return JSON scenes or choice steps.`

export async function getAIAdapters(mode: AIMode, apiKey?: string, opts?: { provider?: AIProvider; baseURL?: string; model?: string; localModel?: string }): Promise<{ mode: AIMode; local?: LocalAI; remote?: RemoteAI }> {
  if (mode === 'local') {
    const local: LocalAI = {
      async convertScriptToJSON(script: string) {
        return localChat([{ role:'system', content: SYSTEM_SCRIPT_TO_JSON }, { role:'user', content: script }], opts?.localModel)
      },
      async fixGrammar(text: string) {
        return localChat([{ role:'system', content: SYSTEM_FIX_GRAMMAR }, { role:'user', content: text }], opts?.localModel)
      },
      async detectSceneErrors(json: string) {
        return localChat([{ role:'system', content: SYSTEM_DETECT_ERRORS }, { role:'user', content: json }], opts?.localModel)
      }
    }
    return { mode, local }
  }
  if (!apiKey) throw new Error('API key required for BYOK mode')
  const provider = opts?.provider || 'openai'
  const baseURL =
    opts?.baseURL ||
    (provider === 'anthropic' ? 'https://api.anthropic.com/v1' :
     provider === 'groq' ? 'https://api.groq.com/openai/v1' :
     provider === 'deepseek' ? 'https://api.deepseek.com/v1' :
     undefined)

  const remote: RemoteAI = {
    async generateScene(prompt: string) {
      return openAIChat(apiKey, [
        { role:'system', content: SYSTEM_SCENE_GEN },
        { role:'user', content: prompt }
      ], { baseURL, model: opts?.model })
    },
    async extendDialogue(scene: any, prompt: string) {
      return openAIChat(apiKey, [
        { role:'system', content: SYSTEM_EXTEND },
        { role:'user', content: `Scene JSON:\n${JSON.stringify(scene, null, 2)}\n\nPrompt:\n${prompt}` }
      ], { baseURL: opts?.baseURL, model: opts?.model })
    },
    async suggestBranches(scene: any) {
      return openAIChat(apiKey, [
        { role:'system', content: SYSTEM_BRANCH },
        { role:'user', content: JSON.stringify(scene, null, 2) }
      ], { baseURL: opts?.baseURL, model: opts?.model })
    },
    async generateAssets(prompt: string) {
      return openAIChat(apiKey, [
        { role:'system', content: 'Generate asset descriptions (no images), return JSON array of {id,type,desc}.' },
        { role:'user', content: prompt }
      ], { baseURL: opts?.baseURL, model: opts?.model })
    }
  }
  return { mode, remote }
}
