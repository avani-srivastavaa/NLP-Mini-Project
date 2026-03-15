import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, BookOpen, Minimize2 } from "lucide-react";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
}

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const botResponses: Record<string, string> = {
  hello: "Hello! 👋 I'm the LibraMS assistant. I can help you with book searches, borrowing info, return dates, and library policies. What do you need?",
  hi: "Hi there! 😊 How can I assist you with the library today?",
  borrow: "To borrow a book, visit the library counter with your student ID. The standard borrowing period is 14 days. You can also check availability in the Borrow section of your dashboard.",
  return: "Books should be returned before the due date shown in your borrow records. Late returns may incur a fine of ₹2 per day. You can check your due dates in the History section.",
  fine: "Library fines are ₹2 per day per book for overdue returns. Fines must be cleared before borrowing new books.",
  hours: "Library Hours:\n🕗 Monday–Friday: 8:00 AM – 8:00 PM\n🕘 Saturday: 9:00 AM – 5:00 PM\n🚫 Sunday: Closed",
  renew: "You can renew a book once, for an additional 7 days, provided no other student has requested it. Contact the library counter or call +91-XXXXXX-XXXX.",
  lost: "If a book is lost, you need to pay the replacement cost plus a ₹50 processing fee. Please report it to the library counter immediately.",
  search: "You can search for books by title, author, or ISBN from the library catalog. Use the search bar at the top of your dashboard.",
  default:
    "I'm not sure about that. You can ask me about:\n• Book borrowing & returns\n• Library hours\n• Fines & renewals\n• Lost books\n• Book availability",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("hello") || lower.includes("hey")) return botResponses.hello;
  if (lower.includes("hi")) return botResponses.hi;
  if (lower.includes("borrow") || lower.includes("issue")) return botResponses.borrow;
  if (lower.includes("return") || lower.includes("due")) return botResponses.return;
  if (lower.includes("fine") || lower.includes("penalty")) return botResponses.fine;
  if (lower.includes("hour") || lower.includes("time") || lower.includes("open")) return botResponses.hours;
  if (lower.includes("renew") || lower.includes("extend")) return botResponses.renew;
  if (lower.includes("lost") || lower.includes("damage")) return botResponses.lost;
  if (lower.includes("search") || lower.includes("find") || lower.includes("look")) return botResponses.search;
  return botResponses.default;
}

const suggestions = ["Library hours?", "How to borrow?", "Check fine info", "Renew a book"];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "👋 Hi! I'm your Library Assistant. Ask me anything about borrowing books, return dates, fines, or library hours!",
      time: getTime(),
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: reply, time: getTime() },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-2xl shadow-blue-600/40 flex items-center justify-center transition-all hover:scale-105 z-50"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full" />
          </span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col transition-all duration-200 ${
            minimized ? "h-14 w-72" : "w-80 sm:w-96 h-[500px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Library Assistant</p>
                {!minimized && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-emerald-400" style={{ fontSize: "0.7rem" }}>Online</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(!minimized)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        msg.role === "bot" ? "bg-blue-600/30" : "bg-indigo-600/30"
                      }`}
                    >
                      {msg.role === "bot" ? (
                        <Bot className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl whitespace-pre-line ${
                          msg.role === "bot"
                            ? "bg-white/5 text-slate-200 rounded-tl-sm"
                            : "bg-blue-600 text-white rounded-tr-sm"
                        }`}
                        style={{ fontSize: "0.82rem", lineHeight: "1.5" }}
                      >
                        {msg.text}
                      </div>
                      <span className="text-slate-600 mt-1 px-1" style={{ fontSize: "0.7rem" }}>{msg.time}</span>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-blue-600/30 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick suggestions */}
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-3 py-1.5 rounded-xl transition-all"
                    style={{ fontSize: "0.72rem" }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Ask the library assistant..."
                  className="flex-1 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500 transition-all"
                  style={{ fontSize: "0.82rem" }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
