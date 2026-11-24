import { Link } from 'react-router-dom'
import ChatConversation from '../components/ChatConversation'
import { isGeminiConfigured } from '../services/aiService'
import { useAuth } from '../context/useAuth'

export default function AIChat() {
  const { user } = useAuth()
  const scope = user?.patientId || user?.userId || 'guest'

  return (
    <div className="page-container ai-chat-page">
      <header className="page-heading standalone-heading">
        <div>
          <span className="eyebrow">HEALTHCARE AI</span>
          <h1>AI Health Assistant</h1>
          <p>Ask general health questions and get guidance on when to contact a clinician.</p>
        </div>
        <span className="ai-demo-badge">{isGeminiConfigured ? 'Gemini optional' : 'AI Demo Mode'}</span>
      </header>
      <ChatConversation key={scope} scope={scope} />
      <p className="ai-chat-page-links">
        <Link className="text-link" to="/symptom-checker">Check symptoms</Link>
        <Link className="text-link" to="/reports">Analyze a report</Link>
      </p>
    </div>
  )
}
