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
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { mockBooks, mockBorrowRecords } from '../data/mockData';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  // Filter student's borrowed books
  const studentBorrowedBooks = mockBorrowRecords.filter(
    record => record.studentId === 'S001'
  );

  const availableBooks = mockBooks.filter(book => book.available);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'returned':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
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
              <Book className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900 hidden sm:block">Smart Library</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Student ID: S001</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
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
              className="rounded-r-lg rounded-l-none bg-blue-600 hover:bg-blue-700 shadow-lg"
              title="Open sidebar"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30
            w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Close Button - visible on desktop */}
          <div className="hidden lg:flex justify-end p-2 border-b border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-gray-100"
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          <nav className="p-4 space-y-2 mt-16 lg:mt-0">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'dashboard' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Book className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'profile' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Profile Details</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'history' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <History className="w-5 h-5" />
              <span className="font-medium">Book History</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('chatbot');
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'chatbot' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Chatbot</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('about');
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === 'about' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Info className="w-5 h-5" />
              <span className="font-medium">About Library</span>
            </button>

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

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>

              {/* Borrowed Books Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Borrowed Books</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentBorrowedBooks.map((record) => (
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
                        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg">
                          Renew Book
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Suggested Books Section */}
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
                        <Badge variant="outline" className="mb-3 text-xs">
                          {book.category}
                        </Badge>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg">
                          Borrow
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Details</h1>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
                    <p className="text-gray-600">Student ID: S001</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">john.doe@university.edu</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <p className="text-gray-900">Computer Science</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Books Currently Borrowed</label>
                    <p className="text-gray-900">{studentBorrowedBooks.filter(r => r.status !== 'returned').length}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total Books Borrowed</label>
                    <p className="text-gray-900">{studentBorrowedBooks.length}</p>
                  </div>
                </div>
                <Button className="mt-6 bg-blue-600 hover:bg-blue-700 rounded-lg">
                  Edit Profile
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Book History</h1>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {studentBorrowedBooks.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.bookName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{record.issueDate}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{record.returnDate}</td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chatbot' && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Library Assistant Chatbot</h1>
              <div className="bg-white rounded-xl shadow-md h-[600px] flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Library Assistant</h3>
                      <p className="text-xs text-gray-600">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-800">
                        Hello! I'm your library assistant. How can I help you today?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-blue-600 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-white">
                        Can you recommend some fiction books?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-800">
                        Sure! Based on our collection, I recommend "The Great Gatsby", "1984", and "The Alchemist". Would you like to know their availability?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      className="rounded-lg"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    <li>Monday - Friday: 8:00 AM - 8:00 PM</li>
                    <li>Saturday: 9:00 AM - 6:00 PM</li>
                    <li>Sunday: 10:00 AM - 4:00 PM</li>
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
                    <li>Book Borrowing & Returns</li>
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