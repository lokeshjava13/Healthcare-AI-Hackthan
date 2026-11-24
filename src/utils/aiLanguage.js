export const AI_LANGUAGES = ['en', 'te', 'tanglish', 'hi']

const supportedLanguages = new Set([...AI_LANGUAGES, 'hi-roman'])
let memoryLanguage = 'en'
let memoryManual = false

const disclaimers = {
  en: '⚠️ This is general info only, not a diagnosis. Please consult a doctor.',
  te: '⚠️ ఇది సాధారణ సమాచారం మాత్రమే, నిర్ధారణ కాదు. దయచేసి డాక్టర్‌ని సంప్రదించండి.',
  tanglish: '⚠️ Idi general info matrame, diagnosis kadu. Please doctor ni consult cheyyandi.',
  hi: '⚠️ यह सिर्फ सामान्य जानकारी है, निदान नहीं। कृपया डॉक्टर से सलाह लें।',
  'hi-roman': '⚠️ Yeh sirf general jaankari hai, diagnosis nahi. Kripya doctor se salah lein.',
}

const languageNames = {
  en: 'English',
  te: 'Telugu script',
  tanglish: 'Tanglish (Telugu written in English letters)',
  hi: 'Hindi in Devanagari script',
  'hi-roman': 'Hindi written in Roman letters',
}

function readStorage(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }
}

function notifyLanguageChange(language) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ai-language-change', { detail: { language } }))
  }
}

export function detectLanguage(text) {
  const message = String(text || '')
  if (/[\u0C00-\u0C7F]/u.test(message)) return 'te'
  if (/[\u0900-\u097F]/u.test(message)) return 'hi'

  const lower = message.toLowerCase()
  if (/\b(naku|nenu|undi|em|cheyyali|kalavandi|ela|enti|ledhu|chala)\b/.test(lower)) {
    return 'tanglish'
  }
  if (/\b(mujhe|bukhar|hai|kya|karna)\b/.test(lower)) return 'hi-roman'
  return 'en'
}

export function getPreferredAILanguage() {
  const savedLanguage = readStorage('ai_lang')
  if (supportedLanguages.has(savedLanguage)) return savedLanguage

  const lastUsedLanguage = readStorage('lastUsedLang')
  if (supportedLanguages.has(lastUsedLanguage)) return lastUsedLanguage
  return memoryLanguage
}

export function resolveAILanguage(text) {
  const detected = detectLanguage(text)
  writeStorage('lastUsedLang', detected)
  const manualOverride = readStorage('ai_lang_manual') === 'true' || memoryManual
  const language = manualOverride
    ? getPreferredAILanguage()
    : detected

  memoryLanguage = language
  if (!manualOverride) writeStorage('ai_lang', language)
  notifyLanguageChange(language)
  return { detected, language }
}

export function setManualAILanguage(language) {
  if (!supportedLanguages.has(language) || language === 'hi-roman') return
  memoryLanguage = language
  memoryManual = true
  writeStorage('ai_lang', language)
  writeStorage('ai_lang_manual', 'true')
  notifyLanguageChange(language)
}

export function getAILanguageName(language) {
  return languageNames[language] || languageNames.en
}

export function getAILanguageSelectorValue(language) {
  return language === 'hi-roman' ? 'hi' : language
}

export function getAIDisclaimer(language) {
  return disclaimers[language] || disclaimers.en
}

export function appendAIDisclaimer(text, language) {
  const answer = String(text || '').trim()
  const disclaimer = getAIDisclaimer(language)
  return answer.endsWith(disclaimer) ? answer : `${answer}\n\n${disclaimer}`
}

export function getLanguageChangeReply(language) {
  const replies = {
    en: 'Language set to English. How can I help?',
    te: 'భాష తెలుగు కి మార్చాను. ఎలా సహాయం చేయగలను?',
    tanglish: 'Language Tanglish ki marchanu. Cheppu, em help kavali?',
    hi: 'भाषा हिंदी में बदल दी। कैसे मदद करूँ?',
  }
  return appendAIDisclaimer(replies[language] || replies.en, language)
}

export const aiLanguageNames = {
  en: 'English',
  te: 'తెలుగు',
  tanglish: 'Tanglish',
  hi: 'हिंदी',
}
