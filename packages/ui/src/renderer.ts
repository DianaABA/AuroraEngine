type ChoiceOption = { label: string }
type ChoiceStep = { type: 'choice'; options: ChoiceOption[] }
type DialogueStep = { type: 'dialogue'; char?: string; text: string }
type SceneStep = ChoiceStep | DialogueStep | { type: string }
type PublicState = { sceneId: string | null; index: number }
type VNEngineLike = { next(): void; choose(idx: number): void; getPublicState?: () => PublicState }

type AutoChoiceHint = {
  sceneId: string | null
  index: number
  chosenIndex: number
  chosenLabel?: string
  strategy?: string
  willAutoDecide: boolean
  options: number
  validOptions: number
}

export type VanillaRendererOptions = {
  engine: VNEngineLike
  mount: HTMLElement
  classes?: {
    line?: string
    name?: string
    text?: string
    choices?: string
    next?: string
  }
  autoChoiceHints?: boolean
}

export function createVanillaRenderer(opts: VanillaRendererOptions){
  const { engine, mount, classes = {}, autoChoiceHints = true } = opts
  const lineClass = classes.line || 'ae-line'
  const nameClass = classes.name || 'ae-name'
  const textClass = classes.text || 'ae-text'
  const choicesClass = classes.choices || 'ae-choices'
  const nextClass = classes.next || 'ae-next'

  mount.innerHTML = `
    <div class="${lineClass}"><span class="${nameClass}"></span><span class="${textClass}"></span></div>
    <div class="${choicesClass}"></div>
    <button class="${nextClass}">Next</button>
  `
  const nameEl = mount.querySelector(`.${nameClass}`) as HTMLElement
  const textEl = mount.querySelector(`.${textClass}`) as HTMLElement
  const choicesEl = mount.querySelector(`.${choicesClass}`) as HTMLElement
  const nextBtn = mount.querySelector(`.${nextClass}`) as HTMLButtonElement
  const cleanup: Array<()=>void> = []
  let autoHint: AutoChoiceHint | null = null

  if(autoChoiceHints && typeof window !== 'undefined' && typeof window.addEventListener === 'function'){
    const handler = (e: Event)=>{
      const d: any = (e as CustomEvent).detail
      autoHint = {
        sceneId: d?.sceneId ?? null,
        index: Number(d?.index ?? -1),
        chosenIndex: Number(d?.chosenIndex ?? -1),
        chosenLabel: d?.chosenLabel,
        strategy: d?.strategy,
        willAutoDecide: !!d?.willAutoDecide,
        options: Number(d?.options ?? 0),
        validOptions: Number(d?.validOptions ?? 0)
      }
    }
    window.addEventListener('vn:auto-choice-hint', handler as any)
    cleanup.push(()=> window.removeEventListener('vn:auto-choice-hint', handler as any))
  }

  let choiceButtons: HTMLButtonElement[] = []
  let choiceFocusIndex = 0

  function focusChoice(idx: number){
    if(choiceButtons.length === 0) return
    const clamped = Math.max(0, Math.min(choiceButtons.length - 1, idx))
    choiceFocusIndex = clamped
    choiceButtons.forEach((btn, i)=>{
      const isFocused = i === clamped
      btn.dataset.focused = isFocused ? 'true' : 'false'
      btn.style.outline = isFocused ? '2px solid #a0e7ff' : ''
      btn.style.outlineOffset = '0'
      if(isFocused) btn.focus()
    })
  }

  function handleChoiceKeyNav(e: KeyboardEvent): boolean {
    if(choiceButtons.length === 0) return false
    const moveNext = e.key === 'ArrowDown' || e.key === 'ArrowRight'
    const movePrev = e.key === 'ArrowUp' || e.key === 'ArrowLeft'
    if(moveNext){ e.preventDefault(); focusChoice(choiceFocusIndex + 1); return true }
    if(movePrev){ e.preventDefault(); focusChoice(choiceFocusIndex - 1); return true }
    if(e.key === 'Home'){ e.preventDefault(); focusChoice(0); return true }
    if(e.key === 'End'){ e.preventDefault(); focusChoice(choiceButtons.length - 1); return true }
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault()
      const btn = choiceButtons[choiceFocusIndex]
      if(btn) btn.click()
      return true
    }
    return false
  }
  const keyHandler = (e: KeyboardEvent)=>{
    if(handleChoiceKeyNav(e)) e.stopPropagation()
  }
  mount.addEventListener('keydown', keyHandler, true)
  cleanup.push(()=> mount.removeEventListener('keydown', keyHandler, true))

  function render(step: SceneStep | null){
    const state = typeof (engine as any).getPublicState === 'function' ? (engine as any).getPublicState() : null
    const stepKey = state ? `${state.sceneId}:${state.index}` : ''
    choiceButtons = []
    choiceFocusIndex = 0
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
      const dlg = step as DialogueStep
      if(dlg.char) nameEl.textContent = dlg.char + ': '
      textEl.textContent = dlg.text
    } else if(step.type === 'choice'){
      nextBtn.style.display = 'none'
      const choiceStep = step as ChoiceStep
      const hint = autoHint && `${autoHint.sceneId}:${autoHint.index}` === stepKey ? autoHint : null
      const hintRow = document.createElement('div')
      hintRow.className = `${choicesClass}-hint`
      hintRow.textContent = hint
        ? (hint.willAutoDecide ? `Auto-choose will pick "${hint.chosenLabel}"` : `Default option: "${hint.chosenLabel}"`)
        : 'Use arrow keys or Tab/Enter to pick an option.'
      hintRow.setAttribute('aria-live', 'polite')
      choicesEl.appendChild(hintRow)
      choiceStep.options.forEach((opt, idx)=>{
        const b = document.createElement('button')
        b.textContent = ''
        const label = document.createElement('span')
        label.textContent = opt.label
        b.appendChild(label)
        if(hint && hint.chosenIndex === idx){
          const badge = document.createElement('span')
          badge.className = `${choicesClass}-badge`
          badge.textContent = hint.willAutoDecide ? 'AUTO' : 'DEFAULT'
          badge.title = hint.willAutoDecide ? 'Auto-decide will pick this option' : 'Default option'
          b.dataset.default = 'true'
          if(hint.willAutoDecide) b.dataset.auto = 'true'
          b.appendChild(badge)
        }
        b.onclick = ()=> engine.choose(idx)
        choicesEl.appendChild(b)
        choiceButtons.push(b)
      })
      focusChoice(hint ? hint.chosenIndex : 0)
    } else {
      textEl.textContent = step.type
    }
  }

  nextBtn.onclick = ()=> engine.next()
  const destroy = ()=> cleanup.forEach(fn=> fn())
  return { render, destroy }
}
