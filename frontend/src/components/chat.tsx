import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const STORAGE_KEY = 'ai_chat_history';

const ChatComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatMessage[];
        if (Array.isArray(parsed)) setChatLog(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatLog));
    } catch {
      // ignore storage errors
    }
  }, [chatLog]);

  // Auto scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, typingText]);

  const startTypingAnimation = (fullText: string) => {
    setIsTyping(true);
    setTypingText('');
    const chars = Array.from(fullText);
    let index = 0;

    const tick = () => {
      if (index < chars.length) {
        setTypingText(prev => prev + chars[index]);
        index += 1;
        typingTimerRef.current = window.setTimeout(tick, 12); // typing speed ms/char
      } else {
        setIsTyping(false);
        setTypingText('');
        setChatLog(prev => [...prev, { role: 'assistant', content: fullText }]);
      }
    };

    tick();
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    setChatLog(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/chat', { message: userText });
      const replyContent: string = response?.data?.reply?.content ?? 'Sorry, I could not generate a response.';

      // Only show the assistant content with a typing effect
      startTypingAnimation(replyContent);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatLog(prev => [...prev, { role: 'assistant', content: 'Error: could not get response' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const clearChat = () => {
    if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    setTypingText('');
    setIsTyping(false);
    setChatLog([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div
      style={{
        maxWidth: 980,
        margin: '0 auto',
        padding: 20,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #111827 100%)',
          color: '#fff',
          borderRadius: 16,
          padding: 18,
          boxShadow: '0 16px 40px rgba(0,0,0,0.35)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', boxShadow: '0 4px 14px rgba(34,211,238,0.35)' }} />
            <div>
              <div style={{ fontWeight: 800, letterSpacing: 0.3, fontSize: 18 }}>AI Chat</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{loading || isTyping ? 'Assistant is responding…' : 'Ask anything'}</div>
            </div>
          </div>
          <button
            onClick={clearChat}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: 10,
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderRadius: 12,
            padding: 16,
            maxHeight: '60vh',
            minHeight: 260,
            overflowY: 'auto',
          }}
        >
          {chatLog.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', margin: '8px 0' }}>
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: 14,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  background: msg.role === 'user' ? 'linear-gradient(135deg,#3b82f6,#22d3ee)' : 'rgba(255,255,255,0.08)',
                  color: msg.role === 'user' ? '#fff' : '#e5e7eb',
                  boxShadow: msg.role === 'user' ? '0 6px 20px rgba(34,211,238,0.25)' : '0 6px 18px rgba(0,0,0,0.25)'
                }}
              >
                {msg.role === 'assistant' ? (
                  <RichText content={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '8px 0' }}>
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: 14,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#e5e7eb',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.25)'
                }}
              >
                {typingText || '…'}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message…"
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: '#e5e7eb',
              fontSize: 16
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || isTyping}
            style={{
              padding: '12px 18px',
              borderRadius: 12,
              background: 'linear-gradient(135deg,#22d3ee,#3b82f6)',
              color: '#0b1324',
              border: 'none',
              cursor: loading || isTyping ? 'not-allowed' : 'pointer',
              opacity: loading || isTyping ? 0.7 : 1
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;

// Lightweight rich text renderer for assistant responses (headings, bold, lists)
function RichText({ content }: { content: string }) {
  // Split into lines and build simple blocks
  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  // Simple helpers
  const renderInline = (text: string) => {
    // bold **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
      <>
        {parts.map((part, i) => {
          if (/^\*\*[^*]+\*\*$/.test(part)) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  // Build lists and paragraphs
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith('### ')) {
      elements.push(
        <div key={`h3-${i}`} style={{ fontSize: 16, fontWeight: 700, margin: '6px 0' }}>
          {renderInline(line.replace(/^###\s+/, ''))}
        </div>
      );
      i += 1;
      continue;
    }

    if (/^\d+\./.test(line.trim())) {
      // ordered list
      const items: string[] = [];
      while (i < lines.length && /^\d+\./.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s*/, ''));
        i += 1;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ margin: '6px 0 6px 18px' }}>
          {items.map((it, idx) => (
            <li key={idx} style={{ margin: '4px 0' }}>{renderInline(it)}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.trim().startsWith('- ')) {
      // unordered list
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().replace(/^-\s+/, ''));
        i += 1;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin: '6px 0 6px 18px' }}>
          {items.map((it, idx) => (
            <li key={idx} style={{ margin: '4px 0' }}>{renderInline(it)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.trim() === '') {
      elements.push(<div key={`sp-${i}`} style={{ height: 6 }} />);
      i += 1;
      continue;
    }

    // paragraph
    elements.push(
      <div key={`p-${i}`} style={{ margin: '4px 0' }}>
        {renderInline(line)}
      </div>
    );
    i += 1;
  }

  return <div style={{ fontSize: 15 }}>{elements}</div>;
}
