import { useState, useRef } from 'react';
import { Link } from 'react-router';
import {
  Book, Search, Users, MessageCircle, ArrowRight, BookOpen,
  Clock, Shield, ChevronLeft, ChevronRight, Star, BookMarked
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';

const features = [
  {
    icon: Search,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Book Search',
    description: 'Advanced search with filters by title, author, category, and availability.',
  },
  {
    icon: Clock,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Borrow & Return Tracking',
    description: 'Real-time tracking of borrowed books with due date reminders.',
  },
  {
    icon: MessageCircle,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'AI Chatbot Assistance',
    description: 'Get instant help and book recommendations from our AI assistant.',
  },
  {
    icon: Shield,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'Admin Management',
    description: 'Comprehensive dashboard for managing books, users, and records.',
  },
  {
    icon: Star,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: 'Ratings & Reviews',
    description: 'Students can rate and review books to guide others in their reading journey.',
  },
  {
    icon: BookMarked,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    title: 'Fine Management',
    description: 'Automatic fine calculation and tracking for overdue book returns.',
  },
];

function FeatureCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);

  // Number of cards visible at once (3 on desktop)
  const visibleCount = 3;
  const totalSlides = Math.ceil(features.length / visibleCount); // 2 slides

  const paginate = (newDirection: number) => {
    const next = page + newDirection;
    if (next < 0 || next >= totalSlides) return;
    setPage([next, newDirection]);
  };

  const startIndex = page * visibleCount;
  const visibleFeatures = features.slice(startIndex, startIndex + visibleCount);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
        <p className="text-lg text-gray-600">
          Everything you need for efficient library management
        </p>
      </div>

      <div className="relative">
        {/* Prev Button */}
        <button
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Cards Viewport */}
        <div className="overflow-hidden rounded-xl">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid md:grid-cols-3 gap-6"
            >
              {visibleFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-50"
                  >
                    <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Button */}
        <button
          onClick={() => paginate(1)}
          disabled={page >= totalSlides - 1}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > page ? 1 : -1])}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === page ? 'bg-amber-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

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
              <h3 className="text-xl font-semibold mb-2">Active Users</h3>
              <p className="text-gray-600">
                Serving students, faculty, and researchers community-wide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section — Sliding Carousel */}
      <section className="py-16 overflow-hidden">
        <FeatureCarousel />
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-800 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
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
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2026 Smart Library System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
