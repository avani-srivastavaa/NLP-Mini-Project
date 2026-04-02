import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../data/api';
import { Link } from 'react-router';
import {
  MessageCircle,
  Send,
  ArrowLeft,
  X,
  Copy,
} from 'lucide-react';
import { Button } from '../components/ui/button';

// ─── Chatbot messages ─────────────────────────────────────────────────────────
type ChatMsg = { from: 'bot' | 'user'; text: string };
const initialMessages: ChatMsg[] = [
  { from: 'bot', text: "Hello! I'm your library assistant. How can I help you today?" },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyIndex, setCopyIndex] = useState<number | null>(null);
  const sessionId = 'web-session'; // In production, generate or fetch per user
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: trimmed },
    ]);
    setInput('');
    setLoading(true);
    // Add loading placeholder
    setMessages((prev) => [
      ...prev,
      { from: 'bot', text: '__LOADING__' },
    ]);
    try {
      const res = await sendChatMessage(sessionId, trimmed);
      setMessages((prev) => {
        // Remove the loading placeholder
        const filtered = prev.filter((msg) => msg.text !== '__LOADING__');
        if (res && typeof res.response === 'string' && res.response.trim() !== '') {
          return [
            ...filtered,
            { from: 'bot', text: res.response },
          ];
        } else {
          return [
            ...filtered,
            { from: 'bot', text: 'Error: No response from server.' },
          ];
        }
      });
    } catch (err: any) {
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.text !== '__LOADING__');
        return [
          ...filtered,
          { from: 'bot', text: 'Error: Could not fetch answer from FastAPI.' },
        ];
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Copy output text
  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopyIndex(idx);
    setTimeout(() => setCopyIndex(null), 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/student/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-amber-600" />
              <span className="font-semibold text-gray-900">Library Assistant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col items-center w-full px-4 py-6">
        {/* Chat Rectangle */}
        <div className="w-full max-w-2xl flex flex-col flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style={{ minHeight: 480, maxHeight: 600 }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-gray-100" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.from === 'bot' && msg.text !== '__LOADING__' && (
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="relative group">
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[70vw] md:max-w-[70%] leading-relaxed whitespace-pre-line ${
                      msg.from === 'bot'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {msg.text === '__LOADING__' ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="dot-typing">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </span>
                        <span className="sr-only">Loading...</span>
                      </span>
                    ) : (
                      msg.text
                    )}
                  </div>
                  {/* Copy button for bot messages except loading */}
                  {msg.from === 'bot' && msg.text !== '__LOADING__' && (
                    <button
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-amber-200"
                      title="Copy"
                      onClick={() => handleCopy(msg.text, i)}
                    >
                      <Copy className="w-4 h-4 text-amber-600" />
                      {copyIndex === i && (
                        <span className="absolute left-8 top-0 text-xs bg-white border border-amber-300 rounded px-2 py-1 shadow">Copied!</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {/* Dummy div for auto-scroll */}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-3"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block w-6 h-6">
                  <span className="dot-typing">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                </span>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        {/* Loading animation CSS */}
        <style>{`
          .dot-typing {
            display: inline-block;
            line-height: 1;
            height: 1em;
            vertical-align: middle;
          }
          .dot-typing .dot {
            display: inline-block;
            width: 0.5em;
            height: 0.5em;
            margin: 0 0.1em;
            background: #f59e0b;
            border-radius: 50%;
            animation: dot-typing 1s infinite linear alternate;
          }
          .dot-typing .dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          .dot-typing .dot:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes dot-typing {
            0% { transform: translateY(0); }
            100% { transform: translateY(-0.3em); }
          }
        `}</style>
      </div>
    </div>
  );
}
