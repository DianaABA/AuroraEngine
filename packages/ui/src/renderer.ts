import type { SceneStep } from '../../src/vn/sceneTypes'
import type { VNEngine } from '../../src/vn/engine'

export type VanillaRendererOptions = {
  engine: VNEngine
  mount: HTMLElement
  classes?: {
    line?: string
    name?: string
    text?: string
    choices?: string
    next?: string
  }
}

export function createVanillaRenderer(opts: VanillaRendererOptions){
  const { engine, mount, classes = {} } = opts
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

  function render(step: SceneStep | null){
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
      if(step.char) nameEl.textContent = step.char + ': '
      textEl.textContent = step.text
    } else if(step.type === 'choice'){
      nextBtn.style.display = 'none'
      step.options.forEach((opt, idx)=>{
        const b = document.createElement('button')
        b.textContent = opt.label
        b.onclick = ()=> engine.choose(idx)
        choicesEl.appendChild(b)
      })
    } else {
      textEl.textContent = step.type
    }
  }

  nextBtn.onclick = ()=> engine.next()
  return { render }
}
