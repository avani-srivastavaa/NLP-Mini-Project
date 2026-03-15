import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen, Users, RotateCcw, AlertTriangle, LogOut, Search, Plus,
  TrendingUp, BookMarked, CheckCircle, Clock, Menu, X, ChevronDown,
  Edit2, Trash2, Eye, Bell, Settings, BarChart3, BookCopy
} from "lucide-react";

const mockBooks = [
  { id: 1, title: "Introduction to Algorithms", author: "Cormen, Leiserson", isbn: "978-0262033848", category: "Computer Science", copies: 5, available: 2, status: "Available" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", category: "Programming", copies: 3, available: 0, status: "All Borrowed" },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", category: "Literature", copies: 4, available: 3, status: "Available" },
  { id: 4, title: "Calculus: Early Transcendentals", author: "James Stewart", isbn: "978-1285741550", category: "Mathematics", copies: 6, available: 1, status: "Available" },
  { id: 5, title: "Organic Chemistry", author: "Paula Yurkanis", isbn: "978-0321967862", category: "Chemistry", copies: 3, available: 3, status: "Available" },
  { id: 6, title: "Data Structures", author: "Narasimha Karumanchi", isbn: "978-8192107592", category: "Computer Science", copies: 4, available: 0, status: "All Borrowed" },
];

const mockBorrows = [
  { id: 1, student: "Arjun Sharma", studentId: "STU2024", book: "Introduction to Algorithms", issued: "2026-02-15", due: "2026-03-01", returned: null, status: "Overdue" },
  { id: 2, student: "Priya Patel", studentId: "STU2025", book: "Clean Code", issued: "2026-03-01", due: "2026-03-15", returned: null, status: "Active" },
  { id: 3, student: "Rohan Mehta", studentId: "STU2026", book: "The Great Gatsby", issued: "2026-02-20", due: "2026-03-06", returned: "2026-03-05", status: "Returned" },
  { id: 4, student: "Sneha Iyer", studentId: "STU2027", book: "Calculus: Early Transcendentals", issued: "2026-03-05", due: "2026-03-19", returned: null, status: "Active" },
  { id: 5, student: "Rahul Gupta", studentId: "STU2028", book: "Data Structures", issued: "2026-03-10", due: "2026-03-24", returned: null, status: "Active" },
];

const mockStudents = [
  { id: "STU2024", name: "Arjun Sharma", dept: "Computer Science", branch: "B.Tech CSE", year: "3rd Year", borrowed: 2 },
  { id: "STU2025", name: "Priya Patel", dept: "Electronics", branch: "B.Tech ECE", year: "2nd Year", borrowed: 1 },
  { id: "STU2026", name: "Rohan Mehta", dept: "Mechanical", branch: "B.Tech ME", year: "4th Year", borrowed: 0 },
  { id: "STU2027", name: "Sneha Iyer", dept: "Civil", branch: "B.Tech CE", year: "1st Year", borrowed: 1 },
  { id: "STU2028", name: "Rahul Gupta", dept: "Computer Science", branch: "B.Tech CSE", year: "2nd Year", borrowed: 1 },
];

type Tab = "overview" | "books" | "borrows" | "students";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Books", value: "248", icon: BookOpen, color: "bg-blue-500/20 text-blue-400", change: "+12 this month" },
    { label: "Active Borrows", value: "34", icon: BookMarked, color: "bg-amber-500/20 text-amber-400", change: "4 due today" },
    { label: "Total Students", value: "156", icon: Users, color: "bg-emerald-500/20 text-emerald-400", change: "+8 this semester" },
    { label: "Overdue Returns", value: "7", icon: AlertTriangle, color: "bg-red-500/20 text-red-400", change: "Action needed" },
  ];

  const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "books", label: "Books", icon: BookCopy },
    { id: "borrows", label: "Borrow Records", icon: RotateCcw },
    { id: "students", label: "Students", icon: Users },
  ];

  const statusColor = (status: string) => {
    if (status === "Returned") return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
    if (status === "Active") return "bg-blue-500/15 text-blue-400 border border-blue-500/20";
    if (status === "Overdue") return "bg-red-500/15 text-red-400 border border-red-500/20";
    if (status === "All Borrowed") return "bg-amber-500/15 text-amber-400 border border-amber-500/20";
    return "bg-slate-500/15 text-slate-400 border border-slate-500/20";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/5 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white" style={{ fontWeight: 700, fontSize: "1rem" }}>LibraMS</p>
              <p className="text-slate-500" style={{ fontSize: "0.7rem" }}>Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-indigo-600/30 rounded-xl flex items-center justify-center">
              <span className="text-indigo-400" style={{ fontWeight: 700, fontSize: "0.875rem" }}>A</span>
            </div>
            <div>
              <p className="text-white" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Admin User</p>
              <p className="text-slate-500" style={{ fontSize: "0.75rem" }}>admin@library.edu</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span style={{ fontSize: "0.875rem" }}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search books, students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500 transition-all"
                style={{ fontSize: "0.875rem" }}
              />
            </div>
          </div>
          <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <div className="mb-6">
                <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>Dashboard Overview</h1>
                <p className="text-slate-400" style={{ fontSize: "0.875rem" }}>Welcome back, Admin. Here's what's happening today.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-slate-900 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <TrendingUp className="w-4 h-4 text-slate-600" />
                    </div>
                    <p className="text-white mb-1" style={{ fontSize: "1.75rem", fontWeight: 700 }}>{stat.value}</p>
                    <p className="text-slate-400" style={{ fontSize: "0.875rem" }}>{stat.label}</p>
                    <p className="text-slate-600 mt-1" style={{ fontSize: "0.75rem" }}>{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Recent borrows */}
              <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden mb-6">
                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-white" style={{ fontWeight: 600 }}>Recent Borrow Activity</h2>
                  <button onClick={() => setActiveTab("borrows")} className="text-indigo-400 hover:text-indigo-300 transition-colors" style={{ fontSize: "0.8rem" }}>
                    View all →
                  </button>
                </div>
                <div className="divide-y divide-white/5">
                  {mockBorrows.slice(0, 4).map((borrow) => (
                    <div key={borrow.id} className="px-5 py-3.5 flex items-center gap-4">
                      <div className="w-9 h-9 bg-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white truncate" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{borrow.student}</p>
                        <p className="text-slate-500 truncate" style={{ fontSize: "0.75rem" }}>{borrow.book}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-slate-400" style={{ fontSize: "0.75rem" }}>Due: {borrow.due}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs flex-shrink-0 ${statusColor(borrow.status)}`}>
                        {borrow.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Issue Book", icon: BookMarked, color: "bg-indigo-600", action: () => setActiveTab("borrows") },
                  { label: "Add New Book", icon: Plus, color: "bg-emerald-600", action: () => setActiveTab("books") },
                  { label: "View Students", icon: Users, color: "bg-blue-600", action: () => setActiveTab("students") },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={action.action}
                    className={`${action.color} hover:opacity-90 text-white rounded-2xl p-4 flex items-center gap-3 transition-all`}
                  >
                    <action.icon className="w-5 h-5" />
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Books */}
          {activeTab === "books" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>Books Management</h1>
                  <p className="text-slate-400" style={{ fontSize: "0.875rem" }}>Manage library book inventory</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 transition-all">
                  <Plus className="w-4 h-4" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Add Book</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-5 py-4 text-slate-400" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Book Title</th>
                        <th className="text-left px-5 py-4 text-slate-400 hidden md:table-cell" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Author</th>
                        <th className="text-left px-5 py-4 text-slate-400 hidden lg:table-cell" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</th>
                        <th className="text-left px-5 py-4 text-slate-400" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Copies</th>
                        <th className="text-left px-5 py-4 text-slate-400" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                        <th className="text-left px-5 py-4 text-slate-400" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {mockBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-5 py-4">
                            <div>
                              <p className="text-white" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{book.title}</p>
                              <p className="text-slate-500 md:hidden" style={{ fontSize: "0.75rem" }}>{book.author}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-400 hidden md:table-cell" style={{ fontSize: "0.875rem" }}>{book.author}</td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <span className="bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/20" style={{ fontSize: "0.75rem" }}>{book.category}</span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-white" style={{ fontSize: "0.875rem" }}>{book.available}/{book.copies}</p>
                            <p className="text-slate-500" style={{ fontSize: "0.75rem" }}>available</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs ${statusColor(book.status)}`}>{book.status}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Borrows */}
          {activeTab === "borrows" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>Borrow Records</h1>
                  <p className="text-slate-400" style={{ fontSize: "0.875rem" }}>Track all book issue and return records</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 transition-all">
                  <Plus className="w-4 h-4" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Issue Book</span>
                </button>
              </div>

              {/* Filter chips */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {["All", "Active", "Overdue", "Returned"].map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-1.5 rounded-xl border transition-all ${
                      filter === "All"
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                    style={{ fontSize: "0.8rem" }}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {["Student", "Book", "Date Issued", "Date of Borrowing", "Return Date", "Status", "Action"].map((h) => (
                          <th key={h} className="text-left px-5 py-4 text-slate-400" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {mockBorrows.map((borrow) => (
                        <tr key={borrow.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-5 py-4">
                            <p className="text-white" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{borrow.student}</p>
                            <p className="text-slate-500" style={{ fontSize: "0.75rem" }}>{borrow.studentId}</p>
                          </td>
                          <td className="px-5 py-4 text-slate-300" style={{ fontSize: "0.875rem" }}>{borrow.book}</td>
                          <td className="px-5 py-4 text-slate-400" style={{ fontSize: "0.875rem" }}>{borrow.issued}</td>
                          <td className="px-5 py-4 text-slate-400" style={{ fontSize: "0.875rem" }}>{borrow.issued}</td>
                          <td className="px-5 py-4">
                            <p className="text-slate-400" style={{ fontSize: "0.875rem" }}>{borrow.due}</p>
                            {borrow.returned && (
                              <p className="text-emerald-400" style={{ fontSize: "0.75rem" }}>Returned: {borrow.returned}</p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs ${statusColor(borrow.status)}`}>{borrow.status}</span>
                          </td>
                          <td className="px-5 py-4">
                            {borrow.status !== "Returned" && (
                              <button className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-all" style={{ fontSize: "0.75rem" }}>
                                <CheckCircle className="w-3.5 h-3.5" />
                                Mark Returned
                              </button>
                            )}
                            {borrow.status === "Returned" && (
                              <span className="text-slate-600" style={{ fontSize: "0.8rem" }}>—</span>
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

          {/* Students */}
          {activeTab === "students" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>Student Directory</h1>
                  <p className="text-slate-400" style={{ fontSize: "0.875rem" }}>Manage enrolled students and their borrowing</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 transition-all">
                  <Plus className="w-4 h-4" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Add Student</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mockStudents.map((student) => (
                  <div key={student.id} className="bg-slate-900 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 bg-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-400" style={{ fontWeight: 700 }}>{student.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-white" style={{ fontWeight: 600, fontSize: "0.9rem" }}>{student.name}</p>
                        <p className="text-slate-500" style={{ fontSize: "0.75rem" }}>{student.id}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {[
                        { label: "Department", value: student.dept },
                        { label: "Branch", value: student.branch },
                        { label: "Year", value: student.year },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between">
                          <span className="text-slate-500" style={{ fontSize: "0.8rem" }}>{item.label}</span>
                          <span className="text-slate-300" style={{ fontSize: "0.8rem" }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400" style={{ fontSize: "0.8rem" }}>{student.borrowed} borrowed</span>
                      </div>
                      <button className="text-indigo-400 hover:text-indigo-300 transition-colors" style={{ fontSize: "0.8rem" }}>
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
