import { createEngine, on, loadScenesFromUrl, loadScenesFromJsonStrict, validateSceneLinksStrict, remapRoles, buildPreloadManifest, preloadAssets, Gallery, Achievements, Jukebox } from 'aurora-engine'
import { getAIAdapters } from '../../src/utils/aiModes'
import { computeBranchEdges } from './editorHelpers'
import { resolveYPercent } from './helpers'

const nameEl = document.getElementById('name')!
const textEl = document.getElementById('text')!
const choicesEl = document.getElementById('choices')!
const continueBtn = document.getElementById('continueBtn') as HTMLButtonElement
const startExampleBtn = document.getElementById('startExample') as HTMLButtonElement
const startExpressionsBtn = document.getElementById('startExpressions') as HTMLButtonElement
const startAchBtn = document.getElementById('startAch') as HTMLButtonElement | null
const packSelect = document.getElementById('packSelect') as HTMLSelectElement | null
const packLoadBtn = document.getElementById('loadPack') as HTMLButtonElement | null
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
const bgA = document.getElementById('bgA') as HTMLDivElement
const bgB = document.getElementById('bgB') as HTMLDivElement
const stageEl = document.getElementById('stage') as HTMLDivElement
const backdropEl = document.getElementById('backdrop') as HTMLDivElement
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
const codexCategory = document.getElementById('codexCategory') as HTMLSelectElement
const codexFilters = document.getElementById('codexFilters') as HTMLDivElement
const codexDetail = document.getElementById('codexDetail') as HTMLDivElement
const codexDetailTitle = document.getElementById('codexDetailTitle') as HTMLDivElement
const codexDetailBody = document.getElementById('codexDetailBody') as HTMLDivElement
const codexDetailClose = document.getElementById('codexDetailClose') as HTMLButtonElement
const codexFavBtn = document.getElementById('codexFavBtn') as HTMLButtonElement
const codexPinBtn = document.getElementById('codexPinBtn') as HTMLButtonElement
const openAchBtn = document.getElementById('openAch') as HTMLButtonElement
const closeAchBtn = document.getElementById('closeAch') as HTMLButtonElement
const achPanel = document.getElementById('achPanel') as HTMLDivElement
const achList = document.getElementById('achList') as HTMLDivElement
const openSettingsBtn = document.getElementById('openSettings') as HTMLButtonElement
const closeSettingsBtn = document.getElementById('closeSettings') as HTMLButtonElement
const settingsPanel = document.getElementById('settingsPanel') as HTMLDivElement
const toggleSkipSeenBtn = document.getElementById('toggleSkipSeen') as HTMLButtonElement
const toggleSkipTransitionsBtn = document.getElementById('toggleSkipTransitions') as HTMLButtonElement
const toggleDebugToastsBtn = document.getElementById('toggleDebugToasts') as HTMLButtonElement
const toggleDebugHudBtn = document.getElementById('toggleDebugHud') as HTMLButtonElement
const toggleHotkeysBtn = document.getElementById('toggleHotkeys') as HTMLButtonElement
const toggleThemeBtn = document.getElementById('toggleTheme') as HTMLButtonElement | null
const aiModeSelect = document.getElementById('aiModeSelect') as HTMLSelectElement | null
const aiProviderSelect = document.getElementById('aiProvider') as HTMLSelectElement | null
const aiModelInput = document.getElementById('aiModel') as HTMLInputElement | null
const aiBaseUrlInput = document.getElementById('aiBaseUrl') as HTMLInputElement | null
const aiLocalModelInput = document.getElementById('aiLocalModel') as HTMLInputElement | null
const aiApiKeyInput = document.getElementById('aiApiKey') as HTMLInputElement | null
const clearSeenBtn = document.getElementById('clearSeen') as HTMLButtonElement
const langEnBtn = document.getElementById('langEn') as HTMLButtonElement
const langEsBtn = document.getElementById('langEs') as HTMLButtonElement
const langArBtn = document.getElementById('langAr') as HTMLButtonElement
const openBacklogBtn = document.getElementById('openBacklog') as HTMLButtonElement
const closeBacklogBtn = document.getElementById('closeBacklog') as HTMLButtonElement
const backlogPanel = document.getElementById('backlogPanel') as HTMLDivElement
const backlogList = document.getElementById('backlogList') as HTMLDivElement
const openSavesBtn = document.getElementById('openSaves') as HTMLButtonElement
const closeSavesBtn = document.getElementById('closeSaves') as HTMLButtonElement
const savesPanel = document.getElementById('savesPanel') as HTMLDivElement
const savesList = document.getElementById('savesList') as HTMLDivElement
const openShortcutsBtn = document.getElementById('openShortcuts') as HTMLButtonElement
const bgFadeMsInput = document.getElementById('bgFadeMs') as HTMLInputElement
const spriteFadeMsInput = document.getElementById('spriteFadeMs') as HTMLInputElement
const bgFadeMsVal = document.getElementById('bgFadeMsVal') as HTMLSpanElement
const spriteFadeMsVal = document.getElementById('spriteFadeMsVal') as HTMLSpanElement
const onboardingEl = document.getElementById('onboarding') as HTMLDivElement
const onbDismissBtn = document.getElementById('onbDismiss') as HTMLButtonElement
const onbStartBtn = document.getElementById('onbStart') as HTMLButtonElement
const onbShortcutsBtn = document.getElementById('onbShortcuts') as HTMLButtonElement
const onbSettingsBtn = document.getElementById('onbSettings') as HTMLButtonElement
const musicPlayBtn = document.getElementById('musicPlay') as HTMLButtonElement
const musicPauseBtn = document.getElementById('musicPause') as HTMLButtonElement
const musicStatus = document.getElementById('musicStatus') as HTMLSpanElement
const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement
const muteToggle = document.getElementById('muteToggle') as HTMLButtonElement
const notifications = document.getElementById('notifications') as HTMLDivElement | null
const debugHud = document.getElementById('debugHud') as HTMLDivElement
const assetDrop = document.getElementById('assetDrop') as HTMLDivElement | null
const assetList = document.getElementById('assetList') as HTMLDivElement | null
const assetPick = document.getElementById('assetPick') as HTMLButtonElement | null
const customJsonInput = document.getElementById('customJson') as HTMLTextAreaElement | null
const customLoadBtn = document.getElementById('customLoadBtn') as HTMLButtonElement | null
const customFileBtn = document.getElementById('customFileBtn') as HTMLButtonElement | null
const customLintBtn = document.getElementById('customLint') as HTMLButtonElement | null
const aiPromptInput = document.getElementById('aiPrompt') as HTMLInputElement | null
const aiGenerateBtn = document.getElementById('aiGenerateBtn') as HTMLButtonElement | null
const aiGenerateToEditorBtn = document.getElementById('aiGenerateToEditorBtn') as HTMLButtonElement | null
const aiFixBtn = document.getElementById('aiFixBtn') as HTMLButtonElement | null
const aiStatus = document.getElementById('aiStatus') as HTMLSpanElement | null
const customErrors = document.getElementById('customErrors') as HTMLDivElement | null
const customStartIdInput = document.getElementById('customStartId') as HTMLInputElement | null
const editorSceneId = document.getElementById('editorSceneId') as HTMLInputElement | null
const editorBg = document.getElementById('editorBg') as HTMLInputElement | null
const editorMusic = document.getElementById('editorMusic') as HTMLInputElement | null
const editorSceneRoles = document.getElementById('editorSceneRoles') as HTMLInputElement | null
const editorBundleIds = document.getElementById('editorBundleIds') as HTMLInputElement | null
const editorTabs = document.getElementById('editorTabs') as HTMLDivElement | null
const editorNewSceneBtn = document.getElementById('editorNewScene') as HTMLButtonElement | null
const editorSaveBtn = document.getElementById('editorSave') as HTMLButtonElement | null
const editorLoadSavedBtn = document.getElementById('editorLoadSaved') as HTMLButtonElement | null
const editorStepType = document.getElementById('editorStepType') as HTMLSelectElement | null
const editorChar = document.getElementById('editorChar') as HTMLInputElement | null
const editorText = document.getElementById('editorText') as HTMLInputElement | null
const editorMove = document.getElementById('editorMove') as HTMLInputElement | null
const editorOptions = document.getElementById('editorOptions') as HTMLTextAreaElement | null
const editorAddStep = document.getElementById('editorAddStep') as HTMLButtonElement | null
const editorReset = document.getElementById('editorReset') as HTMLButtonElement | null
const editorLoad = document.getElementById('editorLoad') as HTMLButtonElement | null
const editorDownload = document.getElementById('editorDownload') as HTMLButtonElement | null
const editorImport = document.getElementById('editorImport') as HTMLButtonElement | null
const editorStepsEl = document.getElementById('editorSteps') as HTMLDivElement | null
const editorPreview = document.getElementById('editorPreview') as HTMLPreElement | null
const editorErrors = document.getElementById('editorErrors') as HTMLDivElement | null
const branchMap = document.getElementById('branchMapBody') as HTMLDivElement | null
const branchMapGraph = document.getElementById('branchMapGraph') as HTMLDivElement | null
const customLintBtn = document.getElementById('customLint') as HTMLButtonElement | null
const errorOverlay = document.getElementById('errorOverlay') as HTMLDivElement | null
const errorOverlayBody = document.getElementById('errorOverlayBody') as HTMLDivElement | null
const errorOverlayClose = document.getElementById('errorOverlayClose') as HTMLButtonElement | null
let errorOverlayOpen = false
import { computeBranchEdges } from './editorHelpers'

const engine = createEngine({ autoEmit: true })
const gallery = new Gallery('aurora:minimal:gallery')
const achievements = new Achievements('aurora:minimal:ach')
let isPlaying = false
let skipFx = false
let backlog: { char?: string; text: string }[] = []
type SpriteCfg = { pos?: 'left'|'center'|'right'; x?: number; y?: number; yPct?: number; z?: number; scale?: number }
const spriteMeta: Record<string, SpriteCfg> = {}
const sceneSpriteDefaults: Record<string, Record<string, SpriteCfg>> = {}
const BACKLOG_KEY = 'aurora:minimal:backlog'
// Removed old Prefs type; replaced below with extended Prefs
const CODEX_KEY = 'aurora:minimal:codex'
const CODEX_META: Record<string, { title: string; body: string; category: string }> = {
  codex_hero: { title: 'Hero', body: 'A mysterious protagonist with many expressions.', category: 'Characters' },
  codex_lab: { title: 'Laboratory', body: 'A clean, bright lab used in demonstrations.', category: 'Locations' }
}

const THEMES: Record<ThemeName, { bgTop: string; bgBottom: string; panelBg: string; panelBorder: string; accent: string; accent2: string; font: string }> = {
  night: { bgTop:'#151a2d', bgBottom:'#28314a', panelBg:'rgba(0,0,0,.5)', panelBorder:'#27304a', accent:'#3e59ff', accent2:'#2b2f43', font:'Inter, system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial' },
  sand: { bgTop:'#2c1e1a', bgBottom:'#8a6b4f', panelBg:'rgba(20,12,8,.55)', panelBorder:'#4a3527', accent:'#d89c4b', accent2:'#4a3527', font:'"Segoe UI", sans-serif' }
}
type Locale = 'en' | 'es'
type Locale = 'en' | 'es' | 'ar'
type ThemeName = 'night' | 'sand'
type Prefs = {
  skipSeenText: boolean; skipTransitions: boolean; showDebugToasts: boolean; showDebugHud: boolean; hotkeysEnabled: boolean;
  volume: number; muted: boolean; bgFadeMs: number; spriteFadeMs: number; locale: Locale; theme: ThemeName;
  aiMode?: 'local' | 'byok'; aiApiKey?: string; aiProvider?: string; aiModel?: string; aiBaseUrl?: string; aiLocalModel?: string
}
let prefs: Prefs = {
  skipSeenText: false, skipTransitions: false, showDebugToasts: false, showDebugHud: false, hotkeysEnabled: true,
  volume: 0.8, muted: false, bgFadeMs: 400, spriteFadeMs: 220, locale: 'en', theme: 'night',
  aiMode: 'local', aiApiKey: '', aiProvider: 'openai', aiModel: 'gpt-4o-mini', aiBaseUrl: '', aiLocalModel: 'Qwen2-0.5B-Instruct-q4f16_1-MLC'
}
// AI adapter cache & helpers (initialized on demand)
let _aiAdapters: Awaited<ReturnType<typeof getAIAdapters>> | null = null
let _aiModeCached: string | undefined
let _aiKeyCached: string | undefined
async function ensureAIAdapters(force = false) {
  const mode = prefs.aiMode || 'local'
  const key = prefs.aiApiKey || ''
  if(!_aiAdapters || force || mode !== _aiModeCached || key !== _aiKeyCached){
    try {
      _aiAdapters = await getAIAdapters(mode, key || undefined)
      _aiModeCached = mode; _aiKeyCached = key
    } catch(e){ console.warn('AI adapters init failed', e) }
  }
  return _aiAdapters
}
async function aiConvertScriptToJSON(script: string){ const ad = await ensureAIAdapters(); if(ad?.local) return ad.local.convertScriptToJSON(script); throw new Error('Local adapter unavailable') }
async function aiFixGrammar(text: string){ const ad = await ensureAIAdapters(); if(ad?.local) return ad.local.fixGrammar(text); throw new Error('Local adapter unavailable') }
async function aiDetectSceneErrors(json: string){ const ad = await ensureAIAdapters(); if(ad?.local) return ad.local.detectSceneErrors(json); throw new Error('Local adapter unavailable') }
async function aiGenerateScene(prompt: string){ const ad = await ensureAIAdapters(); if(ad?.remote) return ad.remote.generateScene(prompt); throw new Error('Remote adapter unavailable') }
async function aiExtendDialogue(scene: any, prompt: string){ const ad = await ensureAIAdapters(); if(ad?.remote) return ad.remote.extendDialogue(scene, prompt); throw new Error('Remote adapter unavailable') }
async function aiSuggestBranches(scene: any){ const ad = await ensureAIAdapters(); if(ad?.remote) return ad.remote.suggestBranches(scene); throw new Error('Remote adapter unavailable') }
const PREFS_KEY = 'aurora:minimal:prefs'
let seenLines = new Set<string>()
const SEEN_KEY = 'aurora:minimal:seen'
type AutoChoiceHint = { key: string; chosenIndex: number; chosenLabel: string; strategy?: string; willAutoDecide: boolean; options: number; validOptions: number }
let autoChoiceHint: AutoChoiceHint | null = null
let choiceButtons: HTMLButtonElement[] = []
let choiceFocusIndex = 0
type StepMeta = { sceneId: string; index: number; label: string }
let lastStepMeta: StepMeta | null = null
type CodexEntry = { id: string; title: string; body: string; category: string; unlockedAt: string; favorite?: boolean; pinned?: boolean }
type CodexFilters = { category: string; favoritesOnly: boolean; pinnedOnly: boolean }
let codexFiltersState: CodexFilters = { category: '', favoritesOnly: false, pinnedOnly: false }
let codexSelectedEntry: CodexEntry | null = null
type LocalAsset = { name: string; type: string; size: number; url: string }
let localAssets: LocalAsset[] = []
type MoveStep = { x?: number; y?: number; yPct?: number; ms?: number; ease?: string }
type EditorScene = { id: string; bg?: string; music?: string; steps: any[]; roles?: Record<string, any> }
let editorSteps: any[] = []
const TRANSITIONS = ['fade','slide','zoom','shake','flash']
const DEFAULT_SPRITE_MOVE: MoveStep = { ms: 250, ease: 'ease-in-out' }
const EDITOR_STATE_KEY = 'aurora:minimal:editorState'
let editorScenes: Record<string, EditorScene> = {}
let activeSceneId: string = 'custom'

function parseMove(input: string): MoveStep | null {
  if(!input) return null
  const parts = input.split(',').map(p=> p.trim()).filter(Boolean)
  if(!parts.length) return null
  const mv: MoveStep = { ...DEFAULT_SPRITE_MOVE }
  for(const p of parts){
    const [k,v] = p.split('=').map(s=> (s||'').trim())
    if(k === 'x') mv.x = Number(v)
    if(k === 'y') mv.y = Number(v)
    if(k === 'y%' || k === 'yPct' || k === 'ypct') mv.yPct = Number(v)
    if(k === 'ms') mv.ms = Number(v)
    if(k === 'ease') mv.ease = v
  }
  return mv
}



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
    debugToasts: (c:{on:boolean})=> `Debug Toasts: ${c.on? 'On':'Off'}`,
    debugHud: (c:{on:boolean})=> `Debug HUD: ${c.on? 'On':'Off'}`,
    hotkeys: (c:{on:boolean})=> `Hotkeys: ${c.on? 'On':'Off'}`,
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
    gallery: ()=> 'Galer├¡a',
    achievements: ()=> 'Logros',
    auto: (c:{on:boolean})=> `Auto: ${c.on? 'S├¡':'No'}`,
    autoChoose: (c:{on:boolean})=> `Auto-Elegir: ${c.on? 'S├¡':'No'}`,
    skipFx: (c:{on:boolean})=> `Omitir FX: ${c.on? 'S├¡':'No'}`,
    skipSeen: (c:{on:boolean})=> `Omitir texto visto: ${c.on? 'S├¡':'No'}`,
    skipTransitions: (c:{on:boolean})=> `Omitir transiciones: ${c.on? 'S├¡':'No'}`,
    debugToasts: (c:{on:boolean})=> `Avisos debug: ${c.on? 'S├¡':'No'}`,
    debugHud: (c:{on:boolean})=> `HUD debug: ${c.on? 'S├¡':'No'}`,
    hotkeys: (c:{on:boolean})=> `Atajos: ${c.on? 'S├¡':'No'}`,
    clearSeen: ()=> 'Limpiar vistos',
    language: ()=> 'Idioma',
    english: ()=> 'Ingl├®s',
    spanish: ()=> 'Espa├▒ol',
    slots: ()=> 'Ranuras:',
    saveN: (c:{n:number})=> `Guardar ${c.n}`,
    loadN: (c:{n:number})=> `Cargar ${c.n}`,
  }
}
function t(key: string, ctx?: any){ const fn = STRINGS[prefs.locale][key]; return fn ? fn(ctx) : key }

function resolveAssetUrl(src?: string): string {
  if(!src) return ''
  if(/^https?:\/\//i.test(src) || src.startsWith('blob:') || src.startsWith('data:')) return src
  if(src.startsWith('/')) return src
  return `/${src}`
}

const EASE_PRESETS: Record<string,string> = {
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  easeInOutSine: 'cubic-bezier(0.37, 0, 0.63, 1)'
}
function resolveEase(name?: string, fallback = 'ease-in-out'){
  if(!name) return fallback
  return EASE_PRESETS[name] || name
}

function applyTheme(theme: ThemeName){
  prefs.theme = theme
  const t = THEMES[theme] || THEMES.night
  const root = document.documentElement.style
  root.setProperty('--bg-top', t.bgTop)
  root.setProperty('--bg-bottom', t.bgBottom)
  root.setProperty('--panel-bg', t.panelBg)
  root.setProperty('--panel-border', t.panelBorder)
  root.setProperty('--accent', t.accent)
  root.setProperty('--accent-2', t.accent2)
  root.setProperty('--font-family', t.font)
}

function resolveStepText(step: any){
  const table = TEXT_TABLE[prefs.locale] || TEXT_TABLE.en
  if(step?.textId){
    return table[step.textId] || TEXT_TABLE.en[step.textId] || step.text || step.textId
  }
  return step?.text
}

function resolveChoiceLabel(opt: any){
  const table = TEXT_TABLE[prefs.locale] || TEXT_TABLE.en
  if(opt?.textId){
    return table[opt.textId] || TEXT_TABLE.en[opt.textId] || opt.label || opt.textId
  }
  return opt?.label
}

function loadBacklog(){
  try { const raw = localStorage.getItem(BACKLOG_KEY); backlog = raw ? JSON.parse(raw) : [] } catch { backlog = [] }
}
function saveBacklog(){
  try { localStorage.setItem(BACKLOG_KEY, JSON.stringify(backlog)) } catch {}
}
function loadPrefs(){
  const defaults: Prefs = { skipSeenText: false, skipTransitions: false, showDebugToasts: false, showDebugHud: false, hotkeysEnabled: true, volume: 0.8, muted: false, bgFadeMs: 400, spriteFadeMs: 220, locale: 'en', theme: 'night' }
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if(!raw){ prefs = defaults; return }
    const parsed = JSON.parse(raw)
    prefs = { ...defaults, ...parsed }
  } catch { prefs = defaults }
  applyTheme(prefs.theme)
  document.documentElement.dir = prefs.locale === 'ar' ? 'rtl' : 'ltr'
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
function readCodex(): CodexEntry[]{ try { return JSON.parse(localStorage.getItem(CODEX_KEY) || '[]') } catch { return [] } }
function writeCodex(list: CodexEntry[]){ try { localStorage.setItem(CODEX_KEY, JSON.stringify(list)) } catch {} }
function codexHas(id: string){ return readCodex().some(e => e.id === id) }
function codexUnlock(id: string){
  const meta = CODEX_META[id]
  if(!meta) return
  const list = readCodex()
  if(list.some(e => e.id === id)) return
  list.push({ id, title: meta.title, body: meta.body, category: meta.category, unlockedAt: new Date().toISOString(), favorite:false, pinned:false })
  writeCodex(list)
}
function codexUpdate(id: string, patch: Partial<CodexEntry>){
  const list = readCodex()
  const next = list.map(it => it.id === id ? { ...it, ...patch } : it)
  writeCodex(next)
}
function codexToggleFavorite(id: string){
  const list = readCodex()
  const next = list.map(it => it.id===id ? { ...it, favorite: !it.favorite } : it)
  writeCodex(next)
}
function codexTogglePinned(id: string){
  const list = readCodex()
  const next = list.map(it => it.id===id ? { ...it, pinned: !it.pinned } : it)
  writeCodex(next)
}
function renderCodexFilters(allItems: CodexEntry[]){
  if(!codexFilters) return
  codexFilters.innerHTML = ''
  const favCount = allItems.filter(it=> it.favorite).length
  const pinCount = allItems.filter(it=> it.pinned).length
  const base = allItems.filter(it => (!codexFiltersState.favoritesOnly || it.favorite) && (!codexFiltersState.pinnedOnly || it.pinned))
  const categories: Record<string, number> = {}
  base.forEach(it => { categories[it.category] = (categories[it.category]||0)+1 })
  const addChip = (label: string, active: boolean, onClick: ()=>void) => {
    const btn = document.createElement('button')
    btn.className = active ? '' : 'secondary'
    btn.style.padding = '4px 8px'
    btn.style.borderRadius = '999px'
    btn.style.border = '1px solid #27304a'
    btn.style.background = active ? '#111827' : '#0b1020'
    btn.style.color = '#a8b0ff'
    btn.textContent = label
    btn.onclick = onClick
    codexFilters.appendChild(btn)
  }
  addChip(`All (${base.length})`, !codexFiltersState.favoritesOnly && !codexFiltersState.pinnedOnly && !codexFiltersState.category, ()=>{ codexFiltersState = { favoritesOnly:false, pinnedOnly:false, category:'' }; if(codexCategory) codexCategory.value=''; renderCodex() })
  addChip(`Favorites (${favCount})`, codexFiltersState.favoritesOnly, ()=>{ codexFiltersState = { ...codexFiltersState, favoritesOnly: !codexFiltersState.favoritesOnly }; renderCodex() })
  addChip(`Pinned (${pinCount})`, codexFiltersState.pinnedOnly, ()=>{ codexFiltersState = { ...codexFiltersState, pinnedOnly: !codexFiltersState.pinnedOnly }; renderCodex() })
  Object.keys(categories).sort().forEach(cat=>{
    const count = categories[cat]
    const label = `${cat} (${count})`
    addChip(label, !codexFiltersState.favoritesOnly && !codexFiltersState.pinnedOnly && codexFiltersState.category.toLowerCase() === cat.toLowerCase(), ()=>{
      codexFiltersState = { ...codexFiltersState, category: cat, favoritesOnly:false, pinnedOnly:false }
      if(codexCategory) codexCategory.value = cat
      renderCodex()
    })
  })
}
function renderCodex(){
  codexList.innerHTML = ''
  const q = (document.getElementById('codexSearch') as HTMLInputElement)?.value?.toLowerCase() || ''
  const selectedCat = (codexFiltersState.category || (codexCategory?.value||'')).trim().toLowerCase()
  const allItems = readCodex()
  // Populate categories based on unlocked items (select fallback)
  if(codexCategory && codexCategory.options.length <= 1){
    const cats = Array.from(new Set(allItems.map(it=> it.category))).sort()
    for(const c of cats){ const opt = document.createElement('option'); opt.value = c; opt.textContent = c; codexCategory.appendChild(opt) }
  }
  renderCodexFilters(allItems)
  let items = allItems
    .filter(it => (!codexFiltersState.favoritesOnly || it.favorite))
    .filter(it => (!codexFiltersState.pinnedOnly || it.pinned))
    .filter(it =>
      (!q || it.title.toLowerCase().includes(q) || it.body.toLowerCase().includes(q) || it.category.toLowerCase().includes(q)) &&
      (!selectedCat || it.category.toLowerCase() === selectedCat)
    )
  if(items.length===0){
    const p = document.createElement('div')
    p.style.color = '#a8b0ff'; p.style.fontSize = '12px'; p.textContent = 'No codex entries match filters.'
    codexList.appendChild(p)
    return
  }
  // Pinned/favorite first, then newest
  items.sort((a,b)=>{
    const pinDiff = Number(!!b.pinned) - Number(!!a.pinned)
    if(pinDiff !== 0) return pinDiff
    const favDiff = Number(!!b.favorite) - Number(!!a.favorite)
    if(favDiff !== 0) return favDiff
    return (b.unlockedAt || '').localeCompare(a.unlockedAt || '')
  })
  const groups: Record<string, CodexEntry[]> = {}
  for(const it of items){ (groups[it.category] ||= []).push(it) }
  const cats = Object.keys(groups).sort()
  for(const cat of cats){
    const header = document.createElement('div')
    header.style.color = '#a0e7ff'; header.style.fontWeight = '600'; header.style.margin = '6px 0 2px'; header.textContent = `${cat} (${groups[cat].length})`
    codexList.appendChild(header)
    for(const it of groups[cat]){
      const row = document.createElement('div')
      row.style.background = '#111827'; row.style.border = '1px solid #27304a'; row.style.borderRadius = '6px'; row.style.padding = '6px 8px'
      row.style.cursor = 'pointer'
      row.style.display = 'flex'
      row.style.flexDirection = 'column'
      row.style.gap = '4px'
      const top = document.createElement('div')
      top.style.display = 'flex'
      top.style.justifyContent = 'space-between'
      top.style.alignItems = 'center'
      const title = document.createElement('div')
      title.style.color = '#a0e7ff'; title.style.fontSize = '13px'; title.style.fontWeight = '600'
      title.textContent = it.title
      const badges = document.createElement('div')
      badges.style.display = 'flex'
      badges.style.gap = '6px'
      const badge = (text:string)=>{ const b = document.createElement('span'); b.textContent = text; b.style.fontSize='11px'; b.style.padding='2px 6px'; b.style.border='1px solid #27304a'; b.style.borderRadius='10px'; b.style.background='#0b1020'; b.style.color='#a0e7ff'; return b }
      if(it.pinned) badges.appendChild(badge('PIN'))
      if(it.favorite) badges.appendChild(badge('FAV'))
      top.appendChild(title); top.appendChild(badges)
      const body = document.createElement('div')
      body.style.color = '#a8b0ff'; body.style.fontSize = '12px'; body.textContent = it.body.length>120 ? (it.body.slice(0,120)+'ÔÇª') : it.body
      const time = document.createElement('div')
      time.style.color = '#7082c1'; time.style.fontSize = '11px'; time.textContent = new Date(it.unlockedAt).toLocaleString()
      const actions = document.createElement('div')
      actions.style.display = 'flex'
      actions.style.gap = '6px'
      actions.style.marginTop = '4px'
      const favBtn = document.createElement('button')
      favBtn.className = 'secondary'
      favBtn.textContent = it.favorite ? 'Unfavorite' : 'Favorite'
      favBtn.onclick = (ev)=>{ ev.stopPropagation(); codexToggleFavorite(it.id); renderCodex() }
      const pinBtn = document.createElement('button')
      pinBtn.className = 'secondary'
      pinBtn.textContent = it.pinned ? 'Unpin' : 'Pin'
      pinBtn.onclick = (ev)=>{ ev.stopPropagation(); codexTogglePinned(it.id); renderCodex() }
      actions.appendChild(favBtn); actions.appendChild(pinBtn)
      row.appendChild(top); row.appendChild(body); row.appendChild(time); row.appendChild(actions)
      row.onclick = ()=>{
        codexSelectedEntry = it
        codexDetailTitle.textContent = it.title
        codexDetailBody.textContent = it.body
        codexDetail.style.display = 'block'
        refreshCodexDetailActions()
      }
      codexList.appendChild(row)
    }
  }
}

function refreshCodexDetailActions(){
  if(!codexSelectedEntry){ codexDetail.style.display = 'none'; return }
  codexFavBtn.textContent = codexSelectedEntry.favorite ? 'Unfavorite' : 'Favorite'
  codexPinBtn.textContent = codexSelectedEntry.pinned ? 'Unpin' : 'Pin'
}

function showErrorOverlay(title: string, details: string){
  if(!errorOverlay || !errorOverlayBody) return
  errorOverlay.style.display = 'flex'
  errorOverlayOpen = true
  errorOverlayBody.innerHTML = `<div style="font-weight:600;margin-bottom:6px;">${title}</div><pre style="white-space:pre-wrap;max-height:260px;overflow:auto;font-size:12px;">${details}</pre>`
  errorOverlay?.focus?.()
}
function hideErrorOverlay(){
  if(errorOverlay) errorOverlay.style.display = 'none'
  errorOverlayOpen = false
}
if(errorOverlayClose){ errorOverlayClose.onclick = hideErrorOverlay }
if(errorOverlay){
  errorOverlay.addEventListener('click', (e)=>{
    if(e.target === errorOverlay) hideErrorOverlay()
  })
  document.addEventListener('keydown', (e)=>{
    if(errorOverlayOpen && e.key === 'Escape'){ hideErrorOverlay() }
  })
}

async function boot(scenePath: string, startSceneId: string = 'intro'){
  console.log('Boot called with:', scenePath, startSceneId)
  const { scenes, errors } = await loadScenesFromUrl(scenePath)
  console.log('Loaded scenes:', scenes, 'errors:', errors)
  if(errors.length){
    const msg = errors.map((e:any)=> typeof e === 'string' ? e : `${e.code||'error'} :: ${e.path||''} ${e.message||''}`).join('\n')
    textEl.textContent = 'Failed to load scenes.'
    showErrorOverlay('Scene validation failed', msg)
    return
  }
  // Preload assets with simple progress UI
  const manifest = buildPreloadManifest(scenes)
  textEl.textContent = 'Loading assets...'
  await preloadAssets(manifest, (p)=>{
    textEl.textContent = `Loading assets (${p.loaded}/${p.total})`
  })
  const remappedScenes = remapRoles(scenes as any)
  try{
    engine.loadScenes(remappedScenes as any)
  }catch(e:any){
    console.error('Scene load failed', e)
    showErrorOverlay('Scene validation failed', e?.message||String(e))
    textEl.textContent = 'Scene validation failed.'
    return
  }
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
  updateDebugHud()
  loadSeen()
  // Apply preferences that affect runtime
  skipFx = !!prefs.skipTransitions
  // Show Continue if autosave exists
  const ts = localStorage.getItem('aurora:minimal:autosave:ts')
  if(ts){
    continueBtn.style.display = 'inline-block'
    const meta = readStepMeta('aurora:minimal:autosave:meta')
    const desc = formatStepMeta(meta)
    const when = new Date(parseInt(ts)).toLocaleString()
    continueBtn.textContent = desc ? `Continue ${desc} (saved ${when})` : `Continue (saved ${when})`
    continueBtn.title = desc || continueBtn.textContent
  } else {
    continueBtn.style.display = 'none'
  }
  try{
    engine.start(startSceneId)
  }catch(e:any){
    console.error('Engine start failed', e)
    textEl.textContent = 'Engine start failed: '+ (e?.message||e)
    return
  }
  // Load slot thumbnails if present
  refreshSlotThumb(1)
  refreshSlotThumb(2)
  refreshSlotThumb(3)
}

async function bootFromScenes(scenes: any[], startSceneId?: string){
  console.log('BootFromScenes called with start:', startSceneId)
  try{
    const manifest = buildPreloadManifest(scenes as any)
    textEl.textContent = 'Loading assets...'
    await preloadAssets(manifest, (p)=>{ textEl.textContent = `Loading assets (${p.loaded}/${p.total})` })
  }catch(e){ console.error('preload failed', e) }
  const roleMapped = remapRoles(scenes as any)
  try{
    engine.loadScenes(roleMapped as any)
  }catch(e:any){
    console.error('Scene load failed', e)
    textEl.textContent = 'Scene validation failed: '+ (e?.message||e)
    return
  }
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
  updateDebugHud()
  loadSeen()
  skipFx = !!prefs.skipTransitions
  try{
    engine.start(startSceneId || (scenes[0]?.id || 'intro'))
  }catch(e:any){
    console.error('Engine start failed', e)
    textEl.textContent = 'Engine start failed: '+ (e?.message||e)
    return
  }
  refreshSlotThumb(1)
  refreshSlotThumb(2)
  refreshSlotThumb(3)
}

let _activeBgLayer: 'A'|'B' = 'A'
let _currentBgSrc: string | undefined = undefined

function setBackground(src?: string){
  if(!src){ if(bgA) bgA.style.opacity='0'; if(bgB) bgB.style.opacity='0'; _currentBgSrc=undefined; return }
  if(_currentBgSrc === src) return
  const resolved = resolveAssetUrl(src)
  const fadeMs = skipFx ? 0 : (prefs.bgFadeMs||400)
  if(bgA) bgA.style.transitionDuration = `${fadeMs}ms`
  if(bgB) bgB.style.transitionDuration = `${fadeMs}ms`
  const next = _activeBgLayer === 'A' ? bgB : bgA
  const cur = _activeBgLayer === 'A' ? bgA : bgB
  if(!next || !cur) { // fallback to old behavior
    if(bgEl) bgEl.style.backgroundImage = `url(${resolved})`
    _currentBgSrc = src
    return
  }
  const testImg = new Image()
  testImg.onload = () => {
    next.style.backgroundImage = `url(${resolved})`
    // crossfade
    next.style.opacity = '1'
    cur.style.opacity = '0'
    _activeBgLayer = _activeBgLayer === 'A' ? 'B' : 'A'
    _currentBgSrc = src
  }
  testImg.onerror = () => {
    console.error('Failed to load background image:', src)
  }
  testImg.src = resolved
}

on('vn:step', ({ step, state }) => {
  console.log('vn:step received:', { step, state })
  lastStepMeta = {
    sceneId: state.sceneId || '',
    index: typeof state.index === 'number' ? state.index : 0,
    label: describeStep(state, step)
  }
  // Update sprite metadata if step carries positioning hints
  try {
    if(step && (step.type === 'spriteShow' || step.type === 'spriteSwap')){
      const id = (step as any).id as string
      if(id){
        const pos = (step as any).pos as ('left'|'center'|'right'|undefined)
        const z = typeof (step as any).z === 'number' ? (step as any).z as number : undefined
        const x = typeof (step as any).x === 'number' ? (step as any).x as number : undefined
        const y = typeof (step as any).y === 'number' ? (step as any).y as number : undefined
        const yPct = typeof (step as any).yPct === 'number' ? (step as any).yPct as number : undefined
        const scale = typeof (step as any).scale === 'number' ? (step as any).scale as number : undefined
        const moveTo = (step as any).moveTo as any
        const cur = spriteMeta[id] || {}
        if(pos) cur.pos = pos
        if(z !== undefined) cur.z = z
        if(x !== undefined) cur.x = x
        if(y !== undefined) cur.y = y
        if(yPct !== undefined) cur.yPct = yPct
        if(scale !== undefined) cur.scale = scale
        if(moveTo && typeof moveTo === 'object'){
          if(typeof moveTo.x === 'number') cur.x = moveTo.x
          if(typeof moveTo.y === 'number') cur.y = moveTo.y
          if(typeof moveTo.yPct === 'number') cur.yPct = moveTo.yPct
        }
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
  // background label (we also render actual image)
  bgLabel.textContent = state.bg ? `Background: ${state.bg}` : ''
  // Crossfade-render background image
  setBackground(state.bg)
  // Render sprites as positioned images with reconciliation and transitions
  ;(window as any)._spriteEls = (window as any)._spriteEls || {}
  const spriteEls: Record<string, HTMLImageElement> = (window as any)._spriteEls
  const current = new Set(Object.keys(state.sprites || {}))
  // Remove missing with fade-out
  for(const id of Object.keys(spriteEls)){
    if(!current.has(id)){
      const img = spriteEls[id]
      img.style.transition = 'opacity 200ms ease, transform 200ms ease, left 250ms ease-in-out'
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
    const scale = typeof meta.scale === 'number' ? meta.scale : 1
    const resolvedSrc = resolveAssetUrl(src as string)
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
    if(img.src !== resolvedSrc){
      img.style.opacity = '0'
      setTimeout(()=>{ img!.src = resolvedSrc; img!.style.opacity = '1' }, 120)
    }
    // Positioning and depth scaling
    // Allow per-step motion hints for the currently processed sprite
    let moveMs = 250
    let moveEase = resolveEase(undefined)
    try{
      if(step && (step.type==='spriteShow' || step.type==='spriteSwap') && (step as any).id === id){
        if(typeof (step as any).moveMs === 'number') moveMs = Math.max(0, (step as any).moveMs as number)
        if(typeof (step as any).moveEase === 'string') moveEase = resolveEase(String((step as any).moveEase))
        const moveTo = (step as any).moveTo
        if(moveTo){
          if(typeof moveTo.ms === 'number') moveMs = Math.max(0, moveTo.ms as number)
          if(typeof moveTo.ease === 'string') moveEase = resolveEase(String(moveTo.ease))
          if(typeof moveTo.x === 'number') meta.x = moveTo.x
          if(typeof moveTo.y === 'number') meta.y = moveTo.y
          if(typeof moveTo.yPct === 'number') meta.yPct = moveTo.yPct
        }
        const movesArr = Array.isArray((step as any).moves) ? (step as any).moves as MoveStep[] : []
        if(movesArr.length){
          // Update meta to final target so we end at the last move position
          for(const mv of movesArr){
            if(typeof mv.x === 'number') meta.x = mv.x
            if(typeof mv.y === 'number') meta.y = mv.y
            if(typeof mv.yPct === 'number') meta.yPct = mv.yPct
          }
        }
      }
    }catch{}
    const leftPct = typeof meta.x === 'number' ? Math.max(0, Math.min(100, meta.x)) : (pos === 'left' ? 20 : pos === 'right' ? 80 : 50)
    const yPct = resolveYPercent(meta)
    const moveDur = skipFx ? 0 : moveMs
    const fadeDur = skipFx ? 0 : (prefs.spriteFadeMs||220)
    img.style.transition = `opacity ${fadeDur}ms ease, transform ${moveDur}ms ${moveEase}, left ${moveDur}ms ${moveEase}`
    img.style.left = leftPct + '%'
    img.style.transform = `translate(-50%, ${-yPct}%) scale(${scale})`
    const prevZ = Number(img.style.zIndex || '0')
    const nextZ = typeof meta.z === 'number' ? meta.z : prevZ
    if(nextZ !== prevZ){
      // Animate scale briefly to suggest depth change, then swap z-index
      img.style.transform = `translate(-50%, ${-yPct}%) scale(${scale * 1.03})`
      setTimeout(()=>{ img!.style.zIndex = String(nextZ); img!.style.transform = `translate(-50%, ${-yPct}%) scale(${scale})` }, 180)
    } else {
      if(typeof meta.z === 'number') img.style.zIndex = String(meta.z)
    }
    if(!existed && !img.src){ img.src = resolvedSrc }

    const moveChain = Array.isArray((step as any)?.moves) ? ((step as any).moves as MoveStep[]) : []
    if(moveChain.length && !skipFx){
      let currentX = leftPct
      let currentY = yPct
      let delay = 0
      for(const mv of moveChain){
        const targetX = typeof mv.x === 'number' ? Math.max(0, Math.min(100, mv.x)) : currentX
        const targetY = resolveYPercent({ y: mv.y, yPct: mv.yPct })
        const dur = mv.ms != null ? Math.max(0, mv.ms) : moveMs
        const ease = resolveEase(mv.ease, moveEase)
        setTimeout(()=> {
          try{
            img!.style.transition = `opacity ${fadeDur}ms ease, transform ${dur}ms ${ease}, left ${dur}ms ${ease}`
            img!.style.left = `${targetX}%`
            img!.style.transform = `translate(-50%, ${-targetY}%) scale(${scale})`
          }catch{}
        }, delay)
        delay += dur
        currentX = targetX
        currentY = targetY
      }
    }
  }
  // clear UI
  nameEl.textContent = ''
  textEl.textContent = ''
  choicesEl.innerHTML = ''
  choiceButtons = []
  choiceFocusIndex = 0
  nextBtn.style.display = 'inline-block'

  const stepKey = state.sceneId != null ? `${state.sceneId}:${state.index}` : ''

  if(!step){
    textEl.textContent = 'End of scene.'
    nextBtn.style.display = 'none'
    return
  }

  if(step.type === 'dialogue'){
    if(step.char){ nameEl.textContent = step.char+': ' }
    textEl.textContent = resolveStepText(step)
    // Mark as seen after showing
    try {
      if (state.sceneId != null) {
        const k2 = `${state.sceneId}:${state.index}`
        if (!seenLines.has(k2)) { seenLines.add(k2); saveSeen() }
      }
    } catch {}
    // Append to backlog (cap to 200 entries)
    backlog.push({ char: step.char, text: resolveStepText(step) })
    if(backlog.length > 200) backlog.shift()
    saveBacklog()
  } else if(step.type === 'choice'){
    nextBtn.style.display = 'none'
    const hint = autoChoiceHint && autoChoiceHint.key === stepKey ? autoChoiceHint : null
    const hintRow = document.createElement('div')
    hintRow.style.width = '100%'
    hintRow.style.color = '#8aa0e0'
    hintRow.style.fontSize = '12px'
    hintRow.style.marginBottom = '6px'
    hintRow.setAttribute('aria-live','polite')
    hintRow.textContent = hint
      ? (hint.willAutoDecide ? `Auto-choose will pick "${hint.chosenLabel}"` : `Default option: "${hint.chosenLabel}"`)
      : 'Use arrow keys/Home/End or Tab + Enter to pick an option.'
    choicesEl.appendChild(hintRow)
    step.options.forEach((opt: { label: string }, idx: number) => {
      const b = document.createElement('button')
      b.textContent = ''
      const label = document.createElement('span')
      label.textContent = resolveChoiceLabel(opt)
      b.appendChild(label)
      if(hint && hint.chosenIndex === idx){
        const badge = document.createElement('span')
        badge.textContent = hint.willAutoDecide ? 'AUTO' : 'DEFAULT'
        badge.style.marginLeft = '8px'
        badge.style.fontSize = '11px'
        badge.style.padding = '2px 6px'
        badge.style.borderRadius = '10px'
        badge.style.background = hint.willAutoDecide ? '#1f2937' : '#111827'
        badge.style.border = '1px solid #27304a'
        badge.style.color = '#a0e7ff'
        badge.title = hint.willAutoDecide ? 'Auto-decide will pick this option' : 'Default option'
        b.appendChild(badge)
      }
      b.onclick = () => engine.choose(idx)
      choicesEl.appendChild(b)
      choiceButtons.push(b)
    })
    focusChoiceButton(hint ? hint.chosenIndex : 0)
  } else {
    // auto-advance steps are handled by engine.next() calls triggered via user Next
    textEl.textContent = `${step.type}`
  }
  // Autosave after every step render
  try{
    const snap = engine.snapshot()
    localStorage.setItem('aurora:minimal:autosave', JSON.stringify(snap))
    localStorage.setItem('aurora:minimal:autosave:ts', String(Date.now()))
    writeStepMeta('aurora:minimal:autosave:meta', lastStepMeta || metaFromState())
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
  updateDebugHud()
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

on('vn:auto-choice-hint', (d:any)=>{
  try{
    autoChoiceHint = {
      key: `${d.sceneId}:${d.index}`,
      chosenIndex: Number(d.chosenIndex ?? -1),
      chosenLabel: d.chosenLabel,
      strategy: d.strategy,
      willAutoDecide: !!d.willAutoDecide,
      options: Number(d.options || 0),
      validOptions: Number(d.validOptions || 0)
    }
    if(prefs.showDebugToasts){
      const msg = `[auto-choice hint] ${(d.strategy||'auto')} -> #${d.chosenIndex} "${d.chosenLabel}" (${d.validOptions}/${d.options})`
      showToast(msg)
    }
  }catch{}
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
  if(!prefs.showDebugToasts) return
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

function describeStep(state: any, step: any): string{
  if(!step){
    return 'End'
  }
  if(step.type === 'dialogue'){
    const who = step.char ? `${step.char}: ` : ''
    return truncateLabel(who + step.text)
  }
  if(step.type === 'choice'){
    const labels = (step.options||[]).map((o:any)=> o?.label).filter(Boolean).slice(0,3)
    return truncateLabel('Choice: '+labels.join(' / '))
  }
  return String(step.type || 'step')
}

function truncateLabel(s: string, max = 60): string{
  if(!s) return ''
  const clean = s.replace(/\s+/g, ' ').trim()
  return clean.length > max ? clean.slice(0, max-1)+'ÔÇª' : clean
}

function formatStepMeta(meta: StepMeta | null): string{
  if(!meta) return ''
  const scene = meta.sceneId || 'scene'
  const idx = typeof meta.index === 'number' ? meta.index : 0
  const label = meta.label ? ` - ${meta.label}` : ''
  return `${scene}#${idx}${label}`
}

function readStepMeta(key: string): StepMeta | null{
  try{
    const raw = localStorage.getItem(key)
    if(!raw) return null
    return JSON.parse(raw) as StepMeta
  }catch{ return null }
}

function writeStepMeta(key: string, meta: StepMeta | null){
  try{
    if(!meta){ localStorage.removeItem(key); return }
    localStorage.setItem(key, JSON.stringify(meta))
  }catch{}
}

function metaFromState(): StepMeta{
  const st = engine.getPublicState()
  return {
    sceneId: st.sceneId || '',
    index: typeof (st as any).index === 'number' ? (st as any).index : 0,
    label: lastStepMeta?.label || ''
  }
}

function readSlotInfo(n: number){
  const key = slotKey(n)
  try{
    const raw = localStorage.getItem(key)
    const has = !!raw
    const tsRaw = localStorage.getItem(`${key}:ts`)
    const ts = tsRaw ? parseInt(tsRaw, 10) : null
    const when = ts ? new Date(ts).toLocaleString() : null
    const label = localStorage.getItem(`${key}:label`) || ''
    const meta = readStepMeta(`${key}:meta`)
    const desc = formatStepMeta(meta)
    const thumb = localStorage.getItem(`${key}:thumb`) || ''
    return { key, has, ts, when, label, desc, thumb }
  }catch{
    return { key, has:false, ts:null, when:null as string|null, label:'', desc:'', thumb:'' }
  }
}

function formatBytes(bytes: number): string{
  if(!bytes) return '0B'
  const units = ['B','KB','MB','GB']
  const i = Math.min(units.length-1, Math.floor(Math.log(bytes)/Math.log(1024)))
  const val = bytes / Math.pow(1024, i)
  return `${val.toFixed(val >= 10 ? 0 : 1)}${units[i]}`
}

function renderAssets(){
  if(!assetList) return
  assetList.innerHTML = ''
  if(localAssets.length === 0){
    const div = document.createElement('div')
    div.style.color = '#a8b0ff'
    div.style.fontSize = '12px'
    div.textContent = 'No local assets yet. Drop PNG/JPG/WebP/MP3/OGG files here.'
    assetList.appendChild(div)
    return
  }
  localAssets.slice().reverse().forEach((asset) => {
    const row = document.createElement('div')
    row.style.display = 'flex'
    row.style.gap = '8px'
    row.style.alignItems = 'center'
    row.style.padding = '6px 8px'
    row.style.background = '#111827'
    row.style.border = '1px solid #27304a'
    row.style.borderRadius = '6px'

    const meta = document.createElement('div')
    meta.style.flex = '1'
    meta.style.color = '#a8b0ff'
    meta.style.fontSize = '12px'
    meta.innerHTML = `<strong style="color:#a0e7ff">${asset.name}</strong> ┬À ${asset.type || 'file'} ┬À ${formatBytes(asset.size)}`

    const actions = document.createElement('div')
    actions.style.display = 'flex'
    actions.style.gap = '6px'

    const bgBtn = document.createElement('button')
    bgBtn.className = 'secondary'
    bgBtn.textContent = 'Preview BG'
    bgBtn.onclick = ()=> setBackground(asset.url)

    const copyBtn = document.createElement('button')
    copyBtn.className = 'secondary'
    copyBtn.textContent = 'Copy URL'
    copyBtn.onclick = async ()=>{
      try{
        await navigator.clipboard.writeText(asset.url)
        showToast('Copied object URL (local only)')
      }catch{}
    }

    actions.appendChild(bgBtn)
    actions.appendChild(copyBtn)
    row.appendChild(meta)
    row.appendChild(actions)
    assetList.appendChild(row)
  })
}

function addLocalAssets(files: FileList | File[]){
  const arr = Array.from(files || [])
  for(const file of arr){
    try{
      const url = URL.createObjectURL(file)
      localAssets.push({ name: file.name, type: file.type, size: file.size, url })
    }catch{}
  }
  // Cap memory: keep last 12
  if(localAssets.length > 12){
    localAssets = localAssets.slice(localAssets.length - 12)
  }
  renderAssets()
}

nextBtn.onclick = () => engine.next()

const SAVE_KEY = 'aurora:minimal:quicksave'
const slotKey = (n:number)=> `aurora:minimal:slot${n}`
saveBtn.onclick = () => {
  const snap = engine.snapshot()
  const meta = lastStepMeta || metaFromState()
  try{
    localStorage.setItem(SAVE_KEY, JSON.stringify(snap))
    writeStepMeta(`${SAVE_KEY}:meta`, meta)
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
    const meta = readStepMeta(`${SAVE_KEY}:meta`)
    const desc = formatStepMeta(meta)
    saveStatus.textContent = desc ? `Loaded (${desc})` : 'Loaded'
  }catch{
    saveStatus.textContent = 'Load failed'
  }
}

continueBtn.onclick = () => {
  try{
    const raw = localStorage.getItem('aurora:minimal:autosave')
    if(!raw){ saveStatus.textContent = 'No autosave'; return }
    engine.restore(JSON.parse(raw))
    const meta = readStepMeta('aurora:minimal:autosave:meta')
    const desc = formatStepMeta(meta)
    saveStatus.textContent = desc ? `Continued (${desc})` : 'Continued'
  }catch{ saveStatus.textContent = 'Continue failed' }
}

function saveToSlot(n: number){
  const key = slotKey(n)
  try{
    // Confirm overwrite if an existing save is present
    try{
      const existing = localStorage.getItem(key)
      if(existing){
        const ts = localStorage.getItem(`${key}:ts`)
        const when = ts ? new Date(parseInt(ts)).toLocaleString() : 'unknown time'
        const ok = window.confirm(`Overwrite slot ${n}? (existing: ${when})`)
        if(!ok) { slotStatus.textContent = `Canceled save ${n}`; return }
      }
    }catch{}
    const snap = engine.snapshot()
    localStorage.setItem(key, JSON.stringify(snap))
    localStorage.setItem(`${key}:ts`, String(Date.now()))
    const meta = lastStepMeta || metaFromState()
    writeStepMeta(`${key}:meta`, meta)
    // Generate and store a thumbnail
    captureThumbnail(engine.getPublicState()).then(url=>{ try { if(url) localStorage.setItem(`${key}:thumb`, url); refreshSlotThumb(n) } catch {} })
    const desc = formatStepMeta(meta)
    slotStatus.textContent = desc ? `Saved ${n} (${desc})` : `Saved to ${n}`
  }catch{ slotStatus.textContent = `Save ${n} failed` }
}
function loadFromSlot(n: number){
  const key = slotKey(n)
  try{
    const raw = localStorage.getItem(key)
    if(!raw){ slotStatus.textContent = `No save ${n}`; return }
    engine.restore(JSON.parse(raw))
    const ts = localStorage.getItem(`${key}:ts`)
    const meta = readStepMeta(`${key}:meta`)
    const desc = formatStepMeta(meta)
    const when = ts ? new Date(parseInt(ts)).toLocaleString() : ''
    slotStatus.textContent = desc ? `Loaded ${n} (${desc})` : ts ? `Loaded ${n} (${when})` : `Loaded ${n}`
  }catch{ slotStatus.textContent = `Load ${n} failed` }
}
slot1save.onclick = ()=> saveToSlot(1)
slot1load.onclick = ()=> loadFromSlot(1)
slot2save.onclick = ()=> saveToSlot(2)
slot2load.onclick = ()=> loadFromSlot(2)
slot3save.onclick = ()=> saveToSlot(3)
slot3load.onclick = ()=> loadFromSlot(3)

// Extra autosave on tab hide/close
function writeAutosave(){
  try{
    const snap = engine.snapshot()
    localStorage.setItem('aurora:minimal:autosave', JSON.stringify(snap))
    localStorage.setItem('aurora:minimal:autosave:ts', String(Date.now()))
  }catch{}
}
window.addEventListener('beforeunload', writeAutosave)
document.addEventListener('visibilitychange', ()=>{ if(document.hidden) writeAutosave() })

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
  const key = `${slotKey(n)}:thumb`
  const img = n===1 ? slot1thumb : n===2 ? slot2thumb : slot3thumb
  try{ const url = localStorage.getItem(key); img.src = url || '' }catch{ img.src = '' }
}

// Initial boot with example scenes
boot('/scenes/example.json', 'intro')

// Allow switching demos on demand
startExampleBtn.onclick = () => boot('/scenes/example.json', 'intro')
startExpressionsBtn.onclick = () => boot('/scenes/expressions.json', 'intro')
startAchBtn && (startAchBtn.onclick = () => boot('/scenes/achievements.json', 'ach_intro'))
if(packLoadBtn && packSelect){
  packLoadBtn.onclick = () => {
    const opt = packSelect.value
    const map: Record<string, { path: string; start: string }> = {
      example: { path: '/scenes/example.json', start: 'intro' },
      expressions: { path: '/scenes/expressions.json', start: 'intro' },
      achievements: { path: '/scenes/achievements.json', start: 'ach_intro' }
    }
    const cfg = map[opt] || map.example
    boot(cfg.path, cfg.start)
  }
}

openGalleryBtn.onclick = () => { renderGallery(); galleryPanel.style.display = 'block'; updateBackdrop(); trapFocusIn(galleryPanel) }
closeGalleryBtn.onclick = () => { galleryPanel.style.display = 'none'; updateBackdrop() }
openAchBtn.onclick = () => { renderAchievements(); achPanel.style.display = 'block'; updateBackdrop(); trapFocusIn(achPanel) }
closeAchBtn.onclick = () => { achPanel.style.display = 'none'; updateBackdrop() }
openCodexBtn.onclick = () => { codexFiltersState = { favoritesOnly:false, pinnedOnly:false, category:'' }; if(codexCategory) codexCategory.value=''; renderCodex(); codexPanel.style.display = 'block'; updateBackdrop(); trapFocusIn(codexPanel) }
closeCodexBtn.onclick = () => { codexPanel.style.display = 'none'; updateBackdrop() }
codexDetailClose.onclick = ()=> { codexSelectedEntry = null; codexDetail.style.display = 'none' }
openBacklogBtn.onclick = () => { renderBacklog(); backlogPanel.style.display = 'block'; updateBackdrop(); trapFocusIn(backlogPanel) }
closeBacklogBtn.onclick = () => { backlogPanel.style.display = 'none'; updateBackdrop() }
openSettingsBtn.onclick = () => { refreshSettingsUI(); settingsPanel.style.display = 'block'; updateBackdrop(); trapFocusIn(settingsPanel) }
closeSettingsBtn.onclick = () => { settingsPanel.style.display = 'none'; updateBackdrop() }
function refreshSettingsUI(){
  document.documentElement.dir = prefs.locale === 'ar' ? 'rtl' : 'ltr'
  applyTheme(prefs.theme)
  toggleSkipSeenBtn.textContent = t('skipSeen', { on: prefs.skipSeenText })
  toggleSkipTransitionsBtn.textContent = t('skipTransitions', { on: prefs.skipTransitions })
  toggleDebugToastsBtn.textContent = t('debugToasts', { on: prefs.showDebugToasts })
  if(toggleDebugHudBtn) toggleDebugHudBtn.textContent = t('debugHud', { on: prefs.showDebugHud })
  toggleHotkeysBtn.textContent = t('hotkeys', { on: prefs.hotkeysEnabled })
  ;(document.getElementById('settingsTitle') as HTMLElement).textContent = t('settings')
  ;(document.getElementById('closeSettings') as HTMLButtonElement).textContent = t('close')
  ;(document.getElementById('langLabel') as HTMLElement).textContent = t('language')
  langEnBtn.textContent = t('english')
  langEsBtn.textContent = t('spanish')
  langArBtn.textContent = 'Arabic'
  if(toggleThemeBtn) toggleThemeBtn.textContent = `Theme: ${prefs.theme === 'night' ? 'Night' : 'Sand'}`
  if(aiModeSelect) aiModeSelect.value = prefs.aiMode || 'local'
  if(aiProviderSelect) aiProviderSelect.value = prefs.aiProvider || 'openai'
  if(aiModelInput) aiModelInput.value = prefs.aiModel || ''
  if(aiBaseUrlInput) aiBaseUrlInput.value = prefs.aiBaseUrl || ''
  if(aiLocalModelInput) aiLocalModelInput.value = prefs.aiLocalModel || ''
  if(aiApiKeyInput) aiApiKeyInput.value = prefs.aiApiKey || ''
  try{
    if(bgFadeMsInput){ bgFadeMsInput.value = String(prefs.bgFadeMs); bgFadeMsVal.textContent = `${prefs.bgFadeMs}ms` }
    if(spriteFadeMsInput){ spriteFadeMsInput.value = String(prefs.spriteFadeMs); spriteFadeMsVal.textContent = `${prefs.spriteFadeMs}ms` }
  }catch{}
}
toggleSkipSeenBtn.onclick = () => { prefs.skipSeenText = !prefs.skipSeenText; savePrefs(); refreshSettingsUI() }
toggleSkipTransitionsBtn.onclick = () => { prefs.skipTransitions = !prefs.skipTransitions; skipFx = prefs.skipTransitions; savePrefs(); refreshSettingsUI(); refreshSkipFx() }
toggleDebugToastsBtn.onclick = () => { prefs.showDebugToasts = !prefs.showDebugToasts; savePrefs(); refreshSettingsUI() }
if(toggleDebugHudBtn){ toggleDebugHudBtn.onclick = () => { prefs.showDebugHud = !prefs.showDebugHud; savePrefs(); refreshSettingsUI(); updateDebugHud() } }
toggleHotkeysBtn.onclick = () => { prefs.hotkeysEnabled = !prefs.hotkeysEnabled; savePrefs(); refreshSettingsUI() }
if(toggleThemeBtn){ toggleThemeBtn.onclick = () => { prefs.theme = prefs.theme === 'night' ? 'sand' : 'night'; applyTheme(prefs.theme); savePrefs(); refreshSettingsUI() } }
clearSeenBtn.onclick = () => { seenLines = new Set(); saveSeen(); }
if(aiModeSelect){
  aiModeSelect.onchange = () => {
    prefs.aiMode = aiModeSelect.value === 'byok' ? 'byok' : 'local'
    savePrefs()
    refreshSettingsUI()
    ensureAIAdapters(true)
  }
}
if(aiProviderSelect){
  aiProviderSelect.onchange = ()=>{ prefs.aiProvider = aiProviderSelect.value || 'openai'; savePrefs(); ensureAIAdapters(true) }
}
if(aiModelInput){
  aiModelInput.onchange = ()=>{ prefs.aiModel = aiModelInput.value || ''; savePrefs(); ensureAIAdapters(true) }
}
if(aiBaseUrlInput){
  aiBaseUrlInput.onchange = ()=>{ prefs.aiBaseUrl = aiBaseUrlInput.value || ''; savePrefs(); ensureAIAdapters(true) }
}
if(aiLocalModelInput){
  aiLocalModelInput.onchange = ()=>{ prefs.aiLocalModel = aiLocalModelInput.value || ''; savePrefs(); ensureAIAdapters(true) }
}
if(aiApiKeyInput){
  aiApiKeyInput.onchange = () => {
    prefs.aiApiKey = aiApiKeyInput.value || ''
    savePrefs()
    if(prefs.aiMode === 'byok') ensureAIAdapters(true)
  }
}
langEnBtn.onclick = () => { prefs.locale = 'en'; savePrefs(); refreshSettingsUI(); refreshAutoButtons(); refreshSkipFx() }
langEsBtn.onclick = () => { prefs.locale = 'es'; savePrefs(); refreshSettingsUI(); refreshAutoButtons(); refreshSkipFx() }
langArBtn.onclick = () => { prefs.locale = 'ar'; savePrefs(); refreshSettingsUI(); refreshAutoButtons(); refreshSkipFx() }
bgFadeMsInput?.addEventListener('input', ()=>{ const v = parseInt(bgFadeMsInput.value||'400',10); prefs.bgFadeMs = Math.max(0, Math.min(5000, v)); savePrefs(); refreshSettingsUI() })
spriteFadeMsInput?.addEventListener('input', ()=>{ const v = parseInt(spriteFadeMsInput.value||'220',10); prefs.spriteFadeMs = Math.max(0, Math.min(5000, v)); savePrefs(); refreshSettingsUI() })

openSavesBtn.onclick = () => { renderSaves(); savesPanel.style.display = 'block'; updateBackdrop(); trapFocusIn(savesPanel) }
closeSavesBtn.onclick = () => { savesPanel.style.display = 'none'; updateBackdrop() }
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
    const info = readSlotInfo(n)
    img.src = info.thumb || ''
    const meta = document.createElement('div')
    meta.style.flex = '1'
    meta.style.color = '#a8b0ff'
    meta.style.fontSize = '12px'
    const when = info.when || 'Empty slot'
    const label = info.label
    const desc = info.desc
    meta.textContent = info.has ? (label ? `${label} — ${when}` : when) : 'Empty slot'
    if(info.has && desc){
      const sub = document.createElement('div')
      sub.style.color = '#7082c1'
      sub.style.fontSize = '11px'
      sub.textContent = desc
      meta.appendChild(document.createElement('br'))
      meta.appendChild(sub)
    }
    const actions = document.createElement('div')
    const saveB = document.createElement('button')
    saveB.className = 'secondary'
    saveB.textContent = t('saveN', { n })
    saveB.onclick = ()=>{ saveToSlot(n); setTimeout(()=> renderSaves(), 50) }
    const loadB = document.createElement('button')
    loadB.className = 'secondary'
    loadB.textContent = t('loadN', { n })
    loadB.onclick = ()=> loadFromSlot(n)
    const renameB = document.createElement('button')
    renameB.className = 'secondary'
    renameB.textContent = 'Rename'
    renameB.onclick = ()=>{
      if(!info.has){ slotStatus.textContent = `No save ${n} to rename`; return }
      const cur = info.label || info.desc || ''
      const name = window.prompt('Slot name:', cur)
      if(name==null) return
      const trimmed = name.trim()
      if(trimmed === cur.trim()) return
      const ok = window.confirm(`Rename slot ${n} to "${trimmed || 'Untitled'}"?`)
      if(!ok) return
      try{ localStorage.setItem(`${info.key}:label`, trimmed) }catch{}
      renderSaves()
      slotStatus.textContent = `Renamed slot ${n}`
    }
    const delB = document.createElement('button')
    delB.className = 'secondary'
    delB.textContent = 'Delete'
    delB.onclick = ()=>{
      const fresh = readSlotInfo(n)
      if(!fresh.has){ slotStatus.textContent = `No save ${n}`; return }
      const summary = fresh.desc || fresh.when || ''
      const ok = window.confirm(`Delete slot ${n}? ${summary ? `(${summary})` : ''}`.trim())
      if(!ok) return
      try{
        localStorage.removeItem(fresh.key)
        localStorage.removeItem(`${fresh.key}:ts`)
        localStorage.removeItem(`${fresh.key}:thumb`)
        localStorage.removeItem(`${fresh.key}:label`)
        localStorage.removeItem(`${fresh.key}:meta`)
      }catch{}
      renderSaves()
      slotStatus.textContent = `Deleted slot ${n}`
    }
    actions.appendChild(saveB)
    actions.appendChild(loadB)
    actions.appendChild(renameB)
    actions.appendChild(delB)
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
  const volPct = Math.round((prefs.volume || 0) * 100)
  const volLabel = prefs.muted ? 'Muted' : `Vol ${volPct}%`
  musicStatus.textContent = track ? `${track} ÔÇö ${isPlaying? 'Playing':'Paused'} ÔÇö ${volLabel}` : `No track ÔÇö ${volLabel}`
}
on('music:track-change', ()=> { /* engine updates track */ updateMusicStatus() })
on('music:play', ()=> { isPlaying = true; updateMusicStatus() })
on('music:pause', ()=> { isPlaying = false; updateMusicStatus() })

musicPlayBtn.onclick = () => {
  const track = engine.getPublicState().music || 'demo-track'
  Jukebox.play(track, track)
}
musicPauseBtn.onclick = () => { Jukebox.pause() }

// Volume + Mute controls (template-level; engine jukebox is event-only)
function refreshVolumeUI(){
  if(volumeSlider) volumeSlider.value = String(Math.round((prefs.volume||0)*100))
  if(muteToggle) muteToggle.textContent = prefs.muted ? 'Unmute' : 'Mute'
  updateMusicStatus()
}
if(volumeSlider){
  volumeSlider.addEventListener('input', ()=>{
    const v = Math.max(0, Math.min(100, parseInt(volumeSlider.value||'0',10)))
    prefs.volume = v/100
    savePrefs()
    refreshVolumeUI()
  })
}
if(muteToggle){
  muteToggle.onclick = ()=>{ prefs.muted = !prefs.muted; savePrefs(); refreshVolumeUI() }
}
refreshVolumeUI()

// -----------------------------
// Keyboard Shortcuts
// -----------------------------
function isTypingTarget(el: EventTarget | null): boolean {
  const t = el as HTMLElement | null
  if(!t) return false
  const tag = (t.tagName || '').toLowerCase()
  return tag === 'input' || tag === 'textarea' || (t as any).isContentEditable === true || tag === 'select'
}

function anyPanelOpen(){
  return [galleryPanel, achPanel, codexPanel, backlogPanel, settingsPanel, savesPanel].some(p => p.style.display !== 'none')
}
function updateBackdrop(){
  if(!backdropEl) return
  backdropEl.style.display = anyPanelOpen() ? 'block' : 'none'
}

function toggle(el: HTMLElement, render?: ()=>void){
  const open = el.style.display !== 'none'
  if(open){ el.style.display = 'none' }
  else { if(render) render(); el.style.display = 'block' }
  updateBackdrop()
}

let hotkeyHelpEl: HTMLDivElement | null = null
function toggleHotkeyHelp(){
  if(hotkeyHelpEl){ hotkeyHelpEl.remove(); hotkeyHelpEl = null; return }
  const div = document.createElement('div')
  div.style.position = 'fixed'
  div.style.top = '12px'
  div.style.right = '12px'
  div.style.maxWidth = '420px'
  div.style.background = '#0b1020'
  div.style.border = '1px solid #27304a'
  div.style.color = '#a8b0ff'
  div.style.padding = '10px 12px'
  div.style.borderRadius = '8px'
  div.style.boxShadow = '0 10px 24px rgba(0,0,0,.5)'
  div.style.zIndex = '9999'
  div.style.fontSize = '12px'
  div.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
      <strong style="color:#a0e7ff">Shortcuts</strong>
      <button class="secondary" id="hkClose">Close</button>
    </div>
    <div style="display:grid; grid-template-columns: auto 1fr; gap:6px 12px">
      <div>Space/Enter</div><div>Next</div>
      <div>ÔåÆ</div><div>Next</div>
      <div>A</div><div>Toggle Auto</div>
      <div>C</div><div>Toggle Auto-Choose</div>
      <div>F</div><div>Toggle Skip Transitions</div>
      <div>G</div><div>Gallery</div>
      <div>B</div><div>Backlog</div>
      <div>S</div><div>Saves panel</div>
      <div>P</div><div>Settings</div>
      <div>M</div><div>Music Play/Pause</div>
      <div>Ctrl+S</div><div>Quick Save</div>
      <div>Ctrl+L</div><div>Quick Load</div>
      <div>Ctrl+1/2/3</div><div>Save to slot 1/2/3</div>
      <div>Alt+1/2/3</div><div>Load slot 1/2/3</div>
      <div>Esc</div><div>Close open panels</div>
      <div>?</div><div>Toggle this help</div>
    </div>
  `
  document.body.appendChild(div)
  hotkeyHelpEl = div
  ;(div.querySelector('#hkClose') as HTMLButtonElement).onclick = ()=> toggleHotkeyHelp()
}

function closePanels(){
  galleryPanel.style.display = 'none'
  achPanel.style.display = 'none'
  codexPanel.style.display = 'none'
  backlogPanel.style.display = 'none'
  settingsPanel.style.display = 'none'
  savesPanel.style.display = 'none'
  if(hotkeyHelpEl) toggleHotkeyHelp()
  updateBackdrop()
  releaseFocusTrap()
}

function focusChoiceButton(idx: number){
  if(choiceButtons.length === 0) return
  const clamped = Math.max(0, Math.min(choiceButtons.length - 1, idx))
  choiceFocusIndex = clamped
  choiceButtons.forEach((btn, i)=>{
    if(i === clamped){
      btn.focus()
      btn.dataset.focused = 'true'
      btn.style.outline = '2px solid #a0e7ff'
      btn.style.outlineOffset = '0'
    } else {
      btn.dataset.focused = 'false'
      btn.style.outline = ''
    }
  })
}

function handleChoiceKeyNav(e: KeyboardEvent): boolean {
  if(choiceButtons.length === 0) return false
  const moveNext = e.key === 'ArrowDown' || e.key === 'ArrowRight'
  const movePrev = e.key === 'ArrowUp' || e.key === 'ArrowLeft'
  if(moveNext){ e.preventDefault(); focusChoiceButton(choiceFocusIndex + 1); return true }
  if(movePrev){ e.preventDefault(); focusChoiceButton(choiceFocusIndex - 1); return true }
  if(e.key === 'Home'){ e.preventDefault(); focusChoiceButton(0); return true }
  if(e.key === 'End'){ e.preventDefault(); focusChoiceButton(choiceButtons.length - 1); return true }
  if(e.key === 'Enter' || e.key === ' '){
    e.preventDefault()
    const btn = choiceButtons[choiceFocusIndex]
    if(btn) btn.click()
    return true
  }
  return false
}

document.addEventListener('keydown', (e: KeyboardEvent)=>{
  if(!prefs.hotkeysEnabled) return
  if(isTypingTarget(e.target)) return
  if(choiceButtons.length > 0){
    if(handleChoiceKeyNav(e)) return
    // When a choice is open, avoid triggering global navigation
  }
  // Help
  if((e.key === '?' ) || (e.key === '/' && e.shiftKey)) { e.preventDefault(); toggleHotkeyHelp(); return }
  // Close
  if(e.key === 'Escape'){ closePanels(); return }
  // Next
  if(e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight'){
    e.preventDefault()
    try{ nextBtn.click() }catch{}
    return
  }
  switch(e.key.toLowerCase()){
    case 'a': { e.preventDefault(); autoBtn.click(); break }
    case 'c': { e.preventDefault(); autoChooseBtn.click(); break }
    case 'f': { e.preventDefault(); skipFxBtn.click(); break }
    case 'g': { e.preventDefault(); toggle(galleryPanel, renderGallery); break }
    case 'b': { e.preventDefault(); toggle(backlogPanel, renderBacklog); break }
    case 's': { if(!e.ctrlKey && !e.metaKey && !e.altKey){ e.preventDefault(); toggle(savesPanel, renderSaves); } break }
    case 'p': { e.preventDefault(); toggle(settingsPanel, refreshSettingsUI); break }
    case 'm': { e.preventDefault(); isPlaying ? Jukebox.pause() : Jukebox.play(engine.getPublicState().music||'demo-track'); break }
    case 'l': { if(e.ctrlKey || e.metaKey){ e.preventDefault(); loadBtn.click() } break }
  }
  // Quick save
  if(e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); saveBtn.click(); return }
  // Slot saves/loads
  if(['1','2','3'].includes(e.key)){
    const n = parseInt(e.key, 10)
    if(e.ctrlKey || e.metaKey){ e.preventDefault(); saveToSlot(n); return }
    if(e.altKey){ e.preventDefault(); loadFromSlot(n); return }
  }
})

// Clicking the dim backdrop closes panels
backdropEl.addEventListener('click', ()=> closePanels())

// Click-to-advance on stage (mobile-friendly). If panels open, clicks outside content close them.
stageEl.addEventListener('click', (e)=>{
  const path = (e.composedPath ? (e.composedPath() as any[]) : []) as HTMLElement[]
  const isIn = (id:string)=> path.some(el=> (el as any).id === id)
  if(anyPanelOpen()){
    if(!isIn('content')){ closePanels(); return }
    return
  }
  if(isIn('content')||isIn('galleryPanel')||isIn('achPanel')||isIn('codexPanel')||isIn('backlogPanel')||isIn('settingsPanel')||isIn('savesPanel')) return
  if(choicesEl.childElementCount>0) return
  if(nextBtn.style.display==='none') return
  nextBtn.click()
})

// Swipe-to-advance (mobile-friendly). Right/left swipe triggers next; ignore when panels open or choices shown.
let touchStartX = 0, touchStartY = 0, touchTime = 0
const SWIPE_THRESHOLD_PX = 40
const SWIPE_MAX_TIME_MS = 600
stageEl.addEventListener('touchstart', (e: TouchEvent)=>{
  if(anyPanelOpen()) return
  if(e.touches.length !== 1) return
  const t = e.touches[0]
  touchStartX = t.clientX; touchStartY = t.clientY; touchTime = Date.now()
})
stageEl.addEventListener('touchend', (e: TouchEvent)=>{
  if(anyPanelOpen()) return
  if(choicesEl.childElementCount>0) return
  const dt = Date.now() - touchTime
  if(dt > SWIPE_MAX_TIME_MS) return
  const t = e.changedTouches[0]
  const dx = t.clientX - touchStartX
  const dy = t.clientY - touchStartY
  if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD_PX){
    // treat as next
    if(nextBtn.style.display==='none') return
    nextBtn.click()
  }
})

// -----------------------------
// Focus trap within open panels for accessibility
// -----------------------------
let _focusTrapEl: HTMLElement | null = null
let _prevFocusEl: HTMLElement | null = null
let _focusTrapHandler: ((e: KeyboardEvent)=>void) | null = null

function trapFocusIn(el: HTMLElement){
  releaseFocusTrap()
  _focusTrapEl = el
  _prevFocusEl = (document.activeElement as HTMLElement) || null
  const focusables = getFocusable(el)
  if(focusables.length){ focusables[0].focus() }
  _focusTrapHandler = (e: KeyboardEvent)=>{
    if(e.key !== 'Tab' || !_focusTrapEl) return
    const list = getFocusable(_focusTrapEl)
    if(list.length === 0) return
    const first = list[0], last = list[list.length-1]
    if(e.shiftKey){
      if(document.activeElement === first){ e.preventDefault(); last.focus() }
    } else {
      if(document.activeElement === last){ e.preventDefault(); first.focus() }
    }
  }
  document.addEventListener('keydown', _focusTrapHandler)
}

function releaseFocusTrap(){
  if(_focusTrapHandler){ document.removeEventListener('keydown', _focusTrapHandler) }
  _focusTrapHandler = null
  _focusTrapEl = null
  try{ _prevFocusEl?.focus() }catch{}
  _prevFocusEl = null
}

function getFocusable(root: HTMLElement): HTMLElement[]{
  const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  const arr = Array.from(root.querySelectorAll<HTMLElement>(sel))
  return arr.filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1 && el.offsetParent !== null)
}

// Friendly one-time nudge to discover hotkeys
function oneTimeHint(id: string, message: string){
  try{
    const key = `aurora:minimal:hint:${id}`
    if(localStorage.getItem(key)) return
    const host = notifications || document.body
    const div = document.createElement('div')
    div.textContent = message
    div.style.position = notifications? 'relative' : 'fixed'
    if(!notifications){ div.style.right = '12px'; div.style.bottom = '12px' }
    div.style.background = '#0b172a'
    div.style.border = '1px solid #1e293b'
    div.style.color = '#a0e7ff'
    div.style.padding = '6px 8px'
    div.style.marginTop = '6px'
    div.style.borderRadius = '6px'
    div.style.fontSize = '12px'
    div.style.boxShadow = '0 6px 14px rgba(0,0,0,.5)'
    div.style.zIndex = '9999'
    host.appendChild(div)
    setTimeout(()=>{ try{ div.remove() }catch{} }, 5000)
    localStorage.setItem(key, '1')
  }catch{}
}

oneTimeHint('hotkeys', 'Tip: Press ? for shortcuts ÔÇö Space/Enter: Next, A: Auto, Ctrl+S: Save')

// Shortcuts button opens overlay
openShortcutsBtn.onclick = () => toggleHotkeyHelp()

// Add helpful tooltips to controls (also advertise hotkeys)
function setControlTitles(){
  continueBtn.title = 'Continue last autosave'
  startExampleBtn.title = 'Load example scenes'
  startExpressionsBtn.title = 'Load expressions demo'
  autoBtn.title = 'Toggle Auto (A)'
  autoChooseBtn.title = 'Toggle Auto-Choose (C)'
  skipFxBtn.title = 'Toggle Skip Transitions (F)'
  openGalleryBtn.title = 'Open Gallery (G)'
  openAchBtn.title = 'Open Achievements'
  openCodexBtn.title = 'Open Codex'
  openSettingsBtn.title = 'Open Settings (P)'
  openBacklogBtn.title = 'Open Backlog (B)'
  openSavesBtn.title = 'Open Saves (S)'
  openShortcutsBtn.title = 'Show Shortcuts (?)'
  nextBtn.title = 'Next (Space / Enter / ÔåÆ)'
  saveBtn.title = 'Quick Save (Ctrl+S)'
  loadBtn.title = 'Quick Load (Ctrl+L)'
  musicPlayBtn.title = 'Play music (M)'
  musicPauseBtn.title = 'Pause music (M)'
  slot1save.title = 'Save to Slot 1 (Ctrl+1)'
  slot2save.title = 'Save to Slot 2 (Ctrl+2)'
  slot3save.title = 'Save to Slot 3 (Ctrl+3)'
  slot1load.title = 'Load Slot 1 (Alt+1)'
  slot2load.title = 'Load Slot 2 (Alt+2)'
  slot3load.title = 'Load Slot 3 (Alt+3)'
}
setControlTitles()

// Friendly tap hint on mobile (once)
function isProbablyMobile(){ return (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || window.innerWidth < 640 }
if(isProbablyMobile()) oneTimeHint('tap', 'Tip: Tap anywhere on the scene to advance')

// -----------------------------
// AI Panel wiring
// -----------------------------
const aiScriptEl = document.getElementById('aiScript') as HTMLTextAreaElement | null
const aiPromptEl = document.getElementById('aiPrompt') as HTMLTextAreaElement | null
const aiOutputEl = document.getElementById('aiOutput') as HTMLTextAreaElement | null
const aiStatusEl = document.getElementById('aiStatus') as HTMLDivElement | null
const btnAiConvert = document.getElementById('aiConvert') as HTMLButtonElement | null
const btnAiFixGrammar = document.getElementById('aiFixGrammar') as HTMLButtonElement | null
const btnAiDetectErrors = document.getElementById('aiDetectErrors') as HTMLButtonElement | null
const btnAiGenerateScene = document.getElementById('aiGenerateScene') as HTMLButtonElement | null
const btnAiExtendDialogue = document.getElementById('aiExtendDialogue') as HTMLButtonElement | null
const btnAiSuggestBranches = document.getElementById('aiSuggestBranches') as HTMLButtonElement | null
const btnAiLoadOutput = document.getElementById('aiLoadOutput') as HTMLButtonElement | null

function setAIStatus(msg: string, kind: 'info'|'error'='info'){
  if(!aiStatusEl) return
  aiStatusEl.textContent = msg
  aiStatusEl.style.color = kind === 'error' ? '#ffb4b4' : '#a8b0ff'
}
async function runLocal(fn: ()=>Promise<string>){
  try{ setAIStatus('Running local model...'); const out = await fn(); if(aiOutputEl) aiOutputEl.value = out; setAIStatus('Done (local)'); showToast('[AI] local completed') }catch(e:any){ setAIStatus('Local error: '+(e?.message||e), 'error'); showErrorOverlay('Local AI error', e?.message||String(e)) }
}
async function runRemote(fn: ()=>Promise<string>){
  try{ setAIStatus('Calling remote API...'); const out = await fn(); if(aiOutputEl) aiOutputEl.value = out; setAIStatus('Done (remote)'); showToast('[AI] remote completed') }catch(e:any){ setAIStatus('Remote error: '+(e?.message||e), 'error'); showErrorOverlay('Remote AI error', e?.message||String(e)) }
}
btnAiConvert && (btnAiConvert.onclick = ()=>{
  if(prefs.aiMode !== 'local'){ setAIStatus('Switch AI Mode to Local first','error'); return }
  const script = aiScriptEl?.value || ''
  if(!script.trim()){ setAIStatus('Enter script text','error'); return }
  runLocal(()=> aiConvertScriptToJSON(script))
})
btnAiFixGrammar && (btnAiFixGrammar.onclick = ()=>{
  if(prefs.aiMode !== 'local'){ setAIStatus('Switch AI Mode to Local first','error'); return }
  const text = aiScriptEl?.value || ''
  if(!text.trim()){ setAIStatus('Enter text to fix','error'); return }
  runLocal(()=> aiFixGrammar(text))
})
btnAiDetectErrors && (btnAiDetectErrors.onclick = ()=>{
  if(prefs.aiMode !== 'local'){ setAIStatus('Switch AI Mode to Local first','error'); return }
  const json = aiScriptEl?.value || ''
  if(!json.trim()){ setAIStatus('Paste scene JSON to lint','error'); return }
  runLocal(()=> aiDetectSceneErrors(json))
})
btnAiGenerateScene && (btnAiGenerateScene.onclick = ()=>{
  if(prefs.aiMode !== 'byok'){ setAIStatus('Switch AI Mode to BYOK and set key','error'); return }
  if(!prefs.aiApiKey){ setAIStatus('Enter API key','error'); return }
  const prompt = aiPromptEl?.value || ''
  if(!prompt.trim()){ setAIStatus('Enter prompt','error'); return }
  runRemote(()=> aiGenerateScene(prompt))
})
btnAiExtendDialogue && (btnAiExtendDialogue.onclick = ()=>{
  if(prefs.aiMode !== 'byok'){ setAIStatus('Switch AI Mode to BYOK and set key','error'); return }
  if(!prefs.aiApiKey){ setAIStatus('Enter API key','error'); return }
  const prompt = aiPromptEl?.value || ''
  if(!prompt.trim()){ setAIStatus('Enter prompt','error'); return }
  const scene = engine.getPublicState()?.sceneId ? engine.exportScenes()?.find((s:any)=> s.id === engine.getPublicState().sceneId) : null
  runRemote(()=> aiExtendDialogue(scene, prompt))
})
btnAiSuggestBranches && (btnAiSuggestBranches.onclick = ()=>{
  if(prefs.aiMode !== 'byok'){ setAIStatus('Switch AI Mode to BYOK and set key','error'); return }
  if(!prefs.aiApiKey){ setAIStatus('Enter API key','error'); return }
  const scene = engine.getPublicState()?.sceneId ? engine.exportScenes()?.find((s:any)=> s.id === engine.getPublicState().sceneId) : null
  runRemote(()=> aiSuggestBranches(scene))
})
btnAiLoadOutput && (btnAiLoadOutput.onclick = ()=>{
  const raw = aiOutputEl?.value || ''
  if(!raw.trim()){ setAIStatus('Output empty','error'); return }
  try{
    const parsed = JSON.parse(raw)
    if(Array.isArray(parsed)){
      bootFromScenes(parsed as any)
      setAIStatus('Loaded output JSON into engine')
    } else if(parsed && parsed.scenes){
      bootFromScenes(parsed.scenes as any)
      setAIStatus('Loaded output JSON (wrapped)')
    } else {
      setAIStatus('JSON is not an array of scenes','error')
    }
  }catch(e:any){ setAIStatus('Parse error: '+(e?.message||e),'error') }
})

// -----------------------------
// Onboarding modal ÔÇö show once on first run
// -----------------------------
function showOnboarding(){ if(onboardingEl){ onboardingEl.style.display = 'flex'; trapFocusIn(onboardingEl) } }
function hideOnboarding(){ if(onboardingEl){ onboardingEl.style.display = 'none'; releaseFocusTrap() } }
function markOnboarded(){ try{ localStorage.setItem('aurora:minimal:onboarded','1') }catch{} }
function shouldShowOnboarding(): boolean { try{ return !localStorage.getItem('aurora:minimal:onboarded') }catch{ return true } }

if(shouldShowOnboarding()) showOnboarding()
onbDismissBtn.onclick = ()=>{ hideOnboarding(); markOnboarded() }
onbStartBtn.onclick = ()=>{ hideOnboarding(); markOnboarded(); startExampleBtn.click() }
onbShortcutsBtn.onclick = ()=>{ hideOnboarding(); markOnboarded(); toggleHotkeyHelp() }
onbSettingsBtn.onclick = ()=>{ hideOnboarding(); markOnboarded(); openSettingsBtn.click() }

// Drag-and-drop assets helper (non-coder friendly)
if(assetDrop){
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.multiple = true
  fileInput.accept = 'image/*,audio/*'
  fileInput.onchange = ()=>{ if(fileInput.files) addLocalAssets(fileInput.files) }
  if(assetPick){ assetPick.onclick = ()=> fileInput.click() }
  assetDrop.addEventListener('dragover', (e)=>{ e.preventDefault(); assetDrop.style.borderColor = '#3e59ff' })
  assetDrop.addEventListener('dragleave', ()=>{ assetDrop.style.borderColor = '#27304a' })
  assetDrop.addEventListener('drop', (e)=>{
    e.preventDefault()
    assetDrop.style.borderColor = '#27304a'
    const dt = e.dataTransfer
    if(dt && dt.files && dt.files.length){
      addLocalAssets(dt.files)
    }
  })
  renderAssets()
}
// Custom scene loader (paste JSON, strict validation)
if(customLoadBtn && customJsonInput){
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'application/json'
  fileInput.onchange = async ()=> {
    const f = fileInput.files?.[0]
    if(!f) return
    try{
      const txt = await f.text()
      customJsonInput.value = txt
      customErrors!.textContent = `Loaded ${f.name}`
    }catch(e:any){
      customErrors!.textContent = 'Failed to read file: '+ (e?.message||e)
    }
  }
  if(customFileBtn){ customFileBtn.onclick = ()=> fileInput.click() }
  customLoadBtn.onclick = ()=>{
    const json = customJsonInput.value || ''
    if(!json.trim()){ customErrors!.textContent = 'Paste scene JSON first.'; return }
    let parsed: any
    try{ parsed = JSON.parse(json) }catch(e:any){ customErrors!.textContent = 'JSON parse error: '+ (e?.message||e); return }
  try{
    const { scenes, errors } = loadScenesFromJsonStrict(json)
    const linkIssues = scenes ? validateSceneLinksStrict(scenes as any) : []
    const issues = [...(errors||[]), ...(linkIssues||[])]
    if(issues.length){
      const details = issues.map((i:any)=> `[${i.code}] ${i.path} :: ${i.message}`).join('\n')
      customErrors!.textContent = details
      showErrorOverlay('Custom scene validation failed', details)
      return
    }
    const startId = (customStartIdInput?.value?.trim()) || (scenes[0]?.id || 'intro')
    customErrors!.textContent = `Loaded ${scenes.length} scene(s). Starting at ${startId}.`
    bootFromScenes(scenes as any, startId)
  }catch(e:any){
    const msg = 'Validation failed: '+ (e?.message||e)
    customErrors!.textContent = msg
    showErrorOverlay('Custom scene load failed', msg)
  }
  }
  if(customLintBtn){
    customLintBtn.onclick = ()=>{
      const json = customJsonInput?.value || ''
      if(!json.trim()){ customErrors!.textContent = 'Paste scene JSON first.'; return }
      try{
        const { scenes, errors } = loadScenesFromJsonStrict(json)
        const linkIssues = scenes ? validateSceneLinksStrict(scenes as any) : []
        const issues = [...(errors||[]), ...(linkIssues||[])]
        const details = issues.length ? issues.map((i:any)=> `[${i.code}] ${i.path} :: ${i.message}`).join('\n') : 'Lint OK'
        customErrors!.textContent = details
        showErrorOverlay('Custom JSON lint', details)
      }catch(e:any){
        const msg = 'Lint failed: '+ (e?.message||e)
        customErrors!.textContent = msg
        showErrorOverlay('Custom JSON lint failed', msg)
      }
    }
  }
}

// AI helpers (generation + grammar) with validation before load
function setAIStatus(msg: string){
  if(aiStatus) aiStatus.textContent = msg
}

function validateSceneJsonText(json: string){
  try{
    const { scenes, errors } = loadScenesFromJsonStrict(json)
    const linkIssues = scenes ? validateSceneLinksStrict(scenes as any) : []
    const issues = [...(errors||[]), ...(linkIssues||[])]
    if(issues.length){
      const details = issues.map((i:any)=> `[${i.code}] ${i.path} :: ${i.message}`).join('\n')
      return { ok:false, scenes:[], message: details }
    }
    return { ok:true, scenes, message:`Valid (${scenes.length} scene${scenes.length===1?'':'s'})` }
  }catch(e:any){
    return { ok:false, scenes:[], message: 'Validation failed: '+(e?.message||e) }
  }
}

function applyScenesToEditor(scenes: any[]){
  if(!scenes?.length) return
  editorScenes = {}
  for(const sc of scenes as any[]){
    if(!sc?.id) continue
    editorScenes[sc.id] = { id: sc.id, bg: sc.bg, music: sc.music, roles: sc.roles, steps: Array.isArray(sc.steps)? sc.steps : [] }
  }
  activeSceneId = scenes[0].id || 'custom'
  loadSceneToForm(activeSceneId)
  renderEditorSteps()
  renderEditorPreview()
}

async function streamOpenAI(apiKey: string, messages: {role:string; content:string}[], onChunk: (text:string)=>void){
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`Bearer ${apiKey}`
    },
    body: JSON.stringify({ model:'gpt-4o-mini', stream:true, temperature:0.2, messages })
  })
  if(!resp.body) throw new Error('No response body')
  const reader = resp.body.getReader()
  const decoder = new TextDecoder()
  let acc = ''
  while(true){
    const { value, done } = await reader.read()
    if(done) break
    const chunk = decoder.decode(value, { stream:true })
    const lines = chunk.split('\n').map(l=> l.trim()).filter(Boolean)
    for(const line of lines){
      if(!line.startsWith('data:')) continue
      const payload = line.replace('data:','').trim()
      if(payload === '[DONE]') continue
      try{
        const parsed = JSON.parse(payload)
        const delta = parsed?.choices?.[0]?.delta?.content
        if(delta){
          acc += delta
          onChunk(delta)
        }
      }catch{
        // ignore parse errors on partial chunks
      }
    }
  }
  return acc
}

async function aiGenerate(toEditor: boolean){
  if(!aiPromptInput){ setAIStatus('No prompt input'); return }
  const prompt = aiPromptInput.value.trim()
  if(!prompt){ setAIStatus('Enter a prompt first.'); return }
  setAIStatus('Preparing model...')
  try{
    const mode = (prefs.aiMode === 'byok' ? 'byok' : 'local')
    const adapter = await getAIAdapters(mode as any, prefs.aiApiKey || '', {
      provider: (prefs.aiProvider as any) || 'openai',
      baseURL: prefs.aiBaseUrl || undefined,
      model: prefs.aiModel || undefined,
      localModel: prefs.aiLocalModel || undefined
    })
    let text = ''
    if(mode === 'byok' && prefs.aiApiKey){
      // stream remote for faster feedback
      if(customJsonInput) customJsonInput.value = ''
      text = await streamOpenAI(prefs.aiApiKey, [
        { role:'system', content:'You are an AuroraEngine authoring assistant. Output Aurora scene JSON only.' },
        { role:'user', content: prompt }
      ], chunk=>{
        if(customJsonInput) customJsonInput.value += chunk
        setAIStatus(`Receiving... ${customJsonInput?.value.length || 0} chars`)
      })
    } else if(adapter.local){
      text = await adapter.local.convertScriptToJSON(prompt)
    } else if(adapter.remote){
      text = await adapter.remote.generateScene(prompt)
    } else {
      throw new Error('No AI adapter available')
    }
    if(customJsonInput) customJsonInput.value = text
    const res = validateSceneJsonText(text)
    customErrors!.textContent = res.message
    if(res.ok){
      showErrorOverlay('AI generation', res.message)
      if(toEditor){
        applyScenesToEditor(res.scenes as any)
      }
    } else {
      showErrorOverlay('AI generation errors', res.message)
    }
  }catch(e:any){
    const msg = e?.message || String(e)
    setAIStatus('Error: '+msg)
    showErrorOverlay('AI generation failed', msg)
  }
}

async function aiFixGrammar(){
  if(!aiPromptInput || !customJsonInput){ setAIStatus('No prompt or text'); return }
  const text = customJsonInput.value.trim() || aiPromptInput.value.trim()
  if(!text){ setAIStatus('Paste text to fix.'); return }
  setAIStatus('Fixing grammar...')
  try{
    const mode = (prefs.aiMode === 'byok' ? 'byok' : 'local')
    const adapter = await getAIAdapters(mode as any, prefs.aiApiKey || '', {
      provider: (prefs.aiProvider as any) || 'openai',
      baseURL: prefs.aiBaseUrl || undefined,
      model: prefs.aiModel || undefined,
      localModel: prefs.aiLocalModel || undefined
    })
    let fixed = ''
    if(mode === 'byok' && adapter.remote){
      fixed = await adapter.remote.extendDialogue({}, `Fix grammar:\n${text}`)
    } else if(adapter.local){
      fixed = await adapter.local.fixGrammar(text)
    } else {
      throw new Error('No AI adapter available')
    }
    customJsonInput.value = fixed
    setAIStatus('Grammar fixed.')
  }catch(e:any){
    const msg = e?.message || String(e)
    setAIStatus('Error: '+msg)
    showErrorOverlay('AI grammar fix failed', msg)
  }
}

if(aiGenerateBtn){ aiGenerateBtn.onclick = ()=> aiGenerate(false) }
if(aiGenerateToEditorBtn){ aiGenerateToEditorBtn.onclick = ()=> aiGenerate(true) }
if(aiFixBtn){ aiFixBtn.onclick = ()=> aiFixGrammar() }

// Lightweight scene editor (browser-only helper)
function renderEditorPreview(){
  if(!editorPreview) return
  editorScenes[activeSceneId] = {
    id: editorSceneId?.value?.trim() || 'custom',
    bg: editorBg?.value?.trim() || undefined,
    music: editorMusic?.value?.trim() || undefined,
    steps: editorSteps.slice(),
    roles: (()=> {
      try{
        const rolesRaw = editorSceneRoles?.value?.trim()
        if(!rolesRaw) return undefined
        const parsed = JSON.parse(rolesRaw)
        if(typeof parsed === 'object' && parsed) return parsed
        if(editorErrors) editorErrors.textContent = 'Roles must be a JSON object'
      }catch(e:any){
        if(editorErrors) editorErrors.textContent = 'Roles JSON parse error: '+ (e?.message||e)
      }
      return undefined
    })()
  }
  const bundleIds = (editorBundleIds?.value || '').split(',').map(s=> s.trim()).filter(Boolean)
  const { scenes, issues } = buildEditorScenesBundle()
  editorPreview.textContent = JSON.stringify(scenes || [], null, 2)
  if(issues.length && editorErrors){
    editorErrors.textContent = issues.map(i=> `[${i.code}] ${i.path} :: ${i.message}`).join('\n')
  }
  if(!issues.length){
    renderBranchMap(scenes || [])
  } else {
    renderBranchMap([])
  }
  try{
    const state = {
      active: activeSceneId,
      scenes: editorScenes,
      bundle: editorBundleIds?.value || ''
    }
    localStorage.setItem(EDITOR_STATE_KEY, JSON.stringify(state))
  }catch{}
}

function renderEditorSteps(){
  if(!editorStepsEl) return
  editorStepsEl.innerHTML = ''
  if(editorSteps.length === 0){
    const div = document.createElement('div')
    div.textContent = 'No steps yet. Add dialogue/choice/sprite/background.'
    div.style.color = '#a8b0ff'
    div.style.fontSize = '12px'
    editorStepsEl.appendChild(div)
    return
  }
  editorSteps.forEach((st, idx)=>{
    const row = document.createElement('div')
    row.style.background = '#111827'
    row.style.border = '1px solid #27304a'
    row.style.borderRadius = '6px'
    row.style.padding = '6px 8px'
    row.style.color = '#a8b0ff'
    row.style.fontSize = '12px'
    row.textContent = `#${idx} ${st.type} ${st.text||st.src||''} ${st.goto? '-> '+st.goto:''}`
    const actions = document.createElement('div')
    actions.style.display = 'inline-flex'
    actions.style.gap = '6px'
    actions.style.marginLeft = '8px'
    const up = document.createElement('button')
    up.className = 'secondary'
    up.textContent = '↑'
    up.disabled = idx === 0
    up.onclick = ()=>{ [editorSteps[idx-1], editorSteps[idx]] = [editorSteps[idx], editorSteps[idx-1]]; renderEditorSteps(); renderEditorPreview() }
    const down = document.createElement('button')
    down.className = 'secondary'
    down.textContent = '↓'
    down.disabled = idx === editorSteps.length-1
    down.onclick = ()=>{ [editorSteps[idx+1], editorSteps[idx]] = [editorSteps[idx], editorSteps[idx+1]]; renderEditorSteps(); renderEditorPreview() }
    const edit = document.createElement('button')
    edit.className = 'secondary'
    edit.textContent = 'Edit'
    edit.onclick = ()=>{
      const current = JSON.stringify(st, null, 2)
      const next = prompt('Edit step JSON', current)
      if(!next) return
      try{
        const parsed = JSON.parse(next)
        editorSteps[idx] = parsed
        renderEditorSteps()
        renderEditorPreview()
      }catch(e:any){
        if(editorErrors) editorErrors.textContent = 'Edit failed: '+ (e?.message||e)
      }
    }
    const del = document.createElement('button')
    del.className = 'secondary'
    del.textContent = 'Delete'
    del.onclick = ()=>{ editorSteps.splice(idx,1); renderEditorSteps(); renderEditorPreview() }
    actions.appendChild(up)
    actions.appendChild(down)
    actions.appendChild(edit)
    actions.appendChild(del)
    row.appendChild(actions)
    editorStepsEl.appendChild(row)
  })
}

function buildEditorScenesBundle(){
  const sceneId = editorSceneId?.value?.trim() || 'custom'
  const bundleIds = (editorBundleIds?.value || '').split(',').map(s=> s.trim()).filter(Boolean)
  const scenes: EditorScene[] = []
  const base: any = { id: sceneId, bg: editorBg?.value?.trim() || undefined, music: editorMusic?.value?.trim() || undefined, steps: editorSteps.slice() }
  try{
    const rolesRaw = editorSceneRoles?.value?.trim()
    if(rolesRaw) base.roles = JSON.parse(rolesRaw)
  }catch(e:any){
    return { scenes: [], issues: [{ code:'roles.invalid_json', path:'roles', message: e?.message||'Invalid roles JSON' } as any] }
  }
  scenes.push(base)
  for(const extra of bundleIds){
    if(extra && extra !== sceneId){
      scenes.push({ id: extra, steps: [] })
    }
  }
  const json = JSON.stringify(scenes)
  const { scenes: parsed, errors } = loadScenesFromJsonStrict(json)
  const issues = [...(errors||[]), ...validateSceneLinksStrict(parsed)]
  return { scenes: parsed as any[], issues, sceneId }
}

function renderBranchMap(scenes: EditorScene[]){
  if(!branchMap){
    return
  }
  branchMap.innerHTML = ''
  if(!scenes || scenes.length === 0){
    const p = document.createElement('div')
    p.textContent = 'Add scenes to visualize branching.'
    p.style.color = '#a8b0ff'
    branchMap.appendChild(p)
    if(branchMapGraph) branchMapGraph.innerHTML = ''
    return
  }
  const { edges, sceneIds: ids } = computeBranchEdges(scenes)
  const brokenCount = edges.filter(e=> !ids.has(e.to)).length
  if(brokenCount > 0){
    const warn = document.createElement('div')
    warn.style.color = '#fca5a5'
    warn.style.fontWeight = '600'
    warn.textContent = `Broken links: ${brokenCount} target(s) missing`
    branchMap.appendChild(warn)
  }
  const list = document.createElement('div')
  list.style.display = 'flex'
  list.style.flexDirection = 'column'
  list.style.gap = '6px'
  ids.forEach(id=>{
    const row = document.createElement('div')
    row.style.display = 'flex'
    row.style.flexWrap = 'wrap'
    row.style.gap = '6px'
    const targets = edges.filter(e=> e.from === id)
    const hasUnknown = targets.some(t=> !ids.has(t.to))
    const badge = hasUnknown ? `<span style="color:#fca5a5; font-weight:600;">(broken link)</span>` : ''
    row.innerHTML = `<strong style="color:#a0e7ff">${id}</strong> → ${targets.length ? targets.map(t=> `${t.to} (${t.via})`).join(', ') : '—'} ${badge}`
    branchMap.appendChild(row)
  })
  renderBranchMapGraph(Array.from(ids), edges)
  ar: {
    settings: ()=> 'الإعدادات',
    close: ()=> 'إغلاق',
    backlog: ()=> 'السجل',
    gallery: ()=> 'المعرض',
    achievements: ()=> 'الإنجازات',
    auto: (c:{on:boolean})=> `تقدم تلقائي: ${c.on? 'نعم':'لا'}`,
    autoChoose: (c:{on:boolean})=> `اختيار تلقائي: ${c.on? 'نعم':'لا'}`,
    skipFx: (c:{on:boolean})=> `تخطي المؤثرات: ${c.on? 'نعم':'لا'}`,
    skipSeen: (c:{on:boolean})=> `تخطي النص السابق: ${c.on? 'نعم':'لا'}`,
    skipTransitions: (c:{on:boolean})=> `تخطي الانتقالات: ${c.on? 'نعم':'لا'}`,
    debugToasts: (c:{on:boolean})=> `إشعارات تصحيح: ${c.on? 'نعم':'لا'}`,
    debugHud: (c:{on:boolean})=> `لوحة تصحيح: ${c.on? 'نعم':'لا'}`,
    hotkeys: (c:{on:boolean})=> `اختصارات: ${c.on? 'نعم':'لا'}`,
    clearSeen: ()=> 'مسح المشاهدة',
    language: ()=> 'اللغة',
    english: ()=> 'إنجليزي',
    spanish: ()=> 'إسباني',
    slots: ()=> 'الحفظ:',
    saveN: (c:{n:number})=> `حفظ ${c.n}`,
    loadN: (c:{n:number})=> `تحميل ${c.n}`,
  }
}

const TEXT_TABLE: Record<Locale, Record<string, string>> = {
  en: {
    intro_greeting: 'Welcome to AuroraEngine.',
    intro_hint: 'Tap or press space to advance.',
    rtl_welcome: 'RTL/TextId demo: switch language to Arabic and see right-to-left rendering.',
    rtl_hint: 'TextId entries use the locale table. Choices remain LTR for clarity.',
    rtl_done: 'Done. You can switch back to English anytime.'
  },
  es: {
    intro_greeting: 'Bienvenido a AuroraEngine.',
    intro_hint: 'Toque o presione espacio para avanzar.',
    rtl_welcome: 'Demostración RTL/TextId: cambie a árabe y vea la lectura de derecha a izquierda.',
    rtl_hint: 'Las entradas textId usan la tabla de idioma. Las opciones se mantienen LTR por claridad.',
    rtl_done: 'Listo. Puedes volver a inglés cuando quieras.'
  },
  ar: {
    intro_greeting: 'مرحبًا بك في AuroraEngine.',
    intro_hint: 'اضغط للمضي قدمًا.',
    rtl_welcome: 'عرض RTL/معرّفات النص: بدّل للغة العربية وشاهد العرض من اليمين إلى اليسار.',
    rtl_hint: 'تستخدم إدخالات textId جدول اللغة. تظل الاختيارات من اليسار إلى اليمين للوضوح.',
    rtl_done: 'انتهى. يمكنك العودة إلى الإنجليزية في أي وقت.',
    rtl_ar_text: 'لقد اخترت العربية. تم تفعيل الاتجاه RTL.'
  }
}

function renderBranchMapGraph(ids: string[], edges: { from: string; to: string; via: string }[]){
  if(!branchMapGraph) return
  branchMapGraph.innerHTML = ''
  const width = Math.max(branchMapGraph.clientWidth || 0, 560)
  const height = 320
  const radius = Math.min(width, height)/2 - 48
  const cx = width/2
  const cy = height/2
  const positions: Record<string, {x:number;y:number}> = {}
  ids.forEach((id, idx)=>{
    const angle = (Math.PI * 2 * idx) / Math.max(ids.length, 1)
    positions[id] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    }
  })
  const svgNS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('width', `${width}`)
  svg.setAttribute('height', `${height}`)
  svg.style.display = 'block'
  svg.style.background = '#0b1020'
  // edges
  edges.forEach(e=>{
    const from = positions[e.from]
    const to = positions[e.to]
    if(!from || !to) return
    const line = document.createElementNS(svgNS, 'line')
    line.setAttribute('x1', `${from.x}`)
    line.setAttribute('y1', `${from.y}`)
    line.setAttribute('x2', `${to.x}`)
    line.setAttribute('y2', `${to.y}`)
    line.setAttribute('stroke', ids.includes(e.to) ? '#4f6bff' : '#fca5a5')
    line.setAttribute('stroke-width', '2')
    const title = document.createElementNS(svgNS, 'title')
    title.textContent = `${e.from} → ${e.to} (${e.via})`
    svg.appendChild(line)
    line.appendChild(title)
  })
  // nodes
  ids.forEach(id=>{
    const pos = positions[id]
    const circle = document.createElementNS(svgNS, 'circle')
    circle.setAttribute('cx', `${pos.x}`)
    circle.setAttribute('cy', `${pos.y}`)
    circle.setAttribute('r', '16')
    circle.setAttribute('fill', '#1f2937')
    circle.setAttribute('stroke', '#4f6bff')
    circle.setAttribute('stroke-width', '2')
    const title = document.createElementNS(svgNS, 'title')
    title.textContent = id
    circle.appendChild(title)
    svg.appendChild(circle)
    const text = document.createElementNS(svgNS, 'text')
    text.setAttribute('x', `${pos.x}`)
    text.setAttribute('y', `${pos.y + 4}`)
    text.setAttribute('fill', '#a0e7ff')
    text.setAttribute('font-size', '10')
    text.setAttribute('font-family', 'monospace')
    text.setAttribute('text-anchor', 'middle')
    text.textContent = id
    svg.appendChild(text)
  })
  branchMapGraph.appendChild(svg)
}

function editorAdd(){
  const type = editorStepType?.value || 'dialogue'
  if(editorErrors) editorErrors.textContent = ''
  if(type === 'dialogue'){
    const text = editorText?.value?.trim() || ''
    if(!text){ editorErrors!.textContent = 'Dialogue needs text'; return }
    editorSteps.push({ type:'dialogue', char: editorChar?.value?.trim() || undefined, text })
  } else if(type === 'choice'){
    const raw = editorOptions?.value || ''
    const opts = raw.split('\n').map(l => l.trim()).filter(Boolean).map(line=>{
      const [label, goto] = line.split('|').map(s=> (s||'').trim())
      return { label, goto }
    }).filter(o => o.label)
    if(!opts.length){ editorErrors!.textContent = 'Add at least one choice option (label|goto)'; return }
    editorSteps.push({ type:'choice', options: opts })
  } else if(type === 'background'){
    const src = editorText?.value?.trim() || ''
    if(!src){ editorErrors!.textContent = 'Background needs src'; return }
    editorSteps.push({ type:'background', src })
  } else if(type === 'spriteShow'){
    const id = editorChar?.value?.trim() || ''
    const src = editorText?.value?.trim() || ''
    if(!id || !src){ editorErrors!.textContent = 'Sprite needs id and src'; return }
    const move = parseMove(editorMove?.value||'')
    if(move === null && (editorMove?.value||'').trim()){
      if(editorErrors) editorErrors.textContent = 'Move format: x=40,y=-10,ms=400,ease=easeOutBack'
      return
    }
    const step:any = { type:'spriteShow', id, src }
    if(move) step.moves = [move]
    editorSteps.push(step)
  } else if(type === 'spriteSwap'){
    const id = editorChar?.value?.trim() || ''
    const src = editorText?.value?.trim() || ''
    if(!id || !src){ editorErrors!.textContent = 'Sprite swap needs id and src'; return }
    const move = parseMove(editorMove?.value||'')
    if(move === null && (editorMove?.value||'').trim()){
      if(editorErrors) editorErrors.textContent = 'Move format: x=40,y=-10,ms=400,ease=easeOutBack'
      return
    }
    const step:any = { type:'spriteSwap', id, src }
    if(move) step.moves = [move]
    editorSteps.push(step)
  } else if(type === 'music'){
    const track = editorText?.value?.trim() || ''
    if(!track){ editorErrors!.textContent = 'Music needs track'; return }
    editorSteps.push({ type:'music', track })
  } else if(type === 'flag'){
    const flag = editorChar?.value?.trim() || ''
    if(!flag){ editorErrors!.textContent = 'Flag step needs flag key'; return }
    const val = editorText?.value?.trim()
    const value = val === 'false' ? false : true
    editorSteps.push({ type:'flag', flag, value })
  } else if(type === 'transition'){
    const kind = (editorText?.value?.trim() || '').toLowerCase()
    if(!TRANSITIONS.includes(kind)){ editorErrors!.textContent = 'Transition kind must be fade|slide|zoom|shake|flash'; return }
    editorSteps.push({ type:'transition', kind })
  }
  if(editorErrors) editorErrors.textContent = ''
  renderEditorSteps()
  renderEditorPreview()
}

if(editorAddStep){ editorAddStep.onclick = editorAdd }
if(editorReset){ editorReset.onclick = ()=>{ editorSteps = []; if(editorErrors) editorErrors.textContent = ''; renderEditorSteps(); renderEditorPreview() } }
if(editorLoad){
  editorLoad.onclick = ()=>{
    const { scenes, issues, sceneId } = buildEditorScenesBundle()
    if(issues.length){
      const msg = issues.map(i=> `[${i.code}] ${i.path} :: ${i.message}`).join('\n')
      if(editorErrors) editorErrors.textContent = msg
      showErrorOverlay('Editor scene validation failed', msg)
      return
    }
    if(editorErrors) editorErrors.textContent = ''
    editorPreview!.textContent = JSON.stringify(scenes, null, 2)
    bootFromScenes(scenes as any, sceneId || 'custom')
  }
}
if(editorDownload){
  editorDownload.onclick = ()=>{
    const { scenes, issues } = buildEditorScenesBundle()
    if(issues.length){
      const msg = issues.map(i=> `[${i.code}] ${i.path} :: ${i.message}`).join('\n')
      if(editorErrors) editorErrors.textContent = msg
      showErrorOverlay('Editor scene validation failed', msg)
      return
    }
    const sceneId = editorSceneId?.value?.trim() || 'custom'
    const json = JSON.stringify(scenes, null, 2)
    const blob = new Blob([json], { type:'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sceneId || 'scene'}.json`
    a.click()
    setTimeout(()=> URL.revokeObjectURL(url), 500)
  }
}
if(editorImport){
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'application/json'
  editorImport.onclick = ()=> fileInput.click()
  fileInput.onchange = async ()=>{
    const f = fileInput.files?.[0]
    if(!f) return
    try{
      const txt = await f.text()
      const parsed = JSON.parse(txt)
      if(!Array.isArray(parsed) || !parsed.length) throw new Error('JSON must be an array of scenes')
      const first: any = parsed[0]
      editorSceneId!.value = first.id || 'custom'
      editorBg!.value = first.bg || ''
      editorMusic!.value = first.music || ''
      editorSceneRoles!.value = first.roles ? JSON.stringify(first.roles) : ''
      const extras = parsed.slice(1).map((s:any)=> s.id).filter(Boolean)
      editorBundleIds!.value = extras.join(', ')
      // If multiple scenes have steps, merge them into the editor list for quick tweaking
      editorScenes = {}
      for(const s of parsed as any[]){
        if(!s.id) continue
        editorScenes[s.id] = { id: s.id, bg: s.bg, music: s.music, roles: s.roles, steps: Array.isArray(s.steps)? s.steps : [] }
      }
      activeSceneId = first.id || 'custom'
      editorSteps = editorScenes[activeSceneId]?.steps || []
      renderEditorSteps()
      renderEditorTabs()
      renderEditorPreview()
      if(editorErrors) editorErrors.textContent = `Imported ${parsed.length} scene(s) from ${f.name}`
    }catch(e:any){
      if(editorErrors) editorErrors.textContent = 'Import failed: '+ (e?.message||e)
    }
  }
}
function hydrateEditorFromStorage(){
  try{
    const raw = localStorage.getItem(EDITOR_STATE_KEY)
    if(!raw) return
    const st = JSON.parse(raw)
    editorScenes = st.scenes || {}
    activeSceneId = st.active || Object.keys(editorScenes)[0] || 'custom'
    const current = editorScenes[activeSceneId] || { id: activeSceneId, steps: [] }
    if(editorSceneId) editorSceneId.value = current.id || 'custom'
    if(editorBg) editorBg.value = current.bg || ''
    if(editorMusic) editorMusic.value = current.music || ''
    if(editorSceneRoles) editorSceneRoles.value = current.roles ? JSON.stringify(current.roles) : ''
    if(editorBundleIds) editorBundleIds.value = st.bundle || ''
    editorSteps = Array.isArray(current.steps) ? current.steps : []
    renderEditorTabs()
    renderEditorSteps()
    renderEditorPreview()
  }catch{}
}
function ensureScene(id: string): EditorScene{
  if(!id.trim()) id = 'custom'
  if(!editorScenes[id]) editorScenes[id] = { id, steps: [] }
  return editorScenes[id]
}

function loadSceneToForm(id: string){
  activeSceneId = id
  const sc = ensureScene(id)
  if(editorSceneId) editorSceneId.value = sc.id
  if(editorBg) editorBg.value = sc.bg || ''
  if(editorMusic) editorMusic.value = sc.music || ''
  if(editorSceneRoles) editorSceneRoles.value = sc.roles ? JSON.stringify(sc.roles) : ''
  editorSteps = Array.isArray(sc.steps) ? sc.steps : []
  renderEditorSteps()
  renderEditorPreview()
  renderEditorTabs()
}

function renderEditorTabs(){
  if(!editorTabs) return
  if(!activeSceneId) activeSceneId = 'custom'
  ensureScene(activeSceneId)
  editorTabs.innerHTML = ''
  const ids = Object.keys(editorScenes)
  if(ids.length === 0) ids.push(activeSceneId)
  ids.forEach(id=>{
    const tab = document.createElement('div')
    tab.style.display = 'flex'
    tab.style.alignItems = 'center'
    tab.style.gap = '4px'
    const btn = document.createElement('button')
    btn.className = 'secondary'
    btn.textContent = id === activeSceneId ? `[${id}]` : id
    btn.style.fontWeight = id === activeSceneId ? '700' : '400'
    btn.onclick = ()=> loadSceneToForm(id)
    tab.appendChild(btn)
    if(ids.length > 1){
      const del = document.createElement('button')
      del.className = 'secondary'
      del.textContent = 'x'
      del.style.padding = '4px 6px'
      del.onclick = (e)=>{
        e.stopPropagation()
        delete editorScenes[id]
        const nextId = Object.keys(editorScenes)[0] || 'custom'
        loadSceneToForm(nextId)
      }
      tab.appendChild(del)
    }
    editorTabs.appendChild(tab)
  })
}

if(editorNewSceneBtn){
  editorNewSceneBtn.onclick = ()=>{
    const name = (prompt('New scene id?','scene_'+(Object.keys(editorScenes).length+1)) || '').trim()
    if(!name) return
    if(editorScenes[name]){ loadSceneToForm(name); return }
    ensureScene(name)
    loadSceneToForm(name)
  }
}

if(editorSaveBtn){
  editorSaveBtn.onclick = ()=>{
    try{
      const state = {
        active: activeSceneId,
        scenes: editorScenes,
        bundle: editorBundleIds?.value || ''
      }
      localStorage.setItem(EDITOR_STATE_KEY, JSON.stringify(state))
      if(editorErrors) editorErrors.textContent = 'Editor state saved locally.'
    }catch(e:any){
      if(editorErrors) editorErrors.textContent = 'Save failed: '+ (e?.message||e)
    }
  }
}

if(editorLoadSavedBtn){
  editorLoadSavedBtn.onclick = ()=>{
    hydrateEditorFromStorage()
    if(editorErrors) editorErrors.textContent = 'Loaded saved editor state (if present).'
  }
}
renderEditorTabs()
hydrateEditorFromStorage()
renderEditorPreview()
renderEditorSteps()

if(codexCategory){
  codexCategory.addEventListener('change', ()=>{
    codexFiltersState = { ...codexFiltersState, category: codexCategory.value, favoritesOnly:false, pinnedOnly:false }
    renderCodex()
  })
}
;(document.getElementById('codexSearch') as HTMLInputElement | null)?.addEventListener('input', ()=> renderCodex())
codexFavBtn.onclick = ()=>{
  if(!codexSelectedEntry) return
  codexToggleFavorite(codexSelectedEntry.id)
  const refreshed = readCodex().find(e=> e.id === codexSelectedEntry!.id) || null
  codexSelectedEntry = refreshed
  refreshCodexDetailActions()
  renderCodex()
}
codexPinBtn.onclick = ()=>{
  if(!codexSelectedEntry) return
  codexTogglePinned(codexSelectedEntry.id)
  const refreshed = readCodex().find(e=> e.id === codexSelectedEntry!.id) || null
  codexSelectedEntry = refreshed
  refreshCodexDetailActions()
  renderCodex()
}

// -----------------------------
// Debug HUD
// -----------------------------
function updateDebugHud(){
  try{
    if(!debugHud) return
    if(!prefs.showDebugHud){ debugHud.style.display='none'; debugHud.innerHTML=''; return }
    const st = engine.getPublicState()
    debugHud.style.display='block'
    const flags = (st.flags||[]) as string[]
    const spriteIds = Object.keys(st.sprites||{})
    const lines: string[] = []
    lines.push(`Scene: ${st.sceneId || 'ÔÇö'} (#${st.index ?? 0})`)
    lines.push(`Background: ${st.bg || 'ÔÇö'}`)
    lines.push(`Music: ${st.music || 'ÔÇö'} ${isPlaying? '(playing)':'(paused)'}`)
    lines.push(`AutoAdvance: ${engine.isAutoAdvance()}`)
    lines.push(`AutoDecide: ${engine.isAutoDecide()}`)
    lines.push(`Sprites (${spriteIds.length}): ${spriteIds.join(', ') || 'ÔÇö'}`)
    lines.push(`Flags (${flags.length}): ${flags.join(', ') || 'ÔÇö'}`)
    lines.push(`SkipTransitions: ${prefs.skipTransitions}`)
    lines.push(`Hotkeys: ${prefs.hotkeysEnabled}`)
    lines.push(`Volume: ${prefs.muted? 'Muted' : Math.round(prefs.volume*100)+'%'}`)
    lines.push(`BG Fade: ${prefs.bgFadeMs}ms  Sprite Fade: ${prefs.spriteFadeMs}ms`)
    debugHud.innerHTML = `<pre style="margin:0; font-family:monospace; font-size:11px; line-height:1.4; white-space:pre-wrap;">${lines.join('\n')}</pre>`
  }catch{ /* ignore */ }
}





