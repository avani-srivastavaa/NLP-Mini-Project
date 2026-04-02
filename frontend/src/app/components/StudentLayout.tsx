import { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router';
import {
  Book,
  User,
  History,
  MessageCircle,
  Info,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui/button';

// ─── Student profile data (Mock) ─────────────────────────────────────────────
const studentProfile = {
  name: 'Dhiru bhai Ambani',
  admissionNo: 'ADM-2024-0012',
  department: 'Computer Science',
};

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { to: '/student/dashboard', label: 'Dashboard',       icon: Book },
    { to: '/student/profile',   label: 'Profile Details', icon: User },
    { to: '/student/history',   label: 'Book History',    icon: History },
    { to: '/student/about',     label: 'About Library',   icon: Info },
    { to: '/student/chatbot',   label: 'Chatbot',         icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-outfit">
      {/* ── Top Bar ───────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
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
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center transform rotate-3 shadow-md">
                <Book className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 hidden sm:block tracking-tight text-lg">Smart Library</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1.5 border border-gray-200">
            <div className="hidden sm:block text-right pr-2 border-r border-gray-300">
              <p className="text-xs font-bold text-gray-900 leading-tight">{studentProfile.name}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{studentProfile.admissionNo}</p>
            </div>
            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center shadow-inner">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* ── Sidebar ───────────────────────────────── */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30 flex flex-col
            ${sidebarCollapsed ? 'w-20' : 'w-64'}
            bg-white shadow-xl lg:shadow-none border-r border-gray-100 transform transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Collapse/Expand Toggle (Desktop Only) */}
          <div className="hidden lg:flex justify-end p-2 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hover:bg-gray-100 rounded-full"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </Button>
          </div>

          <nav className="p-4 space-y-2 mt-2 flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${sidebarCollapsed ? 'justify-center' : 'gap-3'}
                  ${isActive
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-200 translate-x-1'
                    : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700 hover:translate-x-1'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110`} />
                {!sidebarCollapsed && (
                  <span className="font-semibold whitespace-nowrap text-sm">{label}</span>
                )}
              </NavLink>
            ))}
            
            <div className="pt-6 mt-6 border-t border-gray-100">
              <Link to="/">
                <button className={`w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 hover:translate-x-1 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="font-bold whitespace-nowrap text-sm">Logout</span>
                  )}
                </button>
              </Link>
            </div>
          </nav>
        </aside>

        {/* ── Main Content Container ──────────────────────────── */}
        <main className="flex-1 min-w-0 transition-all duration-300 w-full bg-gray-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>

        {/* Floating Chatbot Overlay Button for other pages if you stay out of chatbot route */}
        {/* But the user wants chatbot as a page component, so we'll just nav to /chatbot */}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
