import { loadScenesFromJsonStrict, validateSceneLinksStrict } from 'aurora-engine'

export function validateSceneJsonText(json: string){
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

export function incrementalValidate(text: string){
  try{
    const cleaned = text.trim()
    if(!cleaned.endsWith(']')) return { ok:false, partial:true }
    const { scenes, errors } = loadScenesFromJsonStrict(cleaned)
    const linkIssues = scenes ? validateSceneLinksStrict(scenes as any) : []
    const issues = [...(errors||[]), ...(linkIssues||[])]
    if(issues.length) return { ok:false, partial:false, issues }
    return { ok:true, partial:false, scenes }
  }catch{
    return { ok:false, partial:true }
  }
}
