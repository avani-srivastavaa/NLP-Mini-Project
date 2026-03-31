import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Book, Search, Users, MessageCircle, ArrowRight, BookOpen,
  Clock, Shield, Star, BookMarked,
  Brain, FileText, Lightbulb, Zap, Sparkles, Bot
} from 'lucide-react';
import { motion } from 'motion/react';
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
  {
    icon: Brain,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'AI Book Summaries',
    description: 'Get intelligent summaries of books with key insights and main themes.',
  },
  {
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Smart Recommendations',
    description: 'Personalized book recommendations based on your reading preferences.',
  },
  {
    icon: Lightbulb,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: 'Instant Answers',
    description: 'Ask questions about books and get immediate, accurate responses.',
  },
  {
    icon: Zap,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'Quick Analysis',
    description: 'Analyze book themes, characters, and plot points in seconds.',
  },
  {
    icon: Sparkles,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    title: 'Literature Insights',
    description: 'Deep dive into literary devices, symbolism, and writing styles.',
  },
  {
    icon: Bot,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: '24/7 Assistance',
    description: 'Always available AI assistant for your reading and research needs.',
  },
];

function AIChatbotFeatures() {
  // Duplicate features for seamless scrolling
  const loopingFeatures = [...features, ...features];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
        <p className="text-lg text-gray-600">
          Discover the power of our intelligent AI assistant for enhanced reading experience
        </p>
      </div>

      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' }}
        >
          {loopingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={`${feature.title}-${index}`}
                className="min-w-[28rem] bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-50"
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
                  User Login
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1533285860212-c85e7140a408?q=80&w=1153&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-blue-900/40 to-slate-950/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Welcome to Smart Library System
            </h1>
            <p className="text-xl sm:text-2xl text-slate-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
              Search, Borrow, and Manage Books Efficiently
            </p>
            <div className="flex justify-center">
              <Link to="/student/login">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 rounded-lg text-xl px-12 py-4">
                  Explore Library
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
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

      {/* Key Features Section — Continuous Sliding */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50">
        <AIChatbotFeatures />
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
                Your gateway to knowledge and learning. Empowering students and educators since 2026.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Contact Info</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Email: pcelibrary@mes.ac.in</li>
                <li>Phone: 022-65748000</li>
                <li>Hours (During Semesters): Mon-Fri, 8AM - 6PM</li>
                <li>Hours (During Exams): Mon-Fri, 8AM - 8PM</li>
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
