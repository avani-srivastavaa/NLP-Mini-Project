import { useState } from 'react';
import { Link } from 'react-router';
import {
  Shield,
  LayoutDashboard,
  BookOpen,
  Clock,
  Users,
  LogOut,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { mockBooks, mockBorrowRecords, mockStudents } from '../data/mockData';
import { ThemeToggle } from '../components/theme/ThemeToggle';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalBooks = mockBooks.length;
  const borrowedBooks = mockBooks.filter(book => !book.available).length;
  const activeStudents = mockStudents.length;
  const overdueBooks = mockBorrowRecords.filter(record => record.status === 'overdue').length;

  const filteredRecords = statusFilter === 'all' 
    ? mockBorrowRecords 
    : mockBorrowRecords.filter(record => record.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'returned':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  const handleLogout = () => {
    window.localStorage.removeItem('smart-library-admin-auth');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.16),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_48%,_#f8fafc_100%)] transition-colors dark:bg-[radial-gradient(circle_at_top_right,_rgba(71,85,105,0.20),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#111827_52%,_#020617_100%)]">
      {/* Top Bar */}
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
              <Shield className="w-6 h-6 text-gray-800" />
              <span className="font-semibold text-gray-900 hidden sm:block dark:text-slate-100">Admin Dashboard</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search books, students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Librarian</p>
            </div>
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Open Sidebar Button - visible when sidebar is closed on desktop */}
        {!sidebarOpen && (
          <div className="hidden lg:block fixed left-0 top-20 z-20">
            <Button
              variant="default"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="rounded-r-lg rounded-l-none bg-gray-800 hover:bg-gray-900 shadow-lg"
              title="Open sidebar"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 lg:top-[73px] lg:bottom-0
            w-64 border-r border-white/60 bg-white/72 shadow-lg backdrop-blur-xl transform transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/30
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Close Button - visible on desktop */}
          <div className="hidden lg:flex justify-end p-2 border-b border-gray-200 dark:border-slate-800">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="hover:bg-gray-100"
              title="Close sidebar"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          <nav className="p-4 space-y-2 mt-16 lg:mt-0">
            <button
              onClick={() => {
                setActiveTab('overview');
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'overview'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('books');
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'books'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Books Management</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('records');
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'records'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">Borrow Records</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('students');
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'students'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Student Directory</span>
            </button>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link to="/" onClick={handleLogout}>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 p-6 transition-[margin] duration-200 lg:p-8 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
          }`}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.24)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/30 lg:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      Control Center
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Library operations, organized clearly.</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                      Monitor activity, update records, and manage the collection from a calmer admin surface designed for quick decisions.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-2xl bg-slate-950 p-4 text-white dark:bg-slate-100 dark:text-slate-950">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-300 dark:text-slate-500">Role</p>
                      <p className="mt-2 text-lg font-semibold">Librarian</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/70">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Borrowed</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{borrowedBooks} active issues</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/70">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Overdue</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{overdueBooks} pending action</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Stats Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 dark:bg-slate-900 dark:shadow-black/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 dark:text-slate-400">Total Books</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{totalBooks}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 dark:bg-slate-900 dark:shadow-black/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 dark:text-slate-400">Borrowed Books</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{borrowedBooks}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 dark:bg-slate-900 dark:shadow-black/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 dark:text-slate-400">Active Students</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{activeStudents}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 dark:bg-slate-900 dark:shadow-black/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 dark:text-slate-400">Overdue Books</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{overdueBooks}</p>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-white rounded-xl shadow-md p-6 dark:bg-slate-900 dark:shadow-black/20">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-slate-100">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg dark:bg-slate-800/70">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-slate-100">
                        <span className="font-medium">John Doe</span> borrowed{' '}
                        <span className="font-medium">1984</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg dark:bg-slate-800/70">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-slate-100">
                        <span className="font-medium">Alice Johnson</span> returned{' '}
                        <span className="font-medium">Clean Code</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg dark:bg-slate-800/70">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Plus className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-slate-100">
                        New book added: <span className="font-medium">Atomic Habits</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'books' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Books Management</h1>
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Book
                </Button>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden dark:bg-slate-900 dark:shadow-black/20">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                      {mockBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-slate-100">{book.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-slate-100">{book.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{book.author}</td>
                          <td className="px-6 py-4">
                            <Badge variant="outline">{book.department}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={book.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                              {book.available ? 'Available' : 'Borrowed'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
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

          {activeTab === 'records' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Borrow Records</h1>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('all')}
                    className="rounded-lg"
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === 'pending' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('pending')}
                    className="rounded-lg"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === 'overdue' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('overdue')}
                    className="rounded-lg"
                  >
                    Overdue
                  </Button>
                  <Button
                    variant={statusFilter === 'returned' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('returned')}
                    className="rounded-lg"
                  >
                    Returned
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden dark:bg-slate-900 dark:shadow-black/20">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Issued</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-slate-100">{record.studentName}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-slate-100">{record.bookName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{record.issueDate}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{record.returnDate}</td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            {record.status !== 'returned' && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-lg">
                                Mark as Returned
                              </Button>
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

          {activeTab === 'students' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Student Directory</h1>

              <div className="bg-white rounded-xl shadow-md overflow-hidden dark:bg-slate-900 dark:shadow-black/20">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Books Borrowed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                      {mockStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-slate-100">{student.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-slate-100">{student.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{student.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{student.booksBorrowed}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="rounded-lg">
                                View Details
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
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
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

