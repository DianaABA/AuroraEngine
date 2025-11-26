import { describe, it, expect } from 'vitest'

type Locale = 'en' | 'es' | 'ar'

const TEXT_TABLE: Record<Locale, Record<string, string>> = {
  en: { intro_greeting: 'Welcome to AuroraEngine.' },
  es: { intro_greeting: 'Bienvenido a AuroraEngine.' },
  ar: { intro_greeting: 'مرحبًا بك في AuroraEngine.' }
}

function resolveText(locale: Locale, step: any){
  const table = TEXT_TABLE[locale] || TEXT_TABLE.en
  if(step?.textId){
    return table[step.textId] || TEXT_TABLE.en[step.textId] || step.text || step.textId
  }
  return step?.text
}

describe('textId resolution', () => {
  it('falls back to en textId when locale missing', () => {
    const step = { textId: 'intro_greeting', text: 'fallback' }
    expect(resolveText('es', step)).toBe(TEXT_TABLE.es.intro_greeting)
    expect(resolveText('ar', step)).toBe(TEXT_TABLE.ar.intro_greeting)
    expect(resolveText('en', step)).toBe(TEXT_TABLE.en.intro_greeting)
  })

  it('uses step.text when no textId provided', () => {
    const step = { text: 'hello' }
    expect(resolveText('es', step)).toBe('hello')
  })

  it('falls back to step.text or textId if table missing', () => {
    const step = { textId: 'missing_key', text: 'text fallback' }
    expect(resolveText('es', step)).toBe('text fallback')
    expect(resolveText('en', step)).toBe('text fallback')
    const stepNoText = { textId: 'missing_key' }
    expect(resolveText('en', stepNoText)).toBe('missing_key')
  })
})
