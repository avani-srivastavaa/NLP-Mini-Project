import { useState } from 'react';
import {
  Book,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { mockBooks, mockBorrowRecords } from '../../data/mockData';

// ─── Mock Data Helpers ───────────────────────────────────────────────────────
const studentProfile = {
  isProfileComplete: true, // Assuming true for now; in prod, fetch from context/state
};

export default function DashboardTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  const departments = ['All Departments', ...Array.from(new Set(mockBooks.map((book) => book.department)))];

  const availableBooks = mockBooks.filter((book) =>
    book.available &&
    (selectedDepartment === 'All Departments' || book.department === selectedDepartment) &&
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const historyRecords = mockBorrowRecords.filter((r) => r.studentId === 'S001');

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Main Dashboard</h1>
        <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          Showing resources for <span className="text-amber-600 font-bold">{selectedDepartment}</span>
        </div>
      </div>

      {/* Borrowed Books Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-gray-900">Books in Possession</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyRecords.slice(0, 3).map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 leading-tight pr-2">{record.bookName}</h3>
                <Badge className={`${getStatusColor(record.status)} flex items-center gap-1 border-none px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                  {getStatusIcon(record.status)}
                  {record.status}
                </Badge>
              </div>
              <div className="space-y-3 text-sm text-gray-600 border-t border-gray-50 pt-4 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Issue Date</span>
                  <span className="font-semibold text-gray-800">{record.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Return Date</span>
                  <span className="font-semibold text-gray-800">{record.returnDate}</span>
                </div>
              </div>
              {record.status === 'pending' && (
                <Button className="w-full mt-5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-lg shadow-amber-100 transition-all">
                  Renew Access
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Available Books Section */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-gray-900">Explore Collection</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Find a specific book..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus:ring-amber-500 text-sm shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Department Filter Chips */}
        <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide no-scrollbar">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                selectedDepartment === dept
                  ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-200'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-amber-200 hover:text-amber-600 shadow-sm'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {availableBooks.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium tracking-tight">No books found for '{searchQuery}' in {selectedDepartment}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableBooks.slice(0, 12).map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                     <p className="text-white text-[10px] font-bold uppercase tracking-widest">{book.department}</p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-gray-500 mb-4 font-medium">{book.author}</p>
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-10 font-bold text-xs transition-all shadow-md shadow-amber-100"
                  >
                    Borrow Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
