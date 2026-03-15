import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen, LogOut, Clock, CheckCircle, AlertTriangle, Calendar,
  BookMarked, History, User, GraduationCap, Menu, X,
  ChevronRight, Bell, Search, BookCopy, ArrowUpRight
} from "lucide-react";
import { Chatbot } from "../components/Chatbot";

const studentInfo = {
  name: "Arjun Sharma",
  id: "STU2024",
  email: "arjun.sharma@university.edu",
  class: "Section A",
  department: "Computer Science & Engineering",
  branch: "B.Tech CSE",
  year: "3rd Year (2024–25)",
  phone: "+91 98765-43210",
  avatar: "AS",
};

const borrowedBooks = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Cormen, Leiserson, Rivest, Stein",
    isbn: "978-0262033848",
    dateIssued: "2026-02-15",
    dateBorrowed: "2026-02-15",
    dueDate: "2026-03-01",
    status: "Overdue",
    coverColor: "bg-red-600",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    dateIssued: "2026-03-01",
    dateBorrowed: "2026-03-01",
    dueDate: "2026-03-15",
    status: "Active",
    coverColor: "bg-blue-600",
  },
];

const historyRecords = [
  {
    id: 1,
    title: "The Pragmatic Programmer",
    author: "Hunt & Thomas",
    dateIssued: "2025-11-10",
    dateBorrowed: "2025-11-10",
    dateReturned: "2025-11-24",
    status: "Returned",
  },
  {
    id: 2,
    title: "Operating System Concepts",
    author: "Silberschatz",
    dateIssued: "2025-12-01",
    dateBorrowed: "2025-12-01",
    dateReturned: "2025-12-15",
    status: "Returned",
  },
  {
    id: 3,
    title: "Database Management Systems",
    author: "Ramakrishnan",
    dateIssued: "2026-01-10",
    dateBorrowed: "2026-01-10",
    dateReturned: "2026-01-24",
    status: "Returned",
  },
  {
    id: 4,
    title: "Computer Networks",
    author: "Andrew Tanenbaum",
    dateIssued: "2026-02-01",
    dateBorrowed: "2026-02-01",
    dateReturned: "2026-02-14",
    status: "Returned",
  },
  {
    id: 5,
    title: "Introduction to Algorithms",
    author: "Cormen et al.",
    dateIssued: "2026-02-15",
    dateBorrowed: "2026-02-15",
    dateReturned: null,
    status: "Overdue",
  },
  {
    id: 6,
    title: "Clean Code",
    author: "Robert C. Martin",
    dateIssued: "2026-03-01",
    dateBorrowed: "2026-03-01",
    dateReturned: null,
    status: "Active",
  },
];

type Tab = "dashboard" | "borrow" | "profile";

export function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statusColor = (status: string) => {
    if (status === "Returned") return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
    if (status === "Active") return "bg-blue-500/15 text-blue-400 border border-blue-500/20";
    if (status === "Overdue") return "bg-red-500/15 text-red-400 border border-red-500/20";
    return "bg-slate-500/15 text-slate-400";
  };

  const statusIcon = (status: string) => {
    if (status === "Returned") return <CheckCircle className="w-3.5 h-3.5" />;
    if (status === "Active") return <Clock className="w-3.5 h-3.5" />;
    if (status === "Overdue") return <AlertTriangle className="w-3.5 h-3.5" />;
    return null;
  };

  const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "My Dashboard", icon: BookOpen },
    { id: "borrow", label: "Borrow Records", icon: BookCopy },
    { id: "profile", label: "My Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "280px", background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white" style={{ fontWeight: 700, fontSize: "1rem" }}>LibraMS</p>
              <p className="text-slate-500" style={{ fontSize: "0.7rem" }}>Student Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student info */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
            <div className="w-10 h-10 bg-blue-600/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400" style={{ fontWeight: 700 }}>{studentInfo.avatar}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white truncate" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{studentInfo.name}</p>
              <p className="text-slate-500" style={{ fontSize: "0.72rem" }}>{studentInfo.id} · {studentInfo.year}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* History Section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-slate-400" />
            <p className="text-slate-400" style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Borrow History
            </p>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {historyRecords.map((record) => (
              <div key={record.id} className="bg-white/5 rounded-xl p-3 hover:bg-white/8 transition-all">
                <p className="text-white truncate mb-1" style={{ fontSize: "0.78rem", fontWeight: 500 }}>{record.title}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500" style={{ fontSize: "0.68rem" }}>Issued:</span>
                    <span className="text-slate-400" style={{ fontSize: "0.68rem" }}>{record.dateIssued}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500" style={{ fontSize: "0.68rem" }}>Return:</span>
                    <span className={record.dateReturned ? "text-emerald-400" : "text-red-400"} style={{ fontSize: "0.68rem" }}>
                      {record.dateReturned ?? "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500" style={{ fontSize: "0.68rem" }}>Status:</span>
                    <span className={`flex items-center gap-1 ${
                      record.status === "Returned" ? "text-emerald-400" :
                      record.status === "Overdue" ? "text-red-400" : "text-blue-400"
                    }`} style={{ fontSize: "0.68rem" }}>
                      {statusIcon(record.status)}
                      {record.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <div className="p-4 border-t border-white/5">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search books..."
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-all"
                style={{ fontSize: "0.875rem" }}
              />
            </div>
          </div>
          <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto pb-20">
          {/* Dashboard tab */}
          {activeTab === "dashboard" && (
            <div>
              <div className="mb-6">
                <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                  Welcome back, {studentInfo.name.split(" ")[0]}! 👋
                </h1>
                <p className="text-slate-400" style={{ fontSize: "0.875rem" }}>
                  Here's your library activity overview
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Currently Borrowed", value: "2", icon: BookMarked, color: "text-blue-400", bg: "bg-blue-500/10" },
                  { label: "Overdue Books", value: "1", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
                  { label: "Total Borrowed", value: "6", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { label: "Books Returned", value: "4", icon: CheckCircle, color: "text-amber-400", bg: "bg-amber-500/10" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                    <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <p className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{stat.value}</p>
                    <p className="text-slate-500" style={{ fontSize: "0.78rem" }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Student Details Card */}
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-5">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <h2 className="text-white" style={{ fontWeight: 600, fontSize: "1rem" }}>Student Details</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Class / Section", value: studentInfo.class, icon: "🏫" },
                    { label: "Department", value: studentInfo.department, icon: "🏛️" },
                    { label: "Branch", value: studentInfo.branch, icon: "📚" },
                    { label: "Academic Year", value: studentInfo.year, icon: "🎓" },
                  ].map((detail) => (
                    <div key={detail.label} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ fontSize: "1.1rem" }}>{detail.icon}</span>
                        <p className="text-slate-400" style={{ fontSize: "0.75rem" }}>{detail.label}</p>
                      </div>
                      <p className="text-white" style={{ fontSize: "0.875rem", fontWeight: 600 }}>{detail.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currently Borrowed */}
              <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookMarked className="w-5 h-5 text-blue-400" />
                    <h2 className="text-white" style={{ fontWeight: 600 }}>Currently Borrowed</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("borrow")}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                    style={{ fontSize: "0.8rem" }}
                  >
                    View all <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-white/5">
                  {borrowedBooks.map((book) => (
                    <div key={book.id} className="px-5 py-4 flex items-center gap-4">
                      <div className={`w-10 h-14 ${book.coverColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white truncate" style={{ fontSize: "0.9rem", fontWeight: 600 }}>{book.title}</p>
                        <p className="text-slate-500 truncate" style={{ fontSize: "0.78rem" }}>{book.author}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-400" style={{ fontSize: "0.72rem" }}>Issued: {book.dateIssued}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span className={book.status === "Overdue" ? "text-red-400" : "text-slate-400"} style={{ fontSize: "0.72rem" }}>
                              Due: {book.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 flex-shrink-0 ${statusColor(book.status)}`} style={{ fontSize: "0.75rem" }}>
                        {statusIcon(book.status)}
                        {book.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Borrow Records tab */}
          {activeTab === "borrow" && (
            <div>
              <div className="mb-6">
                <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>Borrow Records</h1>
                <p className="text-slate-400" style={{ fontSize: "0.875rem" }}>All your book borrowing details</p>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Total Issues", value: historyRecords.length, color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
                  { label: "Active Borrows", value: historyRecords.filter(r => r.status === "Active").length, color: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
                  { label: "Successfully Returned", value: historyRecords.filter(r => r.status === "Returned").length, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
                ].map((card) => (
                  <div key={card.label} className={`rounded-2xl border p-4 ${card.color}`}>
                    <p style={{ fontSize: "1.75rem", fontWeight: 700 }}>{card.value}</p>
                    <p style={{ fontSize: "0.8rem" }}>{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Active borrows */}
              <h2 className="text-white mb-3" style={{ fontWeight: 600, fontSize: "1rem" }}>Currently Borrowed</h2>
              <div className="space-y-3 mb-8">
                {borrowedBooks.map((book) => (
                  <div key={book.id} className="bg-slate-900 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-16 ${book.coverColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <p className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>{book.title}</p>
                            <p className="text-slate-400" style={{ fontSize: "0.82rem" }}>{book.author}</p>
                            <p className="text-slate-600" style={{ fontSize: "0.75rem" }}>ISBN: {book.isbn}</p>
                          </div>
                          <span className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${statusColor(book.status)}`} style={{ fontSize: "0.8rem" }}>
                            {statusIcon(book.status)}
                            {book.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                          <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-slate-500 mb-1" style={{ fontSize: "0.7rem" }}>DATE ISSUED</p>
                            <p className="text-white" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{book.dateIssued}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-slate-500 mb-1" style={{ fontSize: "0.7rem" }}>DATE OF BORROWING</p>
                            <p className="text-white" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{book.dateBorrowed}</p>
                          </div>
                          <div className={`rounded-xl p-3 ${book.status === "Overdue" ? "bg-red-500/10 border border-red-500/20" : "bg-white/5"}`}>
                            <p className="text-slate-500 mb-1" style={{ fontSize: "0.7rem" }}>DATE OF RETURN</p>
                            <p className={book.status === "Overdue" ? "text-red-400" : "text-white"} style={{ fontSize: "0.875rem", fontWeight: 500 }}>{book.dueDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full History Table */}
              <h2 className="text-white mb-3" style={{ fontWeight: 600, fontSize: "1rem" }}>Complete History</h2>
              <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {["Book Title", "Date Issued", "Date of Borrowing", "Date of Return", "Status"].map((h) => (
                          <th key={h} className="text-left px-5 py-4 text-slate-400" style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {historyRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-5 py-4">
                            <p className="text-white" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{record.title}</p>
                            <p className="text-slate-500" style={{ fontSize: "0.75rem" }}>{record.author}</p>
                          </td>
                          <td className="px-5 py-4 text-slate-400" style={{ fontSize: "0.875rem" }}>{record.dateIssued}</td>
                          <td className="px-5 py-4 text-slate-400" style={{ fontSize: "0.875rem" }}>{record.dateBorrowed}</td>
                          <td className="px-5 py-4">
                            {record.dateReturned ? (
                              <span className="text-emerald-400" style={{ fontSize: "0.875rem" }}>{record.dateReturned}</span>
                            ) : (
                              <span className={record.status === "Overdue" ? "text-red-400" : "text-amber-400"} style={{ fontSize: "0.875rem" }}>
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 w-fit ${statusColor(record.status)}`} style={{ fontSize: "0.75rem" }}>
                              {statusIcon(record.status)}
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Profile tab */}
          {activeTab === "profile" && (
            <div>
              <div className="mb-6">
                <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>My Profile</h1>
                <p className="text-slate-400" style={{ fontSize: "0.875rem" }}>Your student information and account details</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile card */}
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 text-center">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-400" style={{ fontSize: "1.75rem", fontWeight: 700 }}>{studentInfo.avatar}</span>
                  </div>
                  <p className="text-white mb-1" style={{ fontWeight: 700, fontSize: "1.1rem" }}>{studentInfo.name}</p>
                  <p className="text-slate-400 mb-1" style={{ fontSize: "0.85rem" }}>{studentInfo.id}</p>
                  <p className="text-slate-500 mb-4" style={{ fontSize: "0.8rem" }}>{studentInfo.email}</p>
                  <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl">
                    <GraduationCap className="w-4 h-4" />
                    <span style={{ fontSize: "0.82rem" }}>Active Student</span>
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <h2 className="text-white mb-5" style={{ fontWeight: 600, fontSize: "1rem" }}>Academic Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", value: studentInfo.name },
                      { label: "Student ID", value: studentInfo.id },
                      { label: "Class / Section", value: studentInfo.class },
                      { label: "Department", value: studentInfo.department },
                      { label: "Branch", value: studentInfo.branch },
                      { label: "Academic Year", value: studentInfo.year },
                      { label: "Email Address", value: studentInfo.email },
                      { label: "Phone Number", value: studentInfo.phone },
                    ].map((field) => (
                      <div key={field.label} className="bg-white/5 rounded-xl p-4">
                        <p className="text-slate-500 mb-1" style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{field.label}</p>
                        <p className="text-white" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{field.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
