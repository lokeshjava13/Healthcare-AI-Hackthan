import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAILanguage from '../hooks/useAILanguage'
import {
  getGeminiChatReply,
  getReplyActionLabel,
  getRuleBasedChatReply,
  isHealthRelatedMessage,
  isGeminiConfigured,
} from '../services/aiService'
import {
  aiLanguageNames,
  getLanguageChangeReply,
  getAILanguageSelectorValue,
  resolveAILanguage,
  setManualAILanguage,
} from '../utils/aiLanguage'

const quickSuggestions = ['I have fever', 'Headache', 'Book Doctor', 'Upload Report']
const replyActions = ['Book Doctor', 'Check Symptoms', 'Upload Report']

function createWelcomeMessage(language) {
  return {
    id: 'welcome',
    role: 'assistant',
    text: getRuleBasedChatReply('hello', language),
  }
}

function readChatMessages(storageKey, language) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
    return {
      messages: Array.isArray(saved) && saved.length ? saved : [createWelcomeMessage(language)],
      error: '',
    }
  } catch {
    return {
      messages: [createWelcomeMessage(language)],
      error: 'Saved chat history could not be read. A new local conversation was started.',
    }
  }
}

function createMessage(role, text) {
  return { id: `${Date.now()}-${Math.random()}`, role, text }
}

export default function ChatConversation({ scope }) {
  const navigate = useNavigate()
  const language = useAILanguage()
  const storageKey = useMemo(
    () => `healthcare-ai-chat:${scope || localStorage.getItem('patientId') || localStorage.getItem('userId') || 'guest'}`,
    [scope],
  )
  const [initialChat] = useState(() => readChatMessages(storageKey, language))
  const [messages, setMessages] = useState(initialChat.messages)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [shareWithGemini, setShareWithGemini] = useState(false)
  const [notice, setNotice] = useState(initialChat.error)
  const messagesEndRef = useRef(null)

  const commitMessages = (nextMessages) => {
    setMessages(nextMessages)
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextMessages))
    } catch {
      setNotice('Chat history could not be saved on this device.')
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, sending])

  const sendMessage = async (value = draft) => {
    const text = value.trim()
    if (!text || sending) return
    const { language: replyLanguage } = resolveAILanguage(text)
    const userMessage = createMessage('user', text)
    const userMessages = [...messages, userMessage]
    commitMessages(userMessages)
    setDraft('')
    setNotice('')
    setSending(true)

    try {
      const reply = isGeminiConfigured && shareWithGemini && !isHealthRelatedMessage(text)
        ? await getGeminiChatReply(text, replyLanguage)
        : getRuleBasedChatReply(text, replyLanguage)
      commitMessages([...userMessages, createMessage('assistant', reply)])
    } catch (error) {
      setNotice(`Gemini is unavailable (${error.message}). Using a local demo reply instead.`)
      commitMessages([...userMessages, createMessage('assistant', getRuleBasedChatReply(text, replyLanguage))])
    } finally {
      setSending(false)
    }
  }

  const handleSuggestion = (suggestion) => {
    if (suggestion === 'Upload Report') {
      navigate('/reports')
      return
    }
    sendMessage(suggestion)
  }

  const handleReplyAction = (action) => {
    const destinations = {
      'Book Doctor': '/doctors',
      'Check Symptoms': '/symptom-checker',
      'Upload Report': '/reports',
    }
    navigate(destinations[action])
  }

  const selectLanguage = (selectedLanguage) => {
    setManualAILanguage(selectedLanguage)
    commitMessages([...messages, createMessage('assistant', getLanguageChangeReply(selectedLanguage))])
  }

  return (
    <section className="ai-chat-conversation" aria-label="Healthcare AI Assistant">
      <header className="ai-chat-header">
        <span className="ai-chat-avatar" aria-hidden="true">🤖</span>
        <div>
          <h2>Healthcare AI Assistant</h2>
          <span className="ai-mode-label">
            {isGeminiConfigured ? 'Gemini available · opt-in required' : 'AI Demo Mode · runs locally'}
          </span>
          <div className="ai-language-selector" aria-label="Assistant reply language">
            <span aria-hidden="true">🌐</span>
            {Object.entries(aiLanguageNames).map(([code, label]) => (
              <button
                className={`ai-language-pill${getAILanguageSelectorValue(language) === code ? ' selected' : ''}`}
                type="button"
                key={code}
                aria-pressed={getAILanguageSelectorValue(language) === code}
                onClick={() => selectLanguage(code)}
                disabled={sending}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="ai-chat-messages" aria-live="polite">
        {messages.map((message) => (
          <article className={`ai-chat-message ${message.role}`} key={message.id}>
            <p>{message.text}</p>
            {message.role === 'assistant' && (
              <div className="ai-reply-actions">
                <span>{getReplyActionLabel(language)}</span>
                {replyActions.map((action) => (
                  <button
                    className="ai-suggestion-chip"
                    type="button"
                    key={action}
                    onClick={() => handleReplyAction(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
        {sending && (
          <div className="ai-chat-message assistant" role="status">
            <p className="chat-typing">Healthcare AI is thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {notice && <p className="ai-chat-notice" role="status">{notice}</p>}

      <div className="ai-chat-compose">
        <div className="ai-quick-suggestions" aria-label="Quick suggestions">
          {quickSuggestions.map((suggestion) => (
            <button
              className="ai-suggestion-chip"
              type="button"
              key={suggestion}
              onClick={() => handleSuggestion(suggestion)}
              disabled={sending}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {isGeminiConfigured && (
          <label className="ai-gemini-consent">
            <input
              type="checkbox"
              checked={shareWithGemini}
              onChange={(event) => setShareWithGemini(event.target.checked)}
            />
            Send this message to Google Gemini. Avoid names or identifying details.
          </label>
        )}

        <form
          className="ai-chat-input-form"
          onSubmit={(event) => {
            event.preventDefault()
            sendMessage()
          }}
        >
          <input
            aria-label="Message Healthcare AI"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a general health question..."
            maxLength={1000}
          />
          <button type="submit" className="button button-primary" disabled={sending || !draft.trim()}>
            Send
          </button>
        </form>
        <p className="ai-chat-privacy">Chat history is stored in this browser. Sign out on shared devices.</p>
      </div>
    </section>
  )
}
