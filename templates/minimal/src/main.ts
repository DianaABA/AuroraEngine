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
const bgLabel = document.getElementById('bgLabel')!
const bgEl = document.getElementById('bg') as HTMLDivElement
const spritesEl = document.getElementById('sprites') as HTMLDivElement
const fxEl = document.getElementById('fx')!
const openGalleryBtn = document.getElementById('openGallery') as HTMLButtonElement
const closeGalleryBtn = document.getElementById('closeGallery') as HTMLButtonElement
const galleryPanel = document.getElementById('galleryPanel') as HTMLDivElement
const galleryGrid = document.getElementById('galleryGrid') as HTMLDivElement
const openAchBtn = document.getElementById('openAch') as HTMLButtonElement
const closeAchBtn = document.getElementById('closeAch') as HTMLButtonElement
const achPanel = document.getElementById('achPanel') as HTMLDivElement
const achList = document.getElementById('achList') as HTMLDivElement
const openSettingsBtn = document.getElementById('openSettings') as HTMLButtonElement
const closeSettingsBtn = document.getElementById('closeSettings') as HTMLButtonElement
const settingsPanel = document.getElementById('settingsPanel') as HTMLDivElement
const toggleSkipSeenBtn = document.getElementById('toggleSkipSeen') as HTMLButtonElement
const clearSeenBtn = document.getElementById('clearSeen') as HTMLButtonElement
const openBacklogBtn = document.getElementById('openBacklog') as HTMLButtonElement
const closeBacklogBtn = document.getElementById('closeBacklog') as HTMLButtonElement
const backlogPanel = document.getElementById('backlogPanel') as HTMLDivElement
const backlogList = document.getElementById('backlogList') as HTMLDivElement
const musicPlayBtn = document.getElementById('musicPlay') as HTMLButtonElement
const musicPauseBtn = document.getElementById('musicPause') as HTMLButtonElement
const musicStatus = document.getElementById('musicStatus') as HTMLSpanElement

const engine = createEngine({ autoEmit: true })
const gallery = new Gallery('aurora:minimal:gallery')
const achievements = new Achievements('aurora:minimal:ach')
let isPlaying = false
let skipFx = false
let backlog: { char?: string; text: string }[] = []
const BACKLOG_KEY = 'aurora:minimal:backlog'
type Prefs = { skipSeenText: boolean }
let prefs: Prefs = { skipSeenText: false }
const PREFS_KEY = 'aurora:minimal:prefs'
let seenLines = new Set<string>()
const SEEN_KEY = 'aurora:minimal:seen'

function loadBacklog(){
  try { const raw = localStorage.getItem(BACKLOG_KEY); backlog = raw ? JSON.parse(raw) : [] } catch { backlog = [] }
}
function saveBacklog(){
  try { localStorage.setItem(BACKLOG_KEY, JSON.stringify(backlog)) } catch {}
}
function loadPrefs(){
  try { const raw = localStorage.getItem(PREFS_KEY); prefs = raw ? JSON.parse(raw) : { skipSeenText: false } } catch { prefs = { skipSeenText: false } }
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
  engine.loadScenes(scenes)
  loadBacklog()
  loadPrefs()
  loadSeen()
  // Show Continue if autosave exists
  const ts = localStorage.getItem('aurora:minimal:autosave:ts')
  if(ts){
    continueBtn.style.display = 'inline-block'
    continueBtn.textContent = `Continue (saved ${new Date(parseInt(ts)).toLocaleString()})`
  } else {
    continueBtn.style.display = 'none'
  }
  engine.start(startSceneId)
}

on('vn:step', ({ step, state }) => {
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
  // Render sprites as images
  spritesEl.innerHTML = ''
  const entries = Object.entries(state.sprites || {})
  for(const [id, src] of entries){
    const img = document.createElement('img')
    img.src = `/${src}`
    img.alt = id
    spritesEl.appendChild(img)
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
    localStorage.setItem(key, JSON.stringify(engine.snapshot()))
    localStorage.setItem(`${key}:ts`, String(Date.now()))
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

// Initial boot with example scenes
boot('/scenes/example.json', 'intro')

// Allow switching demos on demand
startExampleBtn.onclick = () => boot('/scenes/example.json', 'intro')
startExpressionsBtn.onclick = () => boot('/scenes/expressions.json', 'intro')

openGalleryBtn.onclick = () => { renderGallery(); galleryPanel.style.display = 'block' }
closeGalleryBtn.onclick = () => { galleryPanel.style.display = 'none' }
openAchBtn.onclick = () => { renderAchievements(); achPanel.style.display = 'block' }
closeAchBtn.onclick = () => { achPanel.style.display = 'none' }
openBacklogBtn.onclick = () => { renderBacklog(); backlogPanel.style.display = 'block' }
closeBacklogBtn.onclick = () => { backlogPanel.style.display = 'none' }
openSettingsBtn.onclick = () => { refreshSettingsUI(); settingsPanel.style.display = 'block' }
closeSettingsBtn.onclick = () => { settingsPanel.style.display = 'none' }
function refreshSettingsUI(){ toggleSkipSeenBtn.textContent = `Skip Seen Text: ${prefs.skipSeenText ? 'On' : 'Off'}` }
toggleSkipSeenBtn.onclick = () => { prefs.skipSeenText = !prefs.skipSeenText; savePrefs(); refreshSettingsUI() }
clearSeenBtn.onclick = () => { seenLines = new Set(); saveSeen(); }

function refreshAutoButtons(){
  autoBtn.textContent = `Auto: ${engine.isAutoAdvance()? 'On':'Off'}`
  autoChooseBtn.textContent = `Auto-Choose: ${engine.isAutoDecide()? 'On':'Off'}`
}

autoBtn.onclick = () => { engine.setAutoAdvance(!engine.isAutoAdvance()); refreshAutoButtons() }
autoChooseBtn.onclick = () => { engine.setAutoDecide(!engine.isAutoDecide()); refreshAutoButtons() }
refreshAutoButtons()

function refreshSkipFx(){ skipFxBtn.textContent = `Skip FX: ${skipFx? 'On':'Off'}` }
skipFxBtn.onclick = () => { skipFx = !skipFx; refreshSkipFx() }
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
