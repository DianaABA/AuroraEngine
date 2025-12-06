// Minimal assistant chat client for the template (BYOK over serverless)
// Reads prefs from localStorage (same schema as main.ts) to get BYOK key/provider/model.

const PREFS_KEY = 'aurora:minimal:prefs'

type Prefs = {
  aiMode?: 'local'|'byok'
  aiApiKey?: string
  aiProvider?: string
  aiModel?: string
  aiBaseUrl?: string
  // Assistant automation preferences (optional)
  autoApplyJson?: boolean
  autoRunJson?: boolean
}

type ChatMessage = { role: 'system'|'user'|'assistant'; content: string }

const DEFAULT_MODEL = 'gpt-4.1-mini'
const SYSTEM_PROMPT = `You are Aurora Assistant, a focused helper for AuroraEngine creators.
- Answer authoring questions concisely.
- Explain errors with actionable fixes.
- When asked to generate scenes, output only JSON (no extra prose).`;

const MAX_HISTORY = 16 // cap user/assistant turns to keep prompts bounded
const MAX_INPUT_CHARS = 4000 // simple client-side limit for a single prompt
const RETRYABLE_STATUS = new Set([429, 503])

function loadPrefs(): Prefs {
  try { return JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') } catch { return {} }
}

function savePrefs(p: Prefs){
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(p||{})) } catch {}
}

function ensureByokIfKey(){
  const p = loadPrefs()
  const hasKey = !!(p.aiApiKey||'').trim()
  if((p.aiMode||'local') !== 'byok' && hasKey){
    p.aiMode = 'byok'
    savePrefs(p)
    ;(window as any).auroraShowToast?.('AI Mode set to BYOK (key detected)')
  }
}

function guessProviderFromBaseUrl(){
  const p = loadPrefs()
  if(p.aiProvider && p.aiProvider.trim()) return
  const base = (p.aiBaseUrl||'').toLowerCase()
  if(!base) return
  let next: string | null = null
  if(base.includes('anthropic')) next = 'anthropic'
  else if(base.includes('groq')) next = 'groq'
  else if(base.includes('deepseek')) next = 'deepseek'
  else if(base.includes('openai')) next = 'openai'
  if(next){
    p.aiProvider = next
    savePrefs(p)
    ;(window as any).auroraShowToast?.(`Provider inferred from baseUrl: ${next}`)
  }
}

function $(id: string){ return document.getElementById(id)! }

const overlay = $('assistantOverlay') as HTMLDivElement
const bodyEl = $('assistantBody') as HTMLDivElement
const inputEl = $('assistantInput') as HTMLInputElement
const sendBtn = $('assistantSend') as HTMLButtonElement
const stopBtn = $('assistantStop') as HTMLButtonElement
const copyBtn = $('assistantCopy') as HTMLButtonElement
const clearBtn = $('assistantClear') as HTMLButtonElement
const closeBtn = $('assistantClose') as HTMLButtonElement
const askBtn = document.getElementById('askAurora') as HTMLButtonElement | null
const statusEl = $('assistantStatus') as HTMLSpanElement
const modelEl = $('assistantModel') as HTMLSpanElement
const tokensEl = $('assistantTokens') as HTMLSpanElement
const providerEl = document.getElementById('assistantProvider') as HTMLSpanElement | null
// Preset toolbar (created dynamically below)
let presetsBar: HTMLDivElement | null = null
const localProgress = document.getElementById('aiProgressBar') as HTMLDivElement | null
const localCancelBtn = document.getElementById('aiCancel') as HTMLButtonElement | null
import { LocalAIAdapter } from './localAi'

let messages: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }]
let inflight: AbortController | null = null

function setStatus(text: string | null){
  if(!text){ statusEl.style.display = 'none'; statusEl.textContent = ''; return }
  statusEl.style.display = 'inline-flex'; statusEl.textContent = text
}

function render(){
  bodyEl.innerHTML = ''
  // Ensure preset toolbar exists (once)
  if(!presetsBar){
    presetsBar = document.createElement('div')
    presetsBar.id = 'assistantPresets'
    presetsBar.style.display = 'flex'
    presetsBar.style.flexWrap = 'wrap'
    presetsBar.style.gap = '6px'
    presetsBar.style.margin = '8px 0'
    const mkBtn = (label: string, seed: string)=>{
      const b = document.createElement('button')
      b.className = 'secondary preset-btn'
      b.textContent = label
      b.onclick = ()=> openChatWithSeed(seed, true)
      return b
    }
    presetsBar.appendChild(mkBtn('Behavior Model', 'Help model behaviors for characters and choices; produce an AuroraEngine scene JSON with realistic reactions and emotions.'))
    presetsBar.appendChild(mkBtn('Story Coach', 'Coach the branching structure and pacing; return AuroraEngine scene JSON with well-labeled choices and balanced path lengths.'))
    presetsBar.appendChild(mkBtn('Fix JSON', 'Repair and validate this AuroraEngine scene JSON; output JSON only, no prose.'))
    presetsBar.appendChild(mkBtn('Add Choices', 'Analyze the current scene and add 2–3 meaningful branching choices with clear labels and balanced outcomes. Return valid AuroraEngine scene JSON only.'))
    presetsBar.appendChild(mkBtn('Polish Dialogue', 'Polish the dialogue for tone, clarity, and pacing without changing plot. Keep character voices consistent. Return AuroraEngine scene JSON with updated dialogue only.'))
    // Insert toolbar before the message list
    bodyEl.parentElement?.insertBefore(presetsBar, bodyEl)
  }
  for(const m of messages){
    if(m.role === 'system') continue
    const div = document.createElement('div')
    div.className = 'asst-msg ' + (m.role === 'user' ? 'asst-user' : 'asst-bot')
    // Render content
    div.textContent = m.content
    // If assistant likely returned JSON, offer a quick action
    if(m.role === 'assistant' && isLikelyJSON(m.content)){
      const actions = document.createElement('div')
      actions.className = 'asst-action'
      actions.style.display = 'flex'
      actions.style.gap = '6px'
      actions.style.marginTop = '6px'
      const btnUse = document.createElement('button')
      btnUse.className = 'secondary'
      btnUse.textContent = 'Use JSON in Editor'
      btnUse.title = 'Validate, then apply to editor'
      btnUse.onclick = ()=> useJsonInEditor(m.content, true)
      const btnRun = document.createElement('button')
      btnRun.className = 'secondary'
      btnRun.textContent = 'Lint & Run'
      btnRun.title = 'Validate and run if OK'
      btnRun.onclick = ()=> lintAndRunJson(m.content)
      actions.appendChild(btnUse)
      actions.appendChild(btnRun)
      div.appendChild(actions)
    }
    bodyEl.appendChild(div)
  }
  bodyEl.scrollTop = bodyEl.scrollHeight
}

function openChat(){ overlay.style.display = 'flex'; setTimeout(()=> inputEl.focus(), 0) }
function closeChat(){ overlay.style.display = 'none' }

function openChatWithSeed(seed: string, autoSend = false){
  openChat()
  try {
    inputEl.value = seed || ''
  } catch {}
  if(autoSend){
    // Slight delay to allow render/focus before sending
    setTimeout(()=>{ try{ send() }catch{} }, 10)
  }
}

function setModelBadge(){
  const prefs = loadPrefs()
  const model = prefs.aiModel || DEFAULT_MODEL
  modelEl.textContent = model
}

function setProviderBadge(){
  if(!providerEl) return
  const prefs = loadPrefs()
  const p = (prefs.aiProvider || 'openai').toLowerCase()
  const label = p === 'anthropic' ? 'Anthropic' : p === 'groq' ? 'Groq' : p === 'deepseek' ? 'DeepSeek' : 'OpenAI'
  providerEl.textContent = label
  const hints: Record<string,string> = {
    openai: 'OpenAI-compatible. JSON OK; streaming supported.',
    anthropic: 'Claude: JSON best via tools/functions; larger context.',
    groq: 'Groq: very fast; watch rate limits.',
    deepseek: 'DeepSeek: reasoning-heavy; may be verbose.'
  }
  providerEl.title = hints[p] || hints.openai
}

function showTokensHint(n: number){
  if(n <= 0){ tokensEl.style.display = 'none'; tokensEl.textContent = ''; return }
  tokensEl.style.display = 'inline-flex'; tokensEl.textContent = `~${n} tok`
}

function estimateTokens(text: string){ return Math.ceil((text || '').length / 4) }

function isLikelyJSON(s: string){
  const t = (s||'').trim()
  if(!t) return false
  if(!(t.startsWith('{') || t.startsWith('['))) return false
  try{ JSON.parse(t); return true }catch{ return false }
}

function useJsonInEditor(text: string, confirmApply = false){
  try{
    const ta = document.getElementById('customJson') as HTMLTextAreaElement | null
    if(!ta) { setStatus('Editor JSON not found'); setTimeout(()=> setStatus(null), 900); return }
    const api = (window as any).auroraEditor
    if(api?.pasteJson) api.pasteJson(text)
    else { ta.value = text; ta.dispatchEvent(new Event('input', { bubbles:true })) }
    const vres = api?.validateJson ? api.validateJson(text) : null
    if(vres && vres.ok){
      ;(window as any).auroraShowToast?.('Lint OK (Use JSON)')
      if(confirmApply){
        const ok = window.confirm(`Validation passed (${(vres.scenes||[]).length} scene(s)). Apply to editor?`)
        if(ok){ api?.applyToEditorFromJson?.(text) }
      }
    } else if(vres && !vres.ok){
      ;(window as any).auroraShowToast?.(`Lint errors: ${(vres.issues||[]).length}`)
    }
    ta.scrollIntoView({ behavior:'smooth', block:'center' })
    ta.focus()
    setStatus('Pasted to Editor'); setTimeout(()=> setStatus(null), 900)
  }catch{}
}

function lintAndRunJson(text: string){
  try{
    const api = (window as any).auroraEditor
    if(!api?.validateJson){ setStatus('Validation API unavailable'); setTimeout(()=> setStatus(null), 900); return }
    const vres = api.validateJson(text)
    if(!vres.ok){
      ;(window as any).auroraShowToast?.(`Lint errors: ${(vres.issues||[]).length}`)
      setStatus('Lint errors'); setTimeout(()=> setStatus(null), 1200)
      return
    }
    const startId = (vres.scenes?.[0]?.id) || 'intro'
    const ok = window.confirm(`Validation OK. Run now starting at ${startId}?`)
    if(!ok) return
    api.runScenesFromJson?.(text)
  }catch{}
}

function maybeAutoActOnLastAssistant(){
  try{
    const p = loadPrefs()
    if(!p.autoApplyJson && !p.autoRunJson) return
    const last = [...messages].reverse().find(m=> m.role==='assistant')
    const content = last?.content || ''
    if(!isLikelyJSON(content)) return
    if(p.autoRunJson){ lintAndRunJson(content); return }
    if(p.autoApplyJson){ useJsonInEditor(content, false); return }
  }catch{}
}

async function send(){
  const textRaw = (inputEl.value || '')
  const text = textRaw.trim().slice(0, MAX_INPUT_CHARS)
  if(!text) return
  // Automate mode/provider decisions if possible
  ensureByokIfKey()
  guessProviderFromBaseUrl()
  const prefs = loadPrefs()
  const provider = (prefs.aiProvider || 'openai').toLowerCase()
  const model = (prefs.aiModel || DEFAULT_MODEL)
  const key = (prefs.aiApiKey || '').trim()
  if((prefs.aiMode || 'local') === 'local'){
    // Use local adapter
    const adapter = new LocalAIAdapter()
    let canceled = false
    localCancelBtn && (localCancelBtn.onclick = ()=>{ adapter.cancel(); canceled = true })
    messages.push({ role:'user', content:text })
    render(); setStatus('Downloading local model…')
    try{
      const content = await adapter.generate(text, {
        onStart: ()=>{ if(localProgress) localProgress.style.width = '0%' },
        onProgress: (pct)=>{ if(localProgress) localProgress.style.width = pct + '%' },
        onDone: ()=>{ setStatus('Generating…') }
      })
      messages.push({ role:'assistant', content })
      render(); setStatus(null)
      maybeAutoActOnLastAssistant()
    } catch(err: any){
      messages.push({ role:'assistant', content: canceled ? 'Canceled.' : `Error: ${String(err?.message || err)}` })
      render(); setStatus(null)
    }
    inputEl.value = ''
    return
  }
  if(!key){
    const warn = { role:'assistant', content: 'No API key set. Open Settings → AI Mode: BYOK and paste your key.' } as ChatMessage
    messages.push({ role:'user', content:text }, warn)
    inputEl.value = ''
    render()
    return
  }

  // Heuristic: if user asks to generate scenes, add an extra JSON-only nudge
  const isGen = /\b(scene|json|generate|write|produce)\b/i.test(text)
  if(isGen){
    messages.push({ role:'system', content: 'For generation tasks: respond with JSON only, no prose.' })
  }
  messages.push({ role:'user', content:text })
  // Trim history (keep system + last N turns)
  const nonSys = messages.filter(m=> m.role !== 'system')
  if(nonSys.length > MAX_HISTORY){
    const toKeep = nonSys.slice(nonSys.length - MAX_HISTORY)
    messages = [messages.find(m=> m.role==='system')!].concat(toKeep)
  }
  render()
  inputEl.value = ''

  const controller = new AbortController()
  inflight = controller
  setStatus('Thinking…')
  setModelBadge()
  setProviderBadge()
  // Rough prompt token estimate
  try{
    const promptTok = estimateTokens(messages.filter(m=> m.role!=='system').map(m=> m.content).join('\n'))
    showTokensHint(promptTok)
  } catch {}

  async function doRequest(){
    const wantStream = true
    return fetch('/api/aurora-assistant', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-openai-key': key,
        // Optional hints for multi-provider servers; safe if ignored
        'x-provider': provider,
        'x-base-url': (prefs.aiBaseUrl || '').trim() || ''
      },
      body: JSON.stringify({
        provider,
        model,
        baseUrl: (prefs.aiBaseUrl || '').trim() || undefined,
        messages,
        stream: wantStream
      }),
      signal: controller.signal
    })
  }

  try{
    // Basic retry/backoff for transient errors
    let res = await doRequest()
    if(RETRYABLE_STATUS.has(res.status)){
      setStatus('Waiting (rate limited)…')
      await new Promise(r=> setTimeout(r, 800))
      res = await doRequest()
    }
    if(!res.ok){
      const txt = await res.text().catch(()=> '')
      messages.push({ role:'assistant', content: `Error ${res.status}: ${txt || res.statusText}` })
      render(); setStatus(null); return
    }
    // Stream path (NDJSON) vs fallback JSON
    const ctype = (res.headers.get('content-type') || '').toLowerCase()
    if(ctype.includes('application/x-ndjson')){
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let botMsg: ChatMessage = { role:'assistant', content:'' }
      messages.push(botMsg)
      render()
      setStatus('Streaming…')
      let buf = ''
      let outTok = 0
      while(true){
        const { value, done } = await reader.read()
        if(done) break
        buf += decoder.decode(value, { stream: true })
        let idx
        while((idx = buf.indexOf('\n')) >= 0){
          const line = buf.slice(0, idx).trim()
          buf = buf.slice(idx+1)
          if(!line) continue
          try{
            const obj = JSON.parse(line)
            if(obj.delta){
              const d = String(obj.delta)
              botMsg.content += d
              outTok += estimateTokens(d)
              showTokensHint(outTok)
              render()
            }
            if(obj.error){
              const code = String(obj.error)
              const msg = String(obj.message || '')
              if(code === 'rate_limited'){
                setStatus('Rate limited. Retrying or wait…')
                const hint = document.getElementById('aiRateHint') as HTMLSpanElement | null
                if(hint){ hint.style.display = 'inline'; hint.textContent = 'Rate limit hit. Try again shortly.' }
              } else if(code === 'timeout'){
                setStatus('Timeout. Try again')
              } else {
                setStatus(msg || 'Error')
              }
            }
            if(obj.done){ setStatus(null) }
          }catch{}
        }
      }
      setStatus(null)
      // After complete stream, consider auto-actions on JSON
      maybeAutoActOnLastAssistant()
    } else {
      const json = await res.json().catch(()=> null) as { ok?: boolean; content?: string; error?: string } | null
      if(!json || json.ok === false){
        const err = String(json?.error || 'Request failed')
        if(err === 'rate_limited'){
          setStatus('Rate limited. Please wait…')
          const hint = document.getElementById('aiRateHint') as HTMLSpanElement | null
          if(hint){ hint.style.display = 'inline'; hint.textContent = 'Provider rate limit exceeded. Try again shortly.' }
        }
        messages.push({ role:'assistant', content: err })
      } else {
        messages.push({ role:'assistant', content: json?.content || '' })
      }
      render(); setStatus(null)
      maybeAutoActOnLastAssistant()
    }
  } catch(err: any){
    if(controller.signal.aborted){
      messages.push({ role:'assistant', content: 'Canceled.' })
    } else {
      messages.push({ role:'assistant', content: `Error: ${String(err?.message || err)}` })
    }
    render(); setStatus(null)
  } finally {
    if(inflight === controller) inflight = null
    // Hide tokens hint a moment after completion
    setTimeout(()=> showTokensHint(0), 1200)
  }
}

function stop(){
  try{ inflight?.abort() } catch {}
}

function copyLast(){
  const last = [...messages].reverse().find(m=> m.role==='assistant')
  if(!last || !last.content){ setStatus('Nothing to copy'); setTimeout(()=> setStatus(null), 1000); return }
  try { navigator.clipboard.writeText(last.content) } catch {}
  setStatus('Copied'); setTimeout(()=> setStatus(null), 800)
}

function clearChat(){
  messages = [{ role:'system', content: SYSTEM_PROMPT }]
  render(); setStatus('Cleared'); setTimeout(()=> setStatus(null), 700)
}

// Wire events
askBtn && (askBtn.onclick = openChat)
closeBtn.onclick = closeChat
sendBtn.onclick = send
stopBtn.onclick = stop
copyBtn.onclick = copyLast
clearBtn.onclick = clearChat
inputEl.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send() } })
// Ctrl+Enter also sends; Escape closes overlay
inputEl.addEventListener('keydown', (e)=>{
  if((e.ctrlKey || (e as any).metaKey) && e.key === 'Enter'){ e.preventDefault(); send() }
})
document.addEventListener('keydown', (e)=>{
  if(overlay.style.display !== 'none' && e.key === 'Escape'){ e.preventDefault(); closeChat() }
})

// Close when clicking outside
overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeChat() })

// Expose for debugging
;(window as any).auroraAssistant = { openChat, openChatWithSeed, send, stop }
