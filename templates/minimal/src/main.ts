import { createEngine, on, loadScenesFromUrl } from 'aurora-engine'

const nameEl = document.getElementById('name')!
const textEl = document.getElementById('text')!
const choicesEl = document.getElementById('choices')!
const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement
const bgLabel = document.getElementById('bgLabel')!

const engine = createEngine({ autoEmit: true })

async function boot(){
  const { scenes, errors } = await loadScenesFromUrl('/scenes/example.json')
  if(errors.length){
    textEl.textContent = 'Failed to load scenes: '+errors.join(', ')
    return
  }
  engine.loadScenes(scenes)
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
})

nextBtn.onclick = () => engine.next()

boot()
