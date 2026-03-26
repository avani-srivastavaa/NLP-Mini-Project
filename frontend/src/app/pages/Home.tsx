import { Link } from 'react-router';
import { Book, Search, Users, MessageCircle, ArrowRight, BookOpen, Clock, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Book className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-800">Smart Library</span>
            </div>
            <div className="flex gap-3">
              <Link to="/student/login">
                <Button variant="outline" className="rounded-lg">
                  Student Login
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                  Teacher/Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Smart Library System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Search, Borrow, and Manage Books Efficiently
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/student/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-lg text-lg px-8">
                Explore Library
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/student/login">
              <Button size="lg" variant="outline" className="rounded-lg text-lg px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Library Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Our Library</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A modern digital library management system designed to provide seamless access to knowledge 
              and efficient book management for students, faculty, and administrators.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 shadow-sm">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">10,000+ Books</h3>
              <p className="text-gray-600">
                Extensive collection across multiple genres and subjects
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-blue-50 shadow-sm">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Access</h3>
              <p className="text-gray-600">
                Easy search and browse functionality for quick book discovery
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-blue-50 shadow-sm">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5,000+ Users</h3>
              <p className="text-gray-600">
                Serving students, faculty, and researchers community-wide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-lg text-gray-600">
              Everything you need for efficient library management
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Book Search</h3>
              <p className="text-gray-600 text-sm">
                Advanced search with filters by title, author, category, and availability
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Borrow & Return Tracking</h3>
              <p className="text-gray-600 text-sm">
                Real-time tracking of borrowed books with due date reminders
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Chatbot Assistance</h3>
              <p className="text-gray-600 text-sm">
                Get instant help and book recommendations from our AI assistant
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Admin Management System</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive dashboard for managing books, users, and records
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-800 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Book className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">Smart Library</span>
              </div>
              <p className="text-gray-600">
                Your gateway to knowledge and learning. Empowering students and educators since 2020.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Contact Info</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Email: library@university.edu</li>
                <li>Phone: (555) 123-4567</li>
                <li>Hours: Mon-Fri, 8AM - 8PM</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Quick Links</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2026 Smart Library System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}