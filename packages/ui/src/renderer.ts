import type { SceneStep } from '../../src/vn/sceneTypes'
import type { Gallery, Achievements } from '../../src'
import type { VNEngine } from '../../src/vn/engine'

export type VanillaRendererOptions = {
  engine: VNEngine
  mount: HTMLElement
  gallery?: Gallery
  achievements?: Achievements
}

export function createVanillaRenderer(opts: VanillaRendererOptions){
  const { engine, mount } = opts
  const el = mount
  el.innerHTML = `
    <div class="ae-line"><span class="ae-name"></span><span class="ae-text"></span></div>
    <div class="ae-choices"></div>
    <button class="ae-next">Next</button>
  `
  const nameEl = el.querySelector('.ae-name') as HTMLElement
  const textEl = el.querySelector('.ae-text') as HTMLElement
  const choicesEl = el.querySelector('.ae-choices') as HTMLElement
  const nextBtn = el.querySelector('.ae-next') as HTMLButtonElement

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
