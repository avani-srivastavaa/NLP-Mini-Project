import { useState } from 'react';
import { Link } from 'react-router';
import {
  Book,
  Search,
  User,
  History,
  MessageCircle,
  Info,
  LogOut,
  Menu,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Send,
  Lock,
  Phone,
  Mail,
  Hash,
  GraduationCap,
  BookOpen,
  Pencil,
  MessageSquare,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { mockBooks, mockBorrowRecords } from '../data/mockData';

// ─── Student profile data ────────────────────────────────────────────────────
const studentProfile = {
  name: 'John Doe',
  admissionNo: 'ADM-2024-0012',
  email: 'john.doe@university.edu',
  department: 'Computer Science',
  class: 'B.Sc. CS – Year 2',
  contactNumber: '+1 (555) 987-6543',
};

// Calculate which profile fields are filled (all 6 fields)
const profileFields = [
  studentProfile.name,
  studentProfile.admissionNo,
  studentProfile.email,
  studentProfile.department,
  studentProfile.class,
  studentProfile.contactNumber,
];
const filledFields = profileFields.filter(Boolean).length;
const profileCompletion = Math.round((filledFields / profileFields.length) * 100);

// ─── History record type with review state ────────────────────────────────────
type HistoryRecord = {
  id: string;
  bookName: string;
  issueDate: string;
  returnDate: string;
  status: string;
  review: number;      // star rating 0–5
  comment: string;
};

const initialHistoryRecords: HistoryRecord[] = mockBorrowRecords
  .filter((r) => r.studentId === 'S001')
  .map((r) => ({ ...r, review: 0, comment: '' }));

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

// ─── StarRating component ─────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`w-4 h-4 transition-colors ${
              star <= (hovered || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Floating Chatbot ─────────────────────────────────────────────────────────
function FloatingChatbot() {
  const [open, setOpen] = useState(false);
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
    <>
      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-amber-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Library Assistant</p>
                <p className="text-xs text-amber-100">Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-amber-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 max-h-72 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.from === 'user' ? 'justify-end' : ''}`}
              >
                {msg.from === 'bot' && (
                  <div className="w-7 h-7 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-xl px-3 py-2 text-xs max-w-[85%] leading-relaxed ${
                    msg.from === 'bot'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={sendMessage}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-3 py-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        title="Library Assistant"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
        {/* Ping indicator */}
        {!open && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
        )}
      </button>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // History with review state
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(initialHistoryRecords);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState('');

  const availableBooks = mockBooks.filter((book) => book.available);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'returned': return 'bg-green-100 text-green-700';
      case 'pending':  return 'bg-yellow-100 text-yellow-700';
      case 'overdue':  return 'bg-red-100 text-red-700';
      default:         return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'returned': return <CheckCircle className="w-4 h-4" />;
      case 'pending':  return <Clock className="w-4 h-4" />;
      case 'overdue':  return <AlertCircle className="w-4 h-4" />;
      default:         return null;
    }
  };

  const updateReview = (id: string, rating: number) => {
    setHistoryRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, review: rating } : r))
    );
  };

  const saveComment = (id: string) => {
    setHistoryRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, comment: tempComment } : r))
    );
    setEditingComment(null);
    setTempComment('');
  };

  const isProfileComplete = profileCompletion === 100;

  // Nav items
  const navItems = [
    { key: 'dashboard', label: 'Dashboard',       icon: Book },
    { key: 'profile',   label: 'Profile Details', icon: User },
    { key: 'history',   label: 'Book History',    icon: History },
    { key: 'chatbot',   label: 'Chatbot',          icon: MessageCircle },
    { key: 'about',     label: 'About Library',   icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Bar ───────────────────────────────── */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X /> : <Menu />}
            </Button>
            <div className="flex items-center gap-2">
              <Book className="w-6 h-6 text-amber-600" />
              <span className="font-semibold text-gray-900 hidden sm:block">Smart Library</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{studentProfile.name}</p>
              <p className="text-xs text-gray-500">{studentProfile.admissionNo}</p>
            </div>
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Open sidebar button (desktop, collapsed) */}
        {!sidebarOpen && (
          <div className="hidden lg:block fixed left-0 top-20 z-20">
            <Button
              variant="default"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="rounded-r-lg rounded-l-none bg-amber-600 hover:bg-amber-700 shadow-lg"
              title="Open sidebar"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}

        {/* ── Sidebar ───────────────────────────────── */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30
            w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="hidden lg:flex justify-end p-2 border-b border-gray-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          <nav className="p-4 space-y-1 mt-16 lg:mt-0">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === key
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link to="/">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </Link>
            </div>
          </nav>
        </aside>

        {/* ── Main Content ──────────────────────────── */}
        <main className="flex-1 p-6 min-w-0">

          {/* ════ DASHBOARD TAB ════ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>

              {/* Profile completion warning */}
              {!isProfileComplete && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
                  <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Profile {profileCompletion}% complete — Borrowing is locked
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Complete your profile to 100% to unlock borrowing and returning books.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="ml-auto text-xs font-semibold text-amber-700 border border-amber-400 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition-colors whitespace-nowrap"
                  >
                    Complete Now
                  </button>
                </div>
              )}

              {/* Borrowed Books */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Borrowed Books</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {historyRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">{record.bookName}</h3>
                        <Badge className={`${getStatusColor(record.status)} flex items-center gap-1`}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Issue Date:</span>
                          <span className="font-medium">{record.issueDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Return Date:</span>
                          <span className="font-medium">{record.returnDate}</span>
                        </div>
                      </div>
                      {record.status === 'pending' && (
                        <Button
                          disabled={!isProfileComplete}
                          className="w-full mt-4 bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProfileComplete ? 'Renew Book' : <><Lock className="w-4 h-4 mr-1" /> Locked</>}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Available Books */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Books</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableBooks.slice(0, 8).map((book) => (
                    <div
                      key={book.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                        <Badge variant="outline" className="mb-3 text-xs">{book.category}</Badge>
                        <Button
                          disabled={!isProfileComplete}
                          className="w-full bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProfileComplete ? 'Borrow' : <><Lock className="w-3.5 h-3.5 mr-1" /> Locked</>}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ════ PROFILE TAB ════ */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Details</h1>

              <div className="bg-white rounded-2xl shadow-md p-6">
                {/* Avatar + name */}
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{studentProfile.name}</h2>
                    <p className="text-sm text-gray-500">{studentProfile.admissionNo}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{studentProfile.department}</p>
                  </div>
                </div>

                {/* ── Profile Completion Bar ── */}
                <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                    <span
                      className={`text-sm font-bold ${
                        profileCompletion === 100 ? 'text-green-600' : 'text-amber-600'
                      }`}
                    >
                      {profileCompletion}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        profileCompletion === 100
                          ? 'bg-green-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                  {profileCompletion === 100 ? (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Profile complete! Borrowing and returning is unlocked.
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      Complete all fields to unlock borrowing &amp; returning.
                    </p>
                  )}
                </div>

                {/* ── Fields Grid ── */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <ProfileField
                    icon={<User className="w-4 h-4 text-amber-600" />}
                    label="Full Name"
                    value={studentProfile.name}
                  />
                  <ProfileField
                    icon={<Hash className="w-4 h-4 text-amber-600" />}
                    label="Admission Number"
                    value={studentProfile.admissionNo}
                  />
                  <ProfileField
                    icon={<Mail className="w-4 h-4 text-amber-600" />}
                    label="Email Address"
                    value={studentProfile.email}
                  />
                  <ProfileField
                    icon={<BookOpen className="w-4 h-4 text-amber-600" />}
                    label="Department"
                    value={studentProfile.department}
                  />
                  <ProfileField
                    icon={<GraduationCap className="w-4 h-4 text-amber-600" />}
                    label="Class"
                    value={studentProfile.class}
                  />
                  <ProfileField
                    icon={<Phone className="w-4 h-4 text-amber-600" />}
                    label="Contact Number"
                    value={studentProfile.contactNumber}
                  />
                </div>

                <Button className="mt-6 bg-amber-600 hover:bg-amber-700 rounded-lg">
                  Edit Profile
                </Button>
              </div>
            </div>
          )}

          {/* ════ BOOK HISTORY TAB ════ */}
          {activeTab === 'history' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Book History</h1>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-amber-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Book Name</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue Date</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Return Date</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Review</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Comment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {historyRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {record.bookName}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {record.issueDate}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {record.returnDate}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <Badge className={`${getStatusColor(record.status)} flex items-center gap-1 w-fit`}>
                              {getStatusIcon(record.status)}
                              {record.status}
                            </Badge>
                          </td>

                          {/* ── Review (star rating) ── */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            {record.status === 'returned' ? (
                              <div className="flex flex-col gap-1">
                                <StarRating
                                  value={record.review}
                                  onChange={(v) => updateReview(record.id, v)}
                                />
                                {record.review > 0 && (
                                  <span className="text-xs text-gray-400">
                                    {record.review}/5
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">Return to review</span>
                            )}
                          </td>

                          {/* ── Comment ── */}
                          <td className="px-5 py-4 min-w-[180px]">
                            {editingComment === record.id ? (
                              <div className="flex gap-1.5 items-center">
                                <input
                                  autoFocus
                                  value={tempComment}
                                  onChange={(e) => setTempComment(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && saveComment(record.id)}
                                  placeholder="Write a comment..."
                                  className="text-xs border border-amber-300 rounded-lg px-2 py-1.5 w-36 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                                <button
                                  onClick={() => saveComment(record.id)}
                                  className="text-amber-600 hover:text-amber-800"
                                  title="Save"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => { setEditingComment(null); setTempComment(''); }}
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 group">
                                <span className="text-xs text-gray-600 line-clamp-2 max-w-[150px]">
                                  {record.comment || (
                                    <span className="text-gray-400 italic">No comment yet</span>
                                  )}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingComment(record.id);
                                    setTempComment(record.comment);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-amber-600"
                                  title="Edit comment"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ CHATBOT TAB ════ */}
          {activeTab === 'chatbot' && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Library Assistant Chatbot</h1>
              <div className="bg-white rounded-xl shadow-md h-[600px] flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-amber-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Library Assistant</h3>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                        Online
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {initialMessages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                      {msg.from === 'bot' && (
                        <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`rounded-xl p-3 max-w-sm text-sm ${
                        msg.from === 'bot'
                          ? 'bg-amber-50 text-gray-800'
                          : 'bg-amber-600 text-white'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Input placeholder="Type your message..." className="rounded-lg" />
                    <Button className="bg-amber-600 hover:bg-amber-700 rounded-lg">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ ABOUT TAB ════ */}
          {activeTab === 'about' && (
            <div className="max-w-3xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">About Library</h1>
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h2>
                  <p className="text-gray-600">
                    To provide comprehensive access to knowledge and foster a culture of learning
                    through our extensive collection of books and digital resources.
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Library Hours</h2>
                  <ul className="space-y-2 text-gray-600">
                    <li>Monday – Friday: 8:00 AM – 8:00 PM</li>
                    <li>Saturday: 9:00 AM – 6:00 PM</li>
                    <li>Sunday: 10:00 AM – 4:00 PM</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Information</h2>
                  <ul className="space-y-2 text-gray-600">
                    <li>Email: library@university.edu</li>
                    <li>Phone: (555) 123-4567</li>
                    <li>Location: Main Campus Building, Floor 2</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Services</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Book Borrowing &amp; Returns</li>
                    <li>Digital Resources Access</li>
                    <li>Study Rooms Reservation</li>
                    <li>Research Assistance</li>
                    <li>Inter-library Loans</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Floating Chatbot (all pages) ── */}
      <FloatingChatbot />
    </div>
  );
}

// ─── Profile field sub-component ─────────────────────────────────────────────
function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5 border border-gray-100">
      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
