export type AIMode = 'local' | 'byok'

export type LocalAI = {
  convertScriptToJSON: (script: string) => Promise<any>
  fixGrammar: (text: string) => Promise<string>
  detectSceneErrors: (json: string) => Promise<any[]>
}

export type RemoteAI = {
  generateScene: (prompt: string) => Promise<any>
  extendDialogue: (scene: any, prompt: string) => Promise<any>
  suggestBranches: (scene: any) => Promise<any>
  generateAssets?: (prompt: string) => Promise<any>
}

/**
 * Adapter entry point so the template/UI can remain provider-agnostic.
 * Current implementation is a scaffold; replace with real hooks to WebLLM/Transformers.js or BYOK providers.
 */
export function getAIAdapters(mode: AIMode, apiKey?: string): { mode: AIMode; local?: LocalAI; remote?: RemoteAI } {
  if (mode === 'local') {
    return {
      mode,
      local: {
        async convertScriptToJSON() { throw new Error('localAI not wired yet') },
        async fixGrammar() { throw new Error('localAI not wired yet') },
        async detectSceneErrors() { throw new Error('localAI not wired yet') },
      }
    }
  }
  return {
    mode,
    remote: {
      async generateScene() { throw new Error('BYOK provider not wired yet') },
      async extendDialogue() { throw new Error('BYOK provider not wired yet') },
      async suggestBranches() { throw new Error('BYOK provider not wired yet') },
      async generateAssets() { throw new Error('BYOK provider not wired yet') },
    }
  }
}
