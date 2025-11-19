import { createEngine, on, loadScenesFromUrl, buildPreloadManifest, preloadAssets, Gallery, Achievements, Jukebox } from 'aurora-engine'

const nameEl = document.getElementById('name')!
const textEl = document.getElementById('text')!
const choicesEl = document.getElementById('choices')!
const continueBtn = document.getElementById('continueBtn') as HTMLButtonElement
const startExampleBtn = document.getElementById('startExample') as HTMLButtonElement
const startExpressionsBtn = document.getElementById('startExpressions') as HTMLButtonElement
const autoBtn = document.getElementById('autoBtn') as HTMLButtonElement
const autoChooseBtn = document.getElementById('autoChooseBtn') as HTMLButtonElement
const skipFxBtn = document.getElementById('skipFx') as HTMLButtonElement
const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement
const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement
const loadBtn = document.getElementById('loadBtn') as HTMLButtonElement
const saveStatus = document.getElementById('saveStatus')!
const slot1save = document.getElementById('slot1save') as HTMLButtonElement
const slot1load = document.getElementById('slot1load') as HTMLButtonElement
const slot2save = document.getElementById('slot2save') as HTMLButtonElement
const slot2load = document.getElementById('slot2load') as HTMLButtonElement
const slot3save = document.getElementById('slot3save') as HTMLButtonElement
const slot3load = document.getElementById('slot3load') as HTMLButtonElement
const slotStatus = document.getElementById('slotStatus')!
const slot1thumb = document.getElementById('slot1thumb') as HTMLImageElement
const slot2thumb = document.getElementById('slot2thumb') as HTMLImageElement
const slot3thumb = document.getElementById('slot3thumb') as HTMLImageElement
const bgLabel = document.getElementById('bgLabel')!
const bgEl = document.getElementById('bg') as HTMLDivElement
const spritesEl = document.getElementById('sprites') as HTMLDivElement
const fxEl = document.getElementById('fx')!
const openGalleryBtn = document.getElementById('openGallery') as HTMLButtonElement
const closeGalleryBtn = document.getElementById('closeGallery') as HTMLButtonElement
const galleryPanel = document.getElementById('galleryPanel') as HTMLDivElement
const galleryGrid = document.getElementById('galleryGrid') as HTMLDivElement
const openCodexBtn = document.getElementById('openCodex') as HTMLButtonElement
const closeCodexBtn = document.getElementById('closeCodex') as HTMLButtonElement
const codexPanel = document.getElementById('codexPanel') as HTMLDivElement
const codexList = document.getElementById('codexList') as HTMLDivElement
const openAchBtn = document.getElementById('openAch') as HTMLButtonElement
const closeAchBtn = document.getElementById('closeAch') as HTMLButtonElement
const achPanel = document.getElementById('achPanel') as HTMLDivElement
const achList = document.getElementById('achList') as HTMLDivElement
const openSettingsBtn = document.getElementById('openSettings') as HTMLButtonElement
const closeSettingsBtn = document.getElementById('closeSettings') as HTMLButtonElement
const settingsPanel = document.getElementById('settingsPanel') as HTMLDivElement
const toggleSkipSeenBtn = document.getElementById('toggleSkipSeen') as HTMLButtonElement
const toggleSkipTransitionsBtn = document.getElementById('toggleSkipTransitions') as HTMLButtonElement
const clearSeenBtn = document.getElementById('clearSeen') as HTMLButtonElement
const langEnBtn = document.getElementById('langEn') as HTMLButtonElement
const langEsBtn = document.getElementById('langEs') as HTMLButtonElement
const openBacklogBtn = document.getElementById('openBacklog') as HTMLButtonElement
const closeBacklogBtn = document.getElementById('closeBacklog') as HTMLButtonElement
const backlogPanel = document.getElementById('backlogPanel') as HTMLDivElement
const backlogList = document.getElementById('backlogList') as HTMLDivElement
const openSavesBtn = document.getElementById('openSaves') as HTMLButtonElement
const closeSavesBtn = document.getElementById('closeSaves') as HTMLButtonElement
const savesPanel = document.getElementById('savesPanel') as HTMLDivElement
const savesList = document.getElementById('savesList') as HTMLDivElement
const musicPlayBtn = document.getElementById('musicPlay') as HTMLButtonElement
const musicPauseBtn = document.getElementById('musicPause') as HTMLButtonElement
const musicStatus = document.getElementById('musicStatus') as HTMLSpanElement
const notifications = document.getElementById('notifications') as HTMLDivElement | null

const engine = createEngine({ autoEmit: true })
const gallery = new Gallery('aurora:minimal:gallery')
const achievements = new Achievements('aurora:minimal:ach')
let isPlaying = false
let skipFx = false
let backlog: { char?: string; text: string }[] = []
type SpriteCfg = { pos?: 'left'|'center'|'right'; x?: number; z?: number; scale?: number }
const spriteMeta: Record<string, SpriteCfg> = {}
const sceneSpriteDefaults: Record<string, Record<string, SpriteCfg>> = {}
const BACKLOG_KEY = 'aurora:minimal:backlog'
// Removed old Prefs type; replaced below with extended Prefs
const CODEX_KEY = 'aurora:minimal:codex'
const CODEX_META: Record<string, { title: string; body: string; category: string }> = {
  codex_hero: { title: 'Hero', body: 'A mysterious protagonist with many expressions.', category: 'Characters' },
  codex_lab: { title: 'Laboratory', body: 'A clean, bright lab used in demonstrations.', category: 'Locations' }
}
type Locale = 'en' | 'es'
type Prefs = { skipSeenText: boolean; skipTransitions: boolean; locale: Locale }
let prefs: Prefs = { skipSeenText: false, skipTransitions: false, locale: 'en' }
const PREFS_KEY = 'aurora:minimal:prefs'
let seenLines = new Set<string>()
const SEEN_KEY = 'aurora:minimal:seen'

// i18n strings
const STRINGS: Record<Locale, Record<string, (ctx?: any)=>string>> = {
  en: {
    settings: ()=> 'Settings',
    close: ()=> 'Close',
    backlog: ()=> 'Backlog',
    gallery: ()=> 'Gallery',
    achievements: ()=> 'Achievements',
    auto: (c:{on:boolean})=> `Auto: ${c.on? 'On':'Off'}`,
    autoChoose: (c:{on:boolean})=> `Auto-Choose: ${c.on? 'On':'Off'}`,
    skipFx: (c:{on:boolean})=> `Skip FX: ${c.on? 'On':'Off'}`,
    skipSeen: (c:{on:boolean})=> `Skip Seen Text: ${c.on? 'On':'Off'}`,
    skipTransitions: (c:{on:boolean})=> `Skip Transitions: ${c.on? 'On':'Off'}`,
    clearSeen: ()=> 'Clear Seen',
    language: ()=> 'Language',
    english: ()=> 'English',
    spanish: ()=> 'Spanish',
    slots: ()=> 'Slots:',
    saveN: (c:{n:number})=> `Save ${c.n}`,
    loadN: (c:{n:number})=> `Load ${c.n}`,
  },
  es: {
    settings: ()=> 'Ajustes',
    close: ()=> 'Cerrar',
    backlog: ()=> 'Historial',
    gallery: ()=> 'Galería',
    achievements: ()=> 'Logros',
    auto: (c:{on:boolean})=> `Auto: ${c.on? 'Sí':'No'}`,
    autoChoose: (c:{on:boolean})=> `Auto-Elegir: ${c.on? 'Sí':'No'}`,
    skipFx: (c:{on:boolean})=> `Omitir FX: ${c.on? 'Sí':'No'}`,
    skipSeen: (c:{on:boolean})=> `Omitir texto visto: ${c.on? 'Sí':'No'}`,
    skipTransitions: (c:{on:boolean})=> `Omitir transiciones: ${c.on? 'Sí':'No'}`,
    clearSeen: ()=> 'Limpiar vistos',
    language: ()=> 'Idioma',
    english: ()=> 'Inglés',
    spanish: ()=> 'Español',
    slots: ()=> 'Ranuras:',
    saveN: (c:{n:number})=> `Guardar ${c.n}`,
    loadN: (c:{n:number})=> `Cargar ${c.n}`,
  }
}
function t(key: string, ctx?: any){ const fn = STRINGS[prefs.locale][key]; return fn ? fn(ctx) : key }

function loadBacklog(){
  try { const raw = localStorage.getItem(BACKLOG_KEY); backlog = raw ? JSON.parse(raw) : [] } catch { backlog = [] }
}
function saveBacklog(){
  try { localStorage.setItem(BACKLOG_KEY, JSON.stringify(backlog)) } catch {}
}
function loadPrefs(){
  const defaults: Prefs = { skipSeenText: false, skipTransitions: false, locale: 'en' }
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if(!raw){ prefs = defaults; return }
    const parsed = JSON.parse(raw)
    prefs = { ...defaults, ...parsed }
  } catch { prefs = defaults }
}
function savePrefs(){
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)) } catch {}
}
function loadSeen(){
  try { const raw = localStorage.getItem(SEEN_KEY); const arr: string[] = raw ? JSON.parse(raw) : []; seenLines = new Set(arr) } catch { seenLines = new Set() }
}
function saveSeen(){
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seenLines))) } catch {}
}
function renderBacklog(){
  backlogList.innerHTML = ''
  if(backlog.length===0){
    const p = document.createElement('div')
    p.style.color = '#a8b0ff'
    p.style.fontSize = '12px'
    p.textContent = 'No dialogue yet.'
    backlogList.appendChild(p)
    return
  }
  for(const entry of backlog){
    const row = document.createElement('div')
    row.style.background = '#111827'
    row.style.border = '1px solid #27304a'
    row.style.borderRadius = '6px'
    row.style.padding = '6px 8px'
    const who = entry.char ? `${entry.char}: ` : ''
    row.textContent = who + entry.text
    row.style.color = '#a8b0ff'
    row.style.fontSize = '12px'
    backlogList.appendChild(row)
  }
}

function renderGallery(){
  const items = gallery.list()
  galleryGrid.innerHTML = ''
  if(items.length === 0){
    const p = document.createElement('div')
    p.style.color = '#a8b0ff'
    p.style.fontSize = '12px'
    p.textContent = 'No CGs unlocked yet.'
    galleryGrid.appendChild(p)
    return
  }
  for(const it of items){
    const card = document.createElement('div')
    card.style.background = '#111827'
    card.style.border = '1px solid #27304a'
    card.style.borderRadius = '6px'
    card.style.overflow = 'hidden'
    const img = document.createElement('img')
    img.src = `/${it.src}`
    img.alt = it.title || it.id
    img.style.width = '100%'
    img.style.display = 'block'
    const cap = document.createElement('div')
    cap.style.padding = '6px 8px'
    cap.style.color = '#a8b0ff'
    cap.style.fontSize = '12px'
    cap.textContent = it.title || it.id
    card.appendChild(img)
    card.appendChild(cap)
    galleryGrid.appendChild(card)
  }
}

function renderAchievements(){
  const items = achievements.list()
  achList.innerHTML = ''
  if(items.length===0){
    const p = document.createElement('div')
    p.style.color = '#a8b0ff'
    p.style.fontSize = '12px'
    p.textContent = 'No achievements yet.'
    achList.appendChild(p)
    return
  }
  for(const it of items){
    const row = document.createElement('div')
    row.style.display = 'flex'
    row.style.justifyContent = 'space-between'
    row.style.alignItems = 'center'
    row.style.background = '#111827'
    row.style.border = '1px solid #27304a'
    row.style.borderRadius = '6px'
    row.style.padding = '6px 8px'
    const left = document.createElement('div')
    left.style.color = '#a8b0ff'
    left.style.fontSize = '12px'
    left.textContent = it.title || it.id
    const right = document.createElement('div')
    right.style.color = '#7082c1'
    right.style.fontSize = '11px'
    right.textContent = new Date(it.unlockedAt).toLocaleString()
    row.appendChild(left)
    row.appendChild(right)
    achList.appendChild(row)
  }
}

// Codex utility (template-side)
type CodexEntry = { id: string; title: string; body: string; category: string; unlockedAt: string }
function readCodex(): CodexEntry[]{ try { return JSON.parse(localStorage.getItem(CODEX_KEY) || '[]') } catch { return [] } }
function writeCodex(list: CodexEntry[]){ try { localStorage.setItem(CODEX_KEY, JSON.stringify(list)) } catch {} }
function codexHas(id: string){ return readCodex().some(e => e.id === id) }
function codexUnlock(id: string){
  const meta = CODEX_META[id]
  if(!meta) return
  const list = readCodex()
  if(list.some(e => e.id === id)) return
  list.push({ id, title: meta.title, body: meta.body, category: meta.category, unlockedAt: new Date().toISOString() })
  writeCodex(list)
}
function renderCodex(){
  codexList.innerHTML = ''
  const q = (document.getElementById('codexSearch') as HTMLInputElement)?.value?.toLowerCase() || ''
  const items = readCodex().filter(it => !q || it.title.toLowerCase().includes(q) || it.body.toLowerCase().includes(q) || it.category.toLowerCase().includes(q))
  if(items.length===0){
    const p = document.createElement('div')
    p.style.color = '#a8b0ff'; p.style.fontSize = '12px'; p.textContent = 'No codex entries yet.'
    codexList.appendChild(p)
    return
  }
  // Group by category
  const groups: Record<string, CodexEntry[]> = {}
  for(const it of items){ (groups[it.category] ||= []).push(it) }
  const cats = Object.keys(groups).sort()
  for(const cat of cats){
    const header = document.createElement('div')
    header.style.color = '#a0e7ff'; header.style.fontWeight = '600'; header.style.margin = '6px 0 2px'; header.textContent = cat
    codexList.appendChild(header)
    for(const it of groups[cat]){
    const row = document.createElement('div')
    row.style.background = '#111827'; row.style.border = '1px solid #27304a'; row.style.borderRadius = '6px'; row.style.padding = '6px 8px'
    const title = document.createElement('div')
    title.style.color = '#a0e7ff'; title.style.fontSize = '13px'; title.style.fontWeight = '600'
    title.textContent = it.title
    const body = document.createElement('div')
    body.style.color = '#a8b0ff'; body.style.fontSize = '12px'; body.textContent = it.body
    const time = document.createElement('div')
    time.style.color = '#7082c1'; time.style.fontSize = '11px'; time.textContent = new Date(it.unlockedAt).toLocaleString()
    row.appendChild(title); row.appendChild(body); row.appendChild(time)
    codexList.appendChild(row)
    }
  }
}

async function boot(scenePath: string, startSceneId: string = 'intro'){
  const { scenes, errors } = await loadScenesFromUrl(scenePath)
  if(errors.length){
    textEl.textContent = 'Failed to load scenes: '+errors.join(', ')
    return
  }
  // Preload assets with simple progress UI
  const manifest = buildPreloadManifest(scenes)
  textEl.textContent = 'Loading assets...'
  await preloadAssets(manifest, (p)=>{
    textEl.textContent = `Loading assets (${p.loaded}/${p.total})`
  })
  // Optional authoring helper: roles mapping per scene to sprite IDs
  const remappedScenes = (scenes as any[]).map(s => {
    const roles = (s as any).roles as Record<string,string> | undefined
    if(!roles) return s
    const copy = JSON.parse(JSON.stringify(s))
    copy.steps = (copy.steps||[]).map((st:any)=>{
      if(st && typeof st === 'object' && (st.type==='spriteShow' || st.type==='spriteSwap' || st.type==='spriteHide')){
        const role = st.role as string | undefined
        if(role && roles[role]){ st.id = roles[role] }
        delete st.role
      }
      return st
    })
    return copy
  })
  engine.loadScenes(remappedScenes as any)
  // Extract per-scene sprite defaults (optional authoring ergonomics)
  try {
    sceneSpriteDefaults as any
    for(const s of scenes as any[]){
      const sid = s.id as string
      const defs = (s as any).spriteDefaults as Record<string, SpriteCfg> | undefined
      if(sid && defs && typeof defs === 'object'){
        sceneSpriteDefaults[sid] = { ...defs }
      }
    }
  } catch {}
  loadBacklog()
  loadPrefs()
  loadSeen()
  // Apply preferences that affect runtime
  skipFx = !!prefs.skipTransitions
  // Show Continue if autosave exists
  const ts = localStorage.getItem('aurora:minimal:autosave:ts')
  if(ts){
    continueBtn.style.display = 'inline-block'
    continueBtn.textContent = `Continue (saved ${new Date(parseInt(ts)).toLocaleString()})`
  } else {
    continueBtn.style.display = 'none'
  }
  engine.start(startSceneId)
  // Load slot thumbnails if present
  refreshSlotThumb(1)
  refreshSlotThumb(2)
  refreshSlotThumb(3)
}

on('vn:step', ({ step, state }) => {
  // Update sprite metadata if step carries positioning hints
  try {
    if(step && (step.type === 'spriteShow' || step.type === 'spriteSwap')){
      const id = (step as any).id as string
      if(id){
        const pos = (step as any).pos as ('left'|'center'|'right'|undefined)
        const z = typeof (step as any).z === 'number' ? (step as any).z as number : undefined
        const x = typeof (step as any).x === 'number' ? (step as any).x as number : undefined
        const scale = typeof (step as any).scale === 'number' ? (step as any).scale as number : undefined
        const cur = spriteMeta[id] || {}
        if(pos) cur.pos = pos
        if(z !== undefined) cur.z = z
        if(x !== undefined) cur.x = x
        if(scale !== undefined) cur.scale = scale
        spriteMeta[id] = cur
      }
    }
    if(step && step.type === 'spriteHide'){
      const id = (step as any).id as string
      if(id) delete spriteMeta[id]
    }
  } catch {}
  // Skip Seen Text: if enabled, fast-forward previously seen dialogue lines
  try {
    if (prefs.skipSeenText && step && step.type === 'dialogue' && state.sceneId != null) {
      const k = `${state.sceneId}:${state.index}`
      if (seenLines.has(k)) { engine.next(); return }
    }
  } catch {}
  // background label (we don't actually load images in this minimal demo)
  bgLabel.textContent = state.bg ? `Background: ${state.bg}` : ''
  // Render background image
  bgEl.style.backgroundImage = state.bg ? `url(/${state.bg})` : ''
  // Render sprites as positioned images with reconciliation and transitions
  ;(window as any)._spriteEls = (window as any)._spriteEls || {}
  const spriteEls: Record<string, HTMLImageElement> = (window as any)._spriteEls
  const current = new Set(Object.keys(state.sprites || {}))
  // Remove missing with fade-out
  for(const id of Object.keys(spriteEls)){
    if(!current.has(id)){
      const img = spriteEls[id]
      img.style.transition = 'opacity 200ms ease, transform 200ms ease'
      img.style.opacity = '0'
      setTimeout(()=>{ try{ img.remove() }catch{}; delete spriteEls[id] }, 220)
    }
  }
  // Add/update
  for(const [id, src] of Object.entries(state.sprites || {})){
    const sceneId = state.sceneId || ''
    const global = (sceneSpriteDefaults[sceneId] || {})[id] || {}
    const meta = { ...global, ...(spriteMeta[id] || {}) }
    const pos = meta.pos || 'center'
    const leftPct = typeof meta.x === 'number' ? Math.max(0, Math.min(100, meta.x)) : (pos === 'left' ? 20 : pos === 'right' ? 80 : 50)
    const scale = typeof meta.scale === 'number' ? meta.scale : 1
    let img = spriteEls[id]
    const existed = !!img
    if(!img){
      img = document.createElement('img')
      img.style.position = 'absolute'
      img.style.bottom = '0'
      img.style.maxHeight = '60vh'
      img.style.objectFit = 'contain'
      img.style.filter = 'drop-shadow(0 6px 10px rgba(0,0,0,.6))'
      img.style.transform = 'translateX(-50%) scale(1)'
      img.style.opacity = '0'
      img.style.transition = 'opacity 200ms ease, transform 200ms ease'
      img.alt = id
      spriteEls[id] = img
      spritesEl.appendChild(img)
      requestAnimationFrame(()=>{ img!.style.opacity = '1' })
    }
    // Crossfade on src change
    if(img.src !== `${location.origin}/${src}`){
      img.style.opacity = '0'
      setTimeout(()=>{ img!.src = `/${src}`; img!.style.opacity = '1' }, 120)
    }
    // Positioning and depth scaling
    img.style.left = leftPct + '%'
    img.style.transform = `translateX(-50%) scale(${scale})`
    const prevZ = Number(img.style.zIndex || '0')
    const nextZ = typeof meta.z === 'number' ? meta.z : prevZ
    if(nextZ !== prevZ){
      // Animate scale briefly to suggest depth change, then swap z-index
      img.style.transform = `translateX(-50%) scale(${scale * 1.03})`
      setTimeout(()=>{ img!.style.zIndex = String(nextZ); img!.style.transform = `translateX(-50%) scale(${scale})` }, 180)
    } else {
      if(typeof meta.z === 'number') img.style.zIndex = String(meta.z)
    }
    if(!existed && !img.src){ img.src = `/${src}` }
  }
  // clear UI
  nameEl.textContent = ''
  textEl.textContent = ''
  choicesEl.innerHTML = ''
  nextBtn.style.display = 'inline-block'

  if(!step){
    textEl.textContent = 'End of scene.'
    nextBtn.style.display = 'none'
    return
  }

  if(step.type === 'dialogue'){
    if(step.char){ nameEl.textContent = step.char+': ' }
    textEl.textContent = step.text
    // Mark as seen after showing
    try {
      if (state.sceneId != null) {
        const k2 = `${state.sceneId}:${state.index}`
        if (!seenLines.has(k2)) { seenLines.add(k2); saveSeen() }
      }
    } catch {}
    // Append to backlog (cap to 200 entries)
    backlog.push({ char: step.char, text: step.text })
    if(backlog.length > 200) backlog.shift()
    saveBacklog()
  } else if(step.type === 'choice'){
    nextBtn.style.display = 'none'
    step.options.forEach((opt, idx) => {
      const b = document.createElement('button')
      b.textContent = opt.label
      b.onclick = () => engine.choose(idx)
      choicesEl.appendChild(b)
    })
  } else {
    // auto-advance steps are handled by engine.next() calls triggered via user Next
    textEl.textContent = `${step.type}`
  }
  // Autosave after every step render
  try{
    const snap = engine.snapshot()
    localStorage.setItem('aurora:minimal:autosave', JSON.stringify(snap))
    localStorage.setItem('aurora:minimal:autosave:ts', String(Date.now()))
  }catch{}

  // Demo: unlock a CG when the scene sets a specific flag
  try{
    if(engine.hasFlag('cg_intro') && !gallery.has('cg_intro')){
      gallery.unlock('cg_intro', 'cgs/cg1.svg', { title: 'Intro CG' })
      if(galleryPanel.style.display !== 'none') renderGallery()
    }
    if(engine.hasFlag('cg_intro') && !achievements.has('ach_first_cg')){
      achievements.unlock('ach_first_cg', { title: 'First CG Unlocked' })
      if(achPanel.style.display !== 'none') renderAchievements()
    }
    if(engine.hasFlag('codex_hero') && !codexHas('codex_hero')){
      codexUnlock('codex_hero')
      if(codexPanel.style.display !== 'none') renderCodex()
    }
    if(engine.hasFlag('codex_lab') && !codexHas('codex_lab')){
      codexUnlock('codex_lab')
      if(codexPanel.style.display !== 'none') renderCodex()
    }
  }catch{}
})

// Visualize transitions with simple CSS effects
on('vn:transition', (e:any)=>{
  if(skipFx) return
  const kind = e.kind as string
  const duration = Number(e.duration || 300)
  // Clear any existing animations
  fxEl.className = ''
  ;(document.getElementById('stage') as HTMLElement).classList.remove('fx-shake','fx-zoom')
  // Apply effect
  if(kind === 'fade'){
    fxEl.classList.add('fx-fade')
    ;(fxEl as HTMLElement).style.animationDuration = `${duration}ms`
  } else if(kind === 'flash'){
    fxEl.classList.add('fx-flash')
    ;(fxEl as HTMLElement).style.animationDuration = `${duration}ms`
  } else if(kind === 'shake'){
    const stage = document.getElementById('stage') as HTMLElement
    stage.classList.add('fx-shake')
    stage.style.animationDuration = `${duration}ms`
    setTimeout(()=> stage.classList.remove('fx-shake'), duration)
  } else if(kind === 'zoom'){
    const stage = document.getElementById('stage') as HTMLElement
    stage.classList.add('fx-zoom')
    stage.style.animationDuration = `${duration}ms`
    setTimeout(()=> stage.classList.remove('fx-zoom'), duration)
  }
  // Cleanup overlay after effect
  if(kind==='fade' || kind==='flash'){
    setTimeout(()=>{ fxEl.className = ''; (fxEl as HTMLElement).style.animationDuration = '' }, duration)
  }
})

// Debug: surface new engine events as ephemeral toasts
on('vn:auto-choice', (d:any)=>{
  try{
    const msg = `[auto-choice] ${d.strategy||'auto'} -> #${d.chosenIndex} "${d.chosenLabel}" (${d.validOptions}/${d.options})`
    showToast(msg)
  }catch{}
})
on('vn:auto-loop-guard', (d:any)=>{
  try{
    const msg = `[auto-loop-guard] steps=${d.steps} max=${d.max}`
    showToast(msg)
  }catch{}
})

function showToast(message: string){
  try{
    const host = notifications || document.body
    const div = document.createElement('div')
    div.textContent = message
    div.style.position = notifications? 'relative' : 'fixed'
    if(!notifications){ div.style.right = '12px'; div.style.bottom = '12px' }
    div.style.background = '#0f172a'
    div.style.border = '1px solid #1e293b'
    div.style.color = '#a0e7ff'
    div.style.padding = '6px 8px'
    div.style.marginTop = '6px'
    div.style.borderRadius = '6px'
    div.style.fontSize = '12px'
    div.style.boxShadow = '0 6px 14px rgba(0,0,0,.5)'
    host.appendChild(div)
    setTimeout(()=>{ try{ div.remove() }catch{} }, 3000)
  }catch{}
}

nextBtn.onclick = () => engine.next()

const SAVE_KEY = 'aurora:minimal:quicksave'
saveBtn.onclick = () => {
  const snap = engine.snapshot()
  try{
    localStorage.setItem(SAVE_KEY, JSON.stringify(snap))
    saveStatus.textContent = 'Saved'
  }catch{
    saveStatus.textContent = 'Save failed (storage)'
  }
}
loadBtn.onclick = () => {
  try{
    const raw = localStorage.getItem(SAVE_KEY)
    if(!raw){ saveStatus.textContent = 'No save found'; return }
    engine.restore(JSON.parse(raw))
    saveStatus.textContent = 'Loaded'
  }catch{
    saveStatus.textContent = 'Load failed'
  }
}

continueBtn.onclick = () => {
  try{
    const raw = localStorage.getItem('aurora:minimal:autosave')
    if(!raw){ saveStatus.textContent = 'No autosave'; return }
    engine.restore(JSON.parse(raw))
    saveStatus.textContent = 'Continued'
  }catch{ saveStatus.textContent = 'Continue failed' }
}

function saveToSlot(n: number){
  const key = `aurora:minimal:slot${n}`
  try{
    const snap = engine.snapshot()
    localStorage.setItem(key, JSON.stringify(snap))
    localStorage.setItem(`${key}:ts`, String(Date.now()))
    // Generate and store a thumbnail
    captureThumbnail(engine.getPublicState()).then(url=>{ try { if(url) localStorage.setItem(`${key}:thumb`, url); refreshSlotThumb(n) } catch {} })
    slotStatus.textContent = `Saved to ${n}`
  }catch{ slotStatus.textContent = `Save ${n} failed` }
}
function loadFromSlot(n: number){
  const key = `aurora:minimal:slot${n}`
  try{
    const raw = localStorage.getItem(key)
    if(!raw){ slotStatus.textContent = `No save ${n}`; return }
    engine.restore(JSON.parse(raw))
    const ts = localStorage.getItem(`${key}:ts`)
    slotStatus.textContent = ts ? `Loaded ${n} (${new Date(parseInt(ts)).toLocaleString()})` : `Loaded ${n}`
  }catch{ slotStatus.textContent = `Load ${n} failed` }
}
slot1save.onclick = ()=> saveToSlot(1)
slot1load.onclick = ()=> loadFromSlot(1)
slot2save.onclick = ()=> saveToSlot(2)
slot2load.onclick = ()=> loadFromSlot(2)
slot3save.onclick = ()=> saveToSlot(3)
slot3load.onclick = ()=> loadFromSlot(3)

async function captureThumbnail(state: ReturnType<typeof engine.getPublicState>): Promise<string|null>{
  try{
    const W = 320, H = 180
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#0b1020'; ctx.fillRect(0,0,W,H)
    // Draw background
    if(state.bg){
      const bg = await loadImage(`/${state.bg}`)
      const scale = Math.max(W/bg.width, H/bg.height)
      const dw = Math.floor(bg.width*scale), dh = Math.floor(bg.height*scale)
      const dx = Math.floor((W-dw)/2), dy = Math.floor((H-dh)/2)
      ctx.drawImage(bg, dx, dy, dw, dh)
    }
    // Draw sprites
    const entries = Object.entries(state.sprites||{})
    const count = entries.length
    if(count){
      const pad = 8
      const slotW = Math.floor((W - pad*(count+1)) / Math.max(1,count))
      let i=0
      for(const [, src] of entries){
        const img = await loadImage(`/${src}`)
        const targetW = Math.min(slotW, Math.floor(W/3))
        const scale = targetW / img.width
        const dw = Math.floor(img.width*scale)
        const dh = Math.floor(img.height*scale)
        const x = pad + i*(slotW+pad) + Math.floor((slotW - dw)/2)
        const y = H - dh - 8
        ctx.drawImage(img, x, y, dw, dh)
        i++
      }
    }
    return canvas.toDataURL('image/png')
  }catch{ return null }
}

function loadImage(src: string): Promise<HTMLImageElement>{
  return new Promise((resolve, reject)=>{
    const img = new Image()
    img.onload = ()=> resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function refreshSlotThumb(n: number){
  const key = `aurora:minimal:slot${n}:thumb`
  const img = n===1 ? slot1thumb : n===2 ? slot2thumb : slot3thumb
  try{ const url = localStorage.getItem(key); img.src = url || '' }catch{ img.src = '' }
}

// Initial boot with example scenes
boot('/scenes/example.json', 'intro')

// Allow switching demos on demand
startExampleBtn.onclick = () => boot('/scenes/example.json', 'intro')
startExpressionsBtn.onclick = () => boot('/scenes/expressions.json', 'intro')

openGalleryBtn.onclick = () => { renderGallery(); galleryPanel.style.display = 'block' }
closeGalleryBtn.onclick = () => { galleryPanel.style.display = 'none' }
openAchBtn.onclick = () => { renderAchievements(); achPanel.style.display = 'block' }
closeAchBtn.onclick = () => { achPanel.style.display = 'none' }
openCodexBtn.onclick = () => { renderCodex(); codexPanel.style.display = 'block' }
closeCodexBtn.onclick = () => { codexPanel.style.display = 'none' }
;(document.getElementById('codexSearch') as HTMLInputElement).addEventListener('input', ()=> renderCodex())
openBacklogBtn.onclick = () => { renderBacklog(); backlogPanel.style.display = 'block' }
closeBacklogBtn.onclick = () => { backlogPanel.style.display = 'none' }
openSettingsBtn.onclick = () => { refreshSettingsUI(); settingsPanel.style.display = 'block' }
closeSettingsBtn.onclick = () => { settingsPanel.style.display = 'none' }
function refreshSettingsUI(){
  toggleSkipSeenBtn.textContent = t('skipSeen', { on: prefs.skipSeenText })
  toggleSkipTransitionsBtn.textContent = t('skipTransitions', { on: prefs.skipTransitions })
  ;(document.getElementById('settingsTitle') as HTMLElement).textContent = t('settings')
  ;(document.getElementById('closeSettings') as HTMLButtonElement).textContent = t('close')
  ;(document.getElementById('langLabel') as HTMLElement).textContent = t('language')
  langEnBtn.textContent = t('english')
  langEsBtn.textContent = t('spanish')
}
toggleSkipSeenBtn.onclick = () => { prefs.skipSeenText = !prefs.skipSeenText; savePrefs(); refreshSettingsUI() }
toggleSkipTransitionsBtn.onclick = () => { prefs.skipTransitions = !prefs.skipTransitions; skipFx = prefs.skipTransitions; savePrefs(); refreshSettingsUI(); refreshSkipFx() }
clearSeenBtn.onclick = () => { seenLines = new Set(); saveSeen(); }
langEnBtn.onclick = () => { prefs.locale = 'en'; savePrefs(); refreshSettingsUI(); refreshAutoButtons(); refreshSkipFx() }
langEsBtn.onclick = () => { prefs.locale = 'es'; savePrefs(); refreshSettingsUI(); refreshAutoButtons(); refreshSkipFx() }

openSavesBtn.onclick = () => { renderSaves(); savesPanel.style.display = 'block' }
closeSavesBtn.onclick = () => { savesPanel.style.display = 'none' }
function renderSaves(){
  savesList.innerHTML = ''
  for(let n=1;n<=3;n++){
    const row = document.createElement('div')
    row.style.display = 'flex'
    row.style.alignItems = 'center'
    row.style.gap = '8px'
    row.style.background = '#111827'
    row.style.border = '1px solid #27304a'
    row.style.borderRadius = '6px'
    row.style.padding = '6px 8px'
    const img = document.createElement('img')
    img.style.width = '96px'; img.style.height = '54px'; img.style.objectFit = 'cover'; img.style.borderRadius = '4px'; img.style.border = '1px solid #27304a'
    const key = `aurora:minimal:slot${n}`
    try { img.src = localStorage.getItem(`${key}:thumb`) || '' } catch { img.src = '' }
    const meta = document.createElement('div')
    meta.style.flex = '1'
    meta.style.color = '#a8b0ff'
    meta.style.fontSize = '12px'
    const ts = localStorage.getItem(`${key}:ts`)
    meta.textContent = ts ? new Date(parseInt(ts)).toLocaleString() : '—'
    const actions = document.createElement('div')
    const saveB = document.createElement('button')
    saveB.className = 'secondary'
    saveB.textContent = t('saveN', { n })
    saveB.onclick = ()=>{ saveToSlot(n); setTimeout(()=> renderSaves(), 50) }
    const loadB = document.createElement('button')
    loadB.className = 'secondary'
    loadB.textContent = t('loadN', { n })
    loadB.onclick = ()=> loadFromSlot(n)
    actions.appendChild(saveB)
    actions.appendChild(loadB)
    row.appendChild(img)
    row.appendChild(meta)
    row.appendChild(actions)
    savesList.appendChild(row)
  }
}

function refreshAutoButtons(){
  autoBtn.textContent = t('auto', { on: engine.isAutoAdvance() })
  autoChooseBtn.textContent = t('autoChoose', { on: engine.isAutoDecide() })
}

autoBtn.onclick = () => { engine.setAutoAdvance(!engine.isAutoAdvance()); refreshAutoButtons() }
autoChooseBtn.onclick = () => { engine.setAutoDecide(!engine.isAutoDecide()); refreshAutoButtons() }
refreshAutoButtons()

function refreshSkipFx(){ skipFxBtn.textContent = t('skipFx', { on: skipFx }) }
skipFxBtn.onclick = () => { skipFx = !skipFx; prefs.skipTransitions = skipFx; savePrefs(); refreshSkipFx(); refreshSettingsUI() }
refreshSkipFx()

function updateMusicStatus(){
  const track = engine.getPublicState().music
  musicStatus.textContent = track ? `${track} — ${isPlaying? 'Playing':'Paused'}` : 'No track'
}
on('music:track-change', ()=> { /* engine updates track */ updateMusicStatus() })
on('music:play', ()=> { isPlaying = true; updateMusicStatus() })
on('music:pause', ()=> { isPlaying = false; updateMusicStatus() })

musicPlayBtn.onclick = () => {
  const track = engine.getPublicState().music || 'demo-track'
  Jukebox.play(track, track)
}
musicPauseBtn.onclick = () => { Jukebox.pause() }
