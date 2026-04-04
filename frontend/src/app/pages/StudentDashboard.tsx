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
import { mockBooks } from '../data/mockData';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { getUserActiveBorrows, getUserBorrowHistory, updateUserProfile, completeGoogleProfile } from '../data/api';

// ─── History record type ──────────────────────────────────────────────────────
type HistoryRecord = {
  issue_id: number;
  book_id: string;
  book_title: string;
  item_name?: string; // fallback if book_title is missing
  b_date: string;
  b_time: string;
  r_date: string;
  r_time: string;
  status: string;
  comment?: string;
};

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

// ─── Profile Completion Modal ────────────────────────────────────────────────
function ProfileCompletionModal({ user, onComplete }: { user: any; onComplete: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    admission_number: '',
    department: '',
    class_name: '',
    contact_no: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 dark:bg-slate-900 border border-white/20">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
            <Sparkles className="size-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">Complete Your Profile</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 text-center">Please provide a few more details to access the full library features.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</label>
            <Input 
              required 
              placeholder="John Doe" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Department</label>
            <Input 
              required 
              placeholder="Computer Science / Mechanical etc." 
              value={formData.department} 
              onChange={e => setFormData({...formData, department: e.target.value})}
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" 
            />
          </div>
          {user?.new_user && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Admission Number</label>
              <Input 
                required 
                placeholder="2023PE1250" 
                value={formData.admission_number} 
                onChange={e => setFormData({...formData, admission_number: e.target.value})}
                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" 
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Class</label>
            <Input 
              required 
              placeholder="Year 2 / Semester 4" 
              value={formData.class_name} 
              onChange={e => setFormData({...formData, class_name: e.target.value})}
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact Number</label>
            <Input 
              required 
              placeholder="+91 9876543210" 
              value={formData.contact_no} 
              onChange={e => setFormData({...formData, contact_no: e.target.value})}
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" 
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 text-white shadow-lg shadow-blue-500/25">
            {loading ? "Saving Details..." : "Get Started"}
          </Button>
        </form>
      </div>
    </div>
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

  // User Session
  const [user, setUser] = useState<any>(() => {
    const saved = window.localStorage.getItem('smart-library-user');
    return saved ? JSON.parse(saved) : null;
  });

  // Chatbot messages state
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [chatInput, setChatInput] = useState('');

  // Records state
  const [activeBorrows, setActiveBorrows] = useState<HistoryRecord[]>([]);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  // Profile Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(user?.new_user === true);
  const [profileForm, setProfileForm] = useState<any>({
    name: '',
    department: '',
    class_name: '',
    contact_no: ''
  });

  useEffect(() => {
    if (user && user.admission_number) {
      loadUserData();
      // Prep form
      setProfileForm({
        name: user.name || '',
        department: user.department || '',
        class_name: user.class_name || '',
        contact_no: user.contact_no || ''
      });
    }
  }, [user]);

  const loadUserData = async () => {
    setLoadingRecords(true);
    try {
      const active = await getUserActiveBorrows(user.admission_number);
      const history = await getUserBorrowHistory(user.admission_number);
      setActiveBorrows(active);
      setHistoryRecords(history);
    } catch (err) {
      console.error("Failed to fetch records", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  // Profile Completion Calculation
  const profileFields = [
    user?.name,
    user?.admission_number,
    user?.email,
    user?.department,
    user?.class_name,
    user?.contact_no,
  ];
  const filledFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round((filledFields / profileFields.length) * 100);
  const isUserAllProfileFieldsFilled = profileCompletion === 100;

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
  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(user.admission_number, profileForm);
      const newUser = { ...user, ...profileForm };
      setUser(newUser);
      window.localStorage.setItem('smart-library-user', JSON.stringify(newUser));
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleProfileComplete = async (data: any) => {
    try {
      if (user?.new_user) {
        // Use the complete profile API for new Google users
        const payload = {
          email: user?.email,
          admission_number: data.admission_number || data.admission_no, // backend expects admission_number
          name: data.name,
          departement: data.department, // backend has typo 'departement'
          class_name: data.class_name,
          contact_no: data.contact_no
        };
        const res = await completeGoogleProfile(payload);
        const newUser = { ...user, ...data, admission_number: res.admission_number, new_user: false };
        setUser(newUser);
        window.localStorage.setItem('smart-library-user', JSON.stringify(newUser));
        setShowCompletionModal(false);
        loadUserData();
      } else {
        // Standard update
        await updateUserProfile(user.admission_number, data);
        const newUser = { ...user, ...data };
        setUser(newUser);
        window.localStorage.setItem('smart-library-user', JSON.stringify(newUser));
        setShowCompletionModal(false);
      }
    } catch (err) {
      alert("Failed to complete profile registration.");
    }
  };

  const handleReturnBook = (id: number) => {
    // In a real app, this would call return API
    alert("Please visit the library counter to return this book physically.");
  };

  const handleLogout = () => {
    window.localStorage.removeItem('smart-library-student-auth');
    window.localStorage.removeItem('smart-library-user');
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

      {/* Completion Modal for New Users */}
      {showCompletionModal && (
        <ProfileCompletionModal user={user} onComplete={handleProfileComplete} />
      )}

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
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{user?.admission_number}</p>
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
                      <p className="mt-2 text-lg font-semibold">{user?.admission_number}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/70">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Department</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.department}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/70">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Profile</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{profileCompletion}% complete</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Profile completion warning */}
              {!isUserAllProfileFieldsFilled && (
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
                {loadingRecords ? (
                   <div className="h-32 flex items-center justify-center bg-white rounded-xl dark:bg-slate-900">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                   </div>
                ) : activeBorrows.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white/50 p-8 text-center text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-900/50">
                    No books borrowed yet.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeBorrows.map((record) => (
                      <div
                        key={record.issue_id}
                        className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow dark:bg-slate-900 dark:shadow-black/20"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900 dark:text-slate-100">{record.book_title || record.item_name}</h3>
                          <Badge className={`${getStatusColor(record.status)} flex items-center gap-1`}>
                            {getStatusIcon(record.status)}
                            {record.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                          <div className="flex justify-between">
                            <span>Issue Date:</span>
                            <span className="font-medium">{record.b_date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Return Date:</span>
                            <span className="font-medium">{record.r_date}</span>
                          </div>
                        </div>
                        {record.status === 'pending' && (
                          <Button
                            disabled={!isUserAllProfileFieldsFilled}
                            className="w-full mt-4 bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUserAllProfileFieldsFilled ? 'Renew Book' : <><Lock className="w-4 h-4 mr-1" /> Locked</>}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow dark:bg-slate-900 dark:shadow-black/20 flex h-full flex-col"
                      >
                        <div className="bg-gray-50 p-4 flex items-center justify-center dark:bg-slate-800">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-72 object-contain"
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600">{book.department}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 dark:text-slate-100">{book.title}</h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 dark:text-slate-400">{book.author}</p>
                          </div>
                          <Button
                            disabled={!isUserAllProfileFieldsFilled}
                            className="w-full whitespace-nowrap bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                          >
                            {isUserAllProfileFieldsFilled ? 'Borrow' : <><Lock className="w-3.5 h-3.5 mr-1" /> Locked</>}
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
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">{user?.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{user?.admission_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5 dark:text-slate-500">{user?.department}</p>
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
                  {isEditing ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Name</label>
                        <Input value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Department</label>
                        <Input value={profileForm.department} onChange={e => setProfileForm({...profileForm, department: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Class</label>
                        <Input value={profileForm.class_name} onChange={e => setProfileForm({...profileForm, class_name: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Contact</label>
                        <Input value={profileForm.contact_no} onChange={e => setProfileForm({...profileForm, contact_no: e.target.value})} />
                      </div>
                    </>
                  ) : (
                    <>
                      <ProfileField
                        icon={<User className="w-4 h-4 text-amber-600" />}
                        label="Full Name"
                        value={user?.name}
                      />
                      <ProfileField
                        icon={<Hash className="w-4 h-4 text-amber-600" />}
                        label="Admission Number"
                        value={user?.admission_number}
                      />
                      <ProfileField
                        icon={<Mail className="w-4 h-4 text-amber-600" />}
                        label="Email Address"
                        value={user?.email}
                      />
                      <ProfileField
                        icon={<BookOpen className="w-4 h-4 text-amber-600" />}
                        label="Department"
                        value={user?.department}
                      />
                      <ProfileField
                        icon={<GraduationCap className="w-4 h-4 text-amber-600" />}
                        label="Class"
                        value={user?.class_name || 'Not set'}
                      />
                      <ProfileField
                        icon={<Phone className="w-4 h-4 text-amber-600" />}
                        label="Contact Number"
                        value={user?.contact_no || 'Not set'}
                      />
                    </>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700 rounded-lg">Save Changes</Button>
                      <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} className="bg-amber-600 hover:bg-amber-700 rounded-lg">Edit Profile</Button>
                  )}
                </div>
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
                      {loadingRecords ? (
                        <tr>
                           <td colSpan={6} className="px-5 py-20 text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                           </td>
                        </tr>
                      ) : historyRecords.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-5 py-20 text-center text-gray-500">
                              No borrowing history.
                           </td>
                        </tr>
                      ) : (
                        historyRecords.map((record) => (
                          <tr key={record.issue_id} className="hover:bg-gray-50 transition-colors dark:hover:bg-slate-800/60">
                            <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-slate-100">{record.book_title || record.item_name}</td>
                            <td className="px-5 py-4 text-sm text-gray-600 dark:text-slate-400">{record.b_date}</td>
                            <td className="px-5 py-4 text-sm text-gray-600 dark:text-slate-400">{record.r_date}</td>

                            <td className="px-5 py-4 whitespace-nowrap">
                              <Badge className={`${getStatusColor(record.status)} flex items-center gap-1 w-fit`}>
                                {getStatusIcon(record.status)}
                                {record.status}
                              </Badge>
                            </td>

                            <td className="px-5 py-4 align-top">
                              <textarea
                                value={record.comment || ''}
                                readOnly
                                disabled={record.status !== 'returned'}
                                placeholder={
                                  record.status === 'returned'
                                    ? 'Visit chat to review...'
                                    : 'Return book to review'
                                }
                                className="text-sm border border-gray-200 rounded-lg p-2.5 w-full min-w-[180px] min-h-[60px] max-h-32 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-50 disabled:text-gray-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                              />
                            </td>

                            <td className="px-5 py-4 whitespace-nowrap">
                              <Button
                                onClick={() => handleReturnBook(record.issue_id)}
                                disabled={record.status === 'returned'}
                                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                              >
                                {record.status === 'returned' ? 'Returned' : 'Return'}
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ CHATBOT TAB ════ */}
          {activeTab === 'chatbot' && (
            <ChatbotPage user_id={user?.admission_number} department={user?.department} name={user?.name} />
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

