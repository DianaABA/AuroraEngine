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
const fxEl = document.getElementById('fx')!
const openGalleryBtn = document.getElementById('openGallery') as HTMLButtonElement
const closeGalleryBtn = document.getElementById('closeGallery') as HTMLButtonElement
const galleryPanel = document.getElementById('galleryPanel') as HTMLDivElement
const galleryGrid = document.getElementById('galleryGrid') as HTMLDivElement
const openAchBtn = document.getElementById('openAch') as HTMLButtonElement
const closeAchBtn = document.getElementById('closeAch') as HTMLButtonElement
const achPanel = document.getElementById('achPanel') as HTMLDivElement
const achList = document.getElementById('achList') as HTMLDivElement
const musicPlayBtn = document.getElementById('musicPlay') as HTMLButtonElement
const musicPauseBtn = document.getElementById('musicPause') as HTMLButtonElement
const musicStatus = document.getElementById('musicStatus') as HTMLSpanElement

const engine = createEngine({ autoEmit: true })
const gallery = new Gallery('aurora:minimal:gallery')
const achievements = new Achievements('aurora:minimal:ach')
let isPlaying = false
let skipFx = false

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
  // background label (we don't actually load images in this minimal demo)
  bgLabel.textContent = state.bg ? `Background: ${state.bg}` : ''
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
