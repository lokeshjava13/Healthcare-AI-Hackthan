import { useEffect, useState } from 'react'
import { getPreferredAILanguage } from '../utils/aiLanguage'

export default function useAILanguage() {
  const [language, setLanguage] = useState(getPreferredAILanguage)

  useEffect(() => {
    const updateLanguage = () => setLanguage(getPreferredAILanguage())
    window.addEventListener('ai-language-change', updateLanguage)
    window.addEventListener('storage', updateLanguage)
    return () => {
      window.removeEventListener('ai-language-change', updateLanguage)
      window.removeEventListener('storage', updateLanguage)
    }
  }, [])

  return language
}
