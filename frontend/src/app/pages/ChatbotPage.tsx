import { useState } from 'react';
import { Link } from 'react-router';
import {
  MessageCircle,
  Send,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';

// ─── Chatbot messages ─────────────────────────────────────────────────────────
type ChatMsg = { from: 'bot' | 'user'; text: string };
const initialMessages: ChatMsg[] = [
  { from: 'bot', text: "Hello! I'm your library assistant. How can I help you today?" },
  { from: 'user', text: 'Can you recommend some fiction books?' },
  {
    from: 'bot',
    text: 'Sure! Based on our collection, I recommend "The Great Gatsby", "1984", and "The Alchemist". Would you like to know their availability?',
  },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: trimmed },
      {
        from: 'bot',
        text: "Thanks for your message! I'll look that up for you right away. Is there anything else I can help with?",
      },
    ]);
    setInput('');
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
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        {/* Messages */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}
              >
                {msg.from === 'bot' && (
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[70%] leading-relaxed ${
                    msg.from === 'bot'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <Button
              onClick={sendMessage}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-3"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
