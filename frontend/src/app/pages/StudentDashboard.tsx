import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import ChatbotPage from './ChatbotPage';
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
  Send,
  Lock,
  Phone,
  Mail,
  Hash,
  GraduationCap,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { mockBooks, mockBorrowRecords } from '../data/mockData';
import { ThemeToggle } from '../components/theme/ThemeToggle';

// ─── Student profile data ────────────────────────────────────────────────────
const studentProfile = {
  name: 'Dhiru bhai Ambani',
  admissionNo: 'ADM-2024-0012',
  email: 'ambanidhiru@mes.ac.in',
  department: 'Computer Science',
  class: 'B.Sc. CS – Year 2',
  contactNumber: '+91 9912939482',
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

// ─── History record type with simplified review state ─────────────────────────
type HistoryRecord = {
  id: string;
  bookName: string;
  issueDate: string;
  returnDate: string;
  status: string;
  comment: string;
};

const initialHistoryRecords: HistoryRecord[] = mockBorrowRecords
  .filter((r) => r.studentId === 'S001')
  .map((r) => ({ ...r, comment: '' }));

// ─── Chatbot messages ─────────────────────────────────────────────────────────
type ChatMsg = { from: 'bot' | 'user'; text: string };
const initialMessages: ChatMsg[] = [
  { from: 'bot', text: "Hello! I'm your library assistant. How can I help you today?" },
];

// ─── Floating Chatbot Button ──────────────────────────────────────────────────
function FloatingChatbot({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-[0_20px_45px_-18px_rgba(37,99,235,0.65)] transition-all hover:scale-105 active:scale-95"
      title="Library Assistant"
    >
      <MessageCircle className="w-6 h-6" />
      {/* Ping indicator */}
      <span className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  // Chatbot messages state
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [chatInput, setChatInput] = useState('');

  // History state
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(initialHistoryRecords);

  useEffect(() => {
    // Empty
  }, []);

  const departments = ['All Departments', ...Array.from(new Set(mockBooks.map((book) => book.department)))];

  const availableBooks = mockBooks.filter((book) =>
    book.available &&
    (selectedDepartment === 'All Departments' || book.department === selectedDepartment) &&
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendChatMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: trimmed },
    ]);
    setChatInput('');
  };

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

  // New functions for History Tab
  const updateComment = (id: string, comment: string) => {
    setHistoryRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, comment } : r))
    );
  };

  const handleReturnBook = (id: string) => {
    setHistoryRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'returned',
              returnDate: new Date().toISOString().slice(0, 10),
            }
          : r
      )
    );
  };

  const isProfileComplete = profileCompletion === 100;
  const handleLogout = () => {
    window.localStorage.removeItem('smart-library-student-auth');
  };

  // Nav items
  const navItems = [
    { key: 'dashboard', label: 'Dashboard',       icon: Book },
    { key: 'profile',   label: 'Profile Details', icon: User },
    { key: 'history',   label: 'Book History',    icon: History },
    { key: 'chatbot',   label: 'Chatbot',         icon: MessageCircle },
    { key: 'about',     label: 'About Library',   icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_22%),linear-gradient(180deg,_#f8fbff_0%,_#eff6ff_44%,_#f8fafc_100%)] transition-colors dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#0f172a_52%,_#020617_100%)]">

      {/* ── Top Bar ───────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/78">
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
              <span className="font-semibold text-gray-900 hidden sm:block dark:text-slate-100">Smart Library</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{studentProfile.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{studentProfile.admissionNo}</p>
            </div>
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* ── Sidebar ───────────────────────────────── */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30 flex flex-col
            ${sidebarCollapsed ? 'w-20' : 'w-64'}
            border-r border-white/60 bg-white/72 shadow-lg backdrop-blur-xl transform transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/30
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Collapse/Expand Toggle (Desktop Only) */}
          <div className="hidden lg:flex justify-end p-2 border-b border-gray-100 dark:border-slate-800">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hover:bg-gray-100"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </Button>
          </div>

          <nav className="p-4 space-y-1 mt-16 lg:mt-0 flex-1">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center rounded-2xl px-4 py-3 transition-all duration-200
                  ${sidebarCollapsed ? 'justify-center' : 'gap-3'}
                  ${
                  activeTab === key
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium whitespace-nowrap">{label}</span>
                )}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link to="/" onClick={handleLogout}>
                <button className={`w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-500/10 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="font-medium whitespace-nowrap">Logout</span>
                  )}
                </button>
              </Link>
            </div>
          </nav>
        </aside>

        {/* ── Main Content ──────────────────────────── */}
        <main className="flex-1 min-w-0 w-full overflow-hidden p-6 transition-all duration-300 lg:p-8">

          {/* ════ DASHBOARD TAB ════ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.22)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/30 lg:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
                      <Sparkles className="size-3.5" />
                      Student Dashboard
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Welcome back to your library space.</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                      Track your borrowed books, discover new titles, and use the assistant to move through your reading journey faster.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 p-4 text-white">
                      <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Admission No</p>
                      <p className="mt-2 text-lg font-semibold">{studentProfile.admissionNo}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/70">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Department</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{studentProfile.department}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/70">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Profile</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{profileCompletion}% complete</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Profile completion warning */}
              {!isProfileComplete && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 overflow-hidden">
                  <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-amber-800 truncate">
                      Profile {profileCompletion}% complete — Borrowing is locked
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5 truncate">
                      Complete your profile to 100% to unlock borrowing and returning books.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="ml-auto text-xs font-semibold text-amber-700 border border-amber-400 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    Complete Now
                  </button>
                </div>
              )}

              {/* Borrowed Books */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-slate-100">Borrowed Books</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {historyRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow dark:bg-slate-900 dark:shadow-black/20"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100">{record.bookName}</h3>
                        <Badge className={`${getStatusColor(record.status)} flex items-center gap-1`}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-slate-100">Available Books</h2>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium dark:text-slate-300">
                    <span>Department:</span>
                  </div>
                  {departments.map((department) => (
                    <button
                      key={department}
                      onClick={() => setSelectedDepartment(department)}
                      className={`rounded-full px-4 py-2 text-sm transition-all border ${
                        selectedDepartment === department
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-300'
                      }`}
                    >
                      {department}
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <div className="relative max-w-lg w-full md:w-1/2 lg:w-1/3">
                    {/* highlighted search box, left-aligned */}
                    <div className="relative bg-white border border-amber-200 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-amber-300 dark:border-amber-500/30 dark:bg-slate-900">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                      <Input
                        type="text"
                        placeholder="Search for books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 rounded-lg w-full text-base py-3 bg-transparent border-none"
                      />
                    </div>
                  </div>
                </div>

                {availableBooks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                    No available books found for {selectedDepartment}.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {availableBooks.slice(0, 12).map((book) => (
                      <div
                        key={book.id}
                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow dark:bg-slate-900 dark:shadow-black/20"
                      >
                        <div className="bg-gray-50 p-4 flex items-center justify-center dark:bg-slate-800">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-72 object-contain"
                          />
                        </div>
                        <div className="p-4">
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600">{book.department}</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 dark:text-slate-100">{book.title}</h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2 dark:text-slate-400">{book.author}</p>
                          <Button
                            disabled={!isProfileComplete}
                            className="w-full whitespace-nowrap bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProfileComplete ? 'Borrow' : <><Lock className="w-3.5 h-3.5 mr-1" /> Locked</>}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ════ PROFILE TAB ════ */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6 dark:text-slate-100">Profile Details</h1>

              <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-slate-900 dark:shadow-black/20">
                {/* Avatar + name */}
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">{studentProfile.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{studentProfile.admissionNo}</p>
                    <p className="text-xs text-gray-400 mt-0.5 dark:text-slate-500">{studentProfile.department}</p>
                  </div>
                </div>

                {/* ── Profile Completion Bar ── */}
                <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100 dark:border-slate-800 dark:bg-slate-800/70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Profile Completion</span>
                    <span
                      className={`text-sm font-bold ${
                        profileCompletion === 100 ? 'text-green-600' : 'text-amber-600'
                      }`}
                    >
                      {profileCompletion}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden dark:bg-slate-700">
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
              <h1 className="text-2xl font-bold text-gray-900 mb-6 dark:text-slate-100">Book History</h1>
              <div className="bg-white rounded-xl shadow-md overflow-hidden dark:bg-slate-900 dark:shadow-black/20">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-amber-50 dark:bg-amber-500/10">
                      <tr>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Book Name</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue Date</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Return Date</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Review</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Return</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {historyRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-slate-800/60">
                          <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-slate-100">{record.bookName}</td>
                          <td className="px-5 py-4 text-sm text-gray-600 dark:text-slate-400">{record.issueDate}</td>
                          <td className="px-5 py-4 text-sm text-gray-600 dark:text-slate-400">{record.returnDate}</td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <Badge className={`${getStatusColor(record.status)} flex items-center gap-1 w-fit`}>
                              {getStatusIcon(record.status)}
                              {record.status}
                            </Badge>
                          </td>

                          {/* COMMENT */}
                          <td className="px-5 py-4 align-top">
                            <textarea
                              value={record.comment}
                              onChange={(e) => updateComment(record.id, e.target.value)}
                              disabled={record.status !== 'returned'}
                              placeholder={
                                record.status === 'returned'
                                  ? 'Write review...'
                                  : 'Return book to review'
                              }
                              className="text-sm border border-gray-200 rounded-lg p-2.5 w-full min-w-[180px] min-h-[60px] max-h-32 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-50 disabled:text-gray-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                            />
                          </td>

                          {/* RETURN BUTTON */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <Button
                              onClick={() => handleReturnBook(record.id)}
                              disabled={record.status === 'returned'}
                              className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                            >
                              {record.status === 'returned' ? 'Returned' : 'Return'}
                            </Button>
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
            <ChatbotPage />
          )}

          {/* ════ ABOUT TAB ════ */}
          {activeTab === 'about' && (
            <div className="max-w-4xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6 dark:text-slate-100">About Library</h1>
              <div className="bg-white rounded-xl shadow-md p-6 space-y-8 dark:bg-slate-900 dark:shadow-black/20">
                {/* PCE Library Overview */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 dark:text-slate-100">PCE Library</h2>
                  <p className="text-gray-600 mb-3 dark:text-slate-300">
                    PCE Library is Fully Automated Library with 26,273 plus collections. The collection can be searched from public web OPAC and Rack Index. Checked out books can be monitored through the Book Verification System.
                  </p>
                  <p className="text-gray-600 dark:text-slate-300">
                    The patron can see the number of books issued and their due date by the help of Library Web Application. Email alerts will be sent to the patron for all the library transactions and overdue of items in their possession. Number of patrons visiting in the library can be analyzed or summarised by the Student In Out Counter.
                  </p>
                </div>

                {/* Issue and Return */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 dark:text-slate-100">Issue and Return</h2>
                  <p className="text-gray-600 mb-4 dark:text-slate-300">The Issue and Return System for Faculty and Students:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                        <tr className="bg-amber-50">
                          <td className="border border-gray-200 px-4 py-2 font-semibold text-gray-700">Faculty</td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-600">Book Borrow Duration</td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-600">1 Semester</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2 font-semibold text-gray-700">Student</td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-600">Book Borrow Duration</td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-600">15 Days</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2 font-semibold text-gray-700">Student</td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-600">Penalty for Late Return (Books)</td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-600">Rs. 2/- per unit per day</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2 font-semibold text-gray-700">Student</td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-600">Penalty for Late Return (Reference Books)</td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-600">Rs. 10/- per unit per day</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Membership Details */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 dark:text-slate-100">Membership Details</h2>
                  <p className="text-gray-600 mb-3 dark:text-slate-300">For students, faculty and staff of:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4 dark:text-slate-300">
                    <li><strong>Pillai Campus Colleges</strong> — Against a valid Library Card</li>
                    <li><strong>Other Colleges</strong> — Against a Reference Letter from their Librarian / Principal</li>
                  </ul>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2 text-gray-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-slate-200">
                    <p className="font-semibold">Membership Terms:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-sm">
                      <li>Only PCE Students Faculty and Staff as registered members are allowed to use the PCE Library.</li>
                      <li>Members should produce their Library Membership card at the entrance of the Library.</li>
                    </ul>
                  </div>
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-500/10 dark:border-blue-500/30">
                    <p className="font-semibold text-gray-700 mb-2 dark:text-slate-200">PCE Library Memberships:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-slate-300">
                      <li>IUCEE Indo US Collaboration for Engineering Education</li>
                    </ul>
                  </div>
                </div>

                {/* Contact Us */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 dark:text-slate-100">Contact Us</h2>
                  <div className="space-y-3 text-gray-600 dark:text-slate-300">
                    <p>
                      <span className="font-semibold text-gray-700">Ask the Librarian:</span> pcelibrary@mes.ac.in
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Reception:</span> 022-65748000
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Admission Office:</span> 022-65748009, 022-65748010
                    </p>
                  </div>
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
      <FloatingChatbot onOpen={() => setActiveTab('chatbot')} />
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
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5 border border-gray-100 dark:border-slate-800 dark:bg-slate-800/70">
      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-500/15">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-0.5 dark:text-slate-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}

