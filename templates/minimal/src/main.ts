import { createEngine, on, loadScenesFromUrl, buildPreloadManifest, preloadAssets } from 'aurora-engine'

const nameEl = document.getElementById('name')!
const textEl = document.getElementById('text')!
const choicesEl = document.getElementById('choices')!
const continueBtn = document.getElementById('continueBtn') as HTMLButtonElement
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

const engine = createEngine({ autoEmit: true })

async function boot(){
  const { scenes, errors } = await loadScenesFromUrl('/scenes/example.json')
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
  engine.start('intro')
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

boot()
