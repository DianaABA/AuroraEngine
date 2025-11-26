import { describe, it, expect, vi } from 'vitest'
import * as aiModes from '../src/utils/aiModes'

describe('aiModes adapters', () => {
  it('throws when BYOK without apiKey', async () => {
    await expect(aiModes.getAIAdapters('byok')).rejects.toThrow()
  })
})
