import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage } from '../data/api';
import {
  MessageCircle,
  Send,
  Copy,
} from 'lucide-react';
import { Button } from '../components/ui/button';

type ChatMsg = { from: 'bot' | 'user'; text: string; isLoading?: boolean };

const initialMessages: ChatMsg[] = [
  { from: 'bot', text: "Hello! I'm your library assistant. How can I help you today?" },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyIndex, setCopyIndex] = useState<number | null>(null);
  const sessionId = 'web-session';
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, { from: 'bot', text: '', isLoading: true }]);

    try {
      const res = await sendChatMessage(sessionId, trimmed);
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.isLoading);
        return [
          ...filtered,
          {
            from: 'bot',
            text:
              res && typeof res.response === 'string' && res.response.trim()
                ? res.response
                : 'Error: No response from server.',
          },
        ];
      });
    } catch {
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.isLoading);
        return [...filtered, { from: 'bot', text: 'Error: Could not fetch answer from FastAPI.' }];
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopyIndex(idx);
    setTimeout(() => setCopyIndex(null), 1200);
  };

  return (
    <div className="flex flex-col w-full" style={{ height: 'calc(100vh - 135px)' }}>
      {/* Chat box fills full height */}
      <div className="flex flex-col flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-w-[1000px] w-full mx-auto">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ minHeight: 0 }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot avatar */}
              {msg.from === 'bot' && (
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="relative group max-w-[75%]">
                <div
                  className={`rounded-2xl px-4 py-3 leading-relaxed text-sm ${
                    msg.from === 'bot'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {msg.isLoading ? (
                    /* ── Bouncing dots ── */
                    <div className="flex items-center gap-1 h-5 px-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:300ms]" />
                    </div>
                  ) : msg.from === 'bot' ? (
                    <div className="prose prose-sm prose-amber max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="marker:text-amber-600">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                          h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-bold mb-1">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                          hr: () => <hr className="my-3 border-gray-200" />,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>

                {/* Copy button */}
                {msg.from === 'bot' && !msg.isLoading && (
                  <button
                    className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-gray-400 hover:text-amber-600"
                    title="Copy"
                    onClick={() => handleCopy(msg.text, i)}
                  >
                    <Copy className="w-3 h-3" />
                    {copyIndex === i ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-5"
            disabled={loading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}