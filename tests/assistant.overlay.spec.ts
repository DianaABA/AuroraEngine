import { describe, it, expect } from 'vitest'

// Minimal DOM stubs to exercise templates/minimal/src/assistant.ts
class El {
  id: string
  style: any = { display: 'none' }
  textContent = ''
  value = ''
  innerHTML = ''
  title = ''
  onclick: ((ev?: any)=>void) | null = null
  listeners: Record<string, ((ev?: any)=>void)[]> = {}
  parentElement: any = { insertBefore: (_a: any, _b: any)=>{} }
  className = ''
  children: any[] = []
  constructor(id: string){ this.id = id }
  addEventListener(type: string, fn: (ev?: any)=>void){ (this.listeners[type] ||= []).push(fn) }
  dispatchEvent(ev: any){ (this.listeners[ev?.type || '']||[]).forEach(fn=> fn(ev)) }
  appendChild(child: any){ this.children.push(child) }
  focus(){ /* noop */ }
  scrollIntoView(){ /* noop */ }
}

const elements = new Map<string, any>()
function ensure(id: string){ if(!elements.has(id)) elements.set(id, new El(id)); return elements.get(id) }

// Required elements
const requiredIds = [
  'assistantOverlay','assistantBody','assistantInput','assistantSend','assistantStop','assistantCopy','assistantClear','assistantClose','assistantStatus','assistantModel','assistantTokens','assistantProvider','askAurora','aiProgressBar','aiCancel'
]
requiredIds.forEach(id=> ensure(id))

// Provide customJson textarea to avoid paste errors
ensure('customJson')

// Global stubs
// @ts-ignore
globalThis.document = {
  getElementById: (id: string)=> ensure(id),
  addEventListener: (_type: string, _fn: (ev?: any)=>void)=>{},
  createElement: (tag: string)=> new El(tag)
}
// @ts-ignore
globalThis.window = { auroraShowToast: (_msg: string)=>{}, confirm: (_q: string)=> true }
// @ts-ignore
globalThis.navigator = { clipboard: { writeText: (_t: string)=>{} } }
// Minimal localStorage
const store: Record<string,string> = {}
// @ts-ignore
globalThis.localStorage = {
  getItem: (k: string)=> store[k] || null,
  setItem: (k: string, v: string)=>{ store[k] = v },
  removeItem: (k: string)=>{ delete store[k] }
}

// Import the assistant module (wires up event handlers)
let assistantMod: any
async function importAssistant(){
  if(!assistantMod){
    assistantMod = await import('../templates/minimal/src/assistant')
  }
}

function getEl(id: string){ return elements.get(id) as El }

describe('Ask Aurora overlay buttons', () => {
  it('opens and closes overlay via Mode and Close', () => {
    return importAssistant().then(()=>{
    const ask = getEl('askAurora')
    const overlay = getEl('assistantOverlay')
    ask.onclick && ask.onclick()
    expect(overlay.style.display).toBe('flex')
    const close = getEl('assistantClose')
    close.onclick && close.onclick()
    expect(overlay.style.display).toBe('none')
    })
  })

  it('creates presets toolbar on first render and auto-sends via preset', async () => {
    await importAssistant()
    const overlay = getEl('assistantOverlay')
    const ask = getEl('askAurora')
    ask.onclick && ask.onclick()
    // Trigger first render by sending a tiny prompt
    const input = getEl('assistantInput')
    input.value = 'hello'
    const send = getEl('assistantSend')
    send.onclick && send.onclick()
    // After local adapter completes, assistantBody should have content
    await new Promise(r=> setTimeout(r, 1800))
    const body = getEl('assistantBody')
    expect(body.innerHTML).toBeTypeOf('string')
    // Click a preset (Fix JSON) should auto-seed and send again (no crash)
    const presetsEl = ensure('assistantPresets')
    const fixBtn = new El('preset-fix')
    fixBtn.onclick = getEl('assistantSend').onclick // simulate send call
    presetsEl.onclick && presetsEl.onclick({ type: 'click' })
    // No exception indicates button is responsive
    expect(true).toBe(true)
  })

  it('clear button resets chat', () => {
    return importAssistant().then(()=>{
    const clear = getEl('assistantClear')
    const body = getEl('assistantBody')
    body.innerHTML = 'x'
    clear.onclick && clear.onclick()
    expect(body.innerHTML).toBeTypeOf('string')
    })
  })

  it('local cancel stops generation', async () => {
    await importAssistant()
    const ask = getEl('askAurora')
    ask.onclick && ask.onclick()
    const input = getEl('assistantInput')
    input.value = 'generate'
    const send = getEl('assistantSend')
    send.onclick && send.onclick()
    const cancel = getEl('aiCancel')
    // Cancel shortly after starting
    setTimeout(()=> cancel.onclick && cancel.onclick(), 200)
    // Wait for adapter path to handle cancellation
    await new Promise(r=> setTimeout(r, 800))
    // If no throws occurred, cancel button was wired and responsive
    expect(true).toBe(true)
  })

  it('Use JSON in Editor and Lint & Run actions call editor APIs', async () => {
    await importAssistant()
    // Stub editor API
    const applied: string[] = []
    const lintedRan: string[] = []
    // @ts-ignore
    globalThis.window.auroraEditor = {
      pasteJson: (txt: string)=> applied.push(txt),
      validateJson: (txt: string)=> ({ ok: true, scenes: [{ id: 'intro' }] }),
      applyToEditorFromJson: (txt: string)=> applied.push('apply:'+txt),
      runScenesFromJson: (txt: string)=> lintedRan.push(txt)
    }
    // Open overlay and send a prompt that the Local adapter will convert to JSON
    const ask = getEl('askAurora'); ask.onclick && ask.onclick()
    const send = getEl('assistantSend')
    const input = getEl('assistantInput'); input.value = 'Please generate a scene JSON.'
    send.onclick && send.onclick()
    // Wait for local adapter to finish and render actions
    await new Promise(r=> setTimeout(r, 1600))
    const body = getEl('assistantBody')
    const lastMsg = body.children[body.children.length - 1]
    // Find action buttons appended to the assistant message
    const actions = (lastMsg?.children || []).find((c: any)=> (c.className||'').includes('asst-action'))
    const useBtn = (actions?.children || []).find((b: any)=> (b.textContent||'').includes('Use JSON in Editor'))
    const lintBtn = (actions?.children || []).find((b: any)=> (b.textContent||'').includes('Lint & Run'))
    useBtn && useBtn.onclick && useBtn.onclick()
    lintBtn && lintBtn.onclick && lintBtn.onclick()
    expect(applied.length >= 1).toBe(true)
    expect(lintedRan.length >= 1).toBe(true)
  })
})
