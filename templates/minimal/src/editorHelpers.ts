export type EditorScene = { id: string; steps: any[] }
export type BranchEdge = { from: string; to: string; via: string }

export function computeBranchEdges(scenes: EditorScene[]): { edges: BranchEdge[]; sceneIds: Set<string> } {
  const edges: BranchEdge[] = []
  const sceneIds = new Set<string>()
  for (const sc of scenes) {
    if (!sc?.id) continue
    sceneIds.add(sc.id)
    const steps = Array.isArray(sc.steps) ? sc.steps : []
    steps.forEach((st, idx) => {
      if (st?.type === 'goto' && st.scene) {
        edges.push({ from: sc.id, to: st.scene, via: `step ${idx}` })
      }
      if (st?.type === 'choice' && Array.isArray(st.options)) {
        st.options.forEach((opt: any, oIdx: number) => {
          if (opt?.goto) edges.push({ from: sc.id, to: opt.goto, via: `choice ${oIdx}` })
        })
      }
    })
  }
  return { edges, sceneIds }
}
