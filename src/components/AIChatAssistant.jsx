import { useState } from 'react'
import ChatConversation from './ChatConversation'

export default function AIChatAssistant({ scope }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`ai-chat-widget${open ? ' is-open' : ''}`}>
      {open && (
        <div className="ai-chat-popover">
          <ChatConversation scope={scope} />
        </div>
      )}
      <button
        className="ai-chat-fab"
        type="button"
        aria-label={open ? 'Close Healthcare AI Assistant' : 'Open Healthcare AI Assistant'}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? '×' : '🤖'}
      </button>
    </div>
  )
}
