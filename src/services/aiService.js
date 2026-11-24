import { api } from './api'
import {
  appendAIDisclaimer,
  getAILanguageName,
} from '../utils/aiLanguage'
import {
  getHealthKnowledgeReply,
  getReplyActionLabel,
  isHealthRelatedMessage,
} from '../utils/healthKnowledge.js'

export const analyze = (data) => api.post('/ai/analyze', data)
export const isGeminiConfigured = Boolean(import.meta.env.VITE_GEMINI_API_KEY)

const appointmentReplies = {
  en: 'To book a doctor, open Find Doctors. You can also use the Book Doctor button below.',
  te: 'డాక్టర్‌ను బుక్ చేయడానికి Find Doctors తెరవండి. కింద ఉన్న Book Doctor బటన్‌ను కూడా ఉపయోగించవచ్చు.',
  tanglish: 'Doctor book cheyyadaniki Find Doctors open cheyyandi. Kinda unna Book Doctor button kuda use cheyyachu.',
  hi: 'डॉक्टर बुक करने के लिए Find Doctors खोलें। नीचे दिया Book Doctor बटन भी इस्तेमाल कर सकते हैं।',
  'hi-roman': 'Doctor book karne ke liye Find Doctors kholein. Neeche diya Book Doctor button bhi use kar sakte hain.',
}

export function getRuleBasedChatReply(message, language = 'en') {
  const isBookingRequest = /\b(book|appointment|doctor)\b|అపాయింట్మెంట్|डॉक्टर/iu.test(String(message || ''))
  if (isBookingRequest && !isHealthRelatedMessage(message)) {
    return appendAIDisclaimer(appointmentReplies[language] || appointmentReplies.en, language)
  }
  return getHealthKnowledgeReply(message, language)
}

export { getReplyActionLabel, isHealthRelatedMessage }

async function requestGeminiText(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('Gemini is not configured.')

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  )

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error?.message || `Gemini request failed (${response.status}).`)
  }

  const body = await response.json()
  const answer = body?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim()
  if (!answer) throw new Error('Gemini returned an empty response.')
  return answer
}

export async function getGeminiChatReply(message, language = 'en') {
  const languageName = getAILanguageName(language)
  const prompt = `You are a helpful healthcare assistant. Give general health information only, not a diagnosis. Always say to consult a doctor for diagnosis. Reply ONLY in the user's language: ${languageName}. If the user speaks Tanglish (Telugu in English letters), reply in Tanglish. If the user speaks Telugu script, reply in Telugu script. Never mix languages unless the user mixes. Do not prescribe medication doses. User: ${message}`
  return appendAIDisclaimer(await requestGeminiText(prompt), language)
}

export async function getGeminiReportNote(findings, language = 'en') {
  const values = findings.map(({ name, value, reference, status }) => ({
    name,
    value,
    reference,
    status,
  }))
  const prompt = `Give a brief general note about these anonymized lab values in ${getAILanguageName(language)} only. Do not diagnose or prescribe treatment. Say that lab ranges and context matter and the user should consult a doctor. Values: ${JSON.stringify(values)}`
  return appendAIDisclaimer(await requestGeminiText(prompt), language)
}
