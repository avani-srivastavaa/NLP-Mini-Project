import { Link, useNavigate } from 'react-router';
import { CSSProperties } from 'react';
import {
  ArrowRight,
  Book,
  BookMarked,
  BookOpen,
  Bot,
  Brain,
  Clock,
  FileText,
  Lightbulb,
  MessageCircle,
  Search,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../components/theme/ThemeToggle';

const features = [
  { icon: Search, iconBg: 'bg-sky-100 dark:bg-sky-500/15', iconColor: 'text-sky-600 dark:text-sky-300', title: 'Precision Search', description: 'Find books by subject, author, department, and availability in a single flow.' },
  { icon: Clock, iconBg: 'bg-emerald-100 dark:bg-emerald-500/15', iconColor: 'text-emerald-600 dark:text-emerald-300', title: 'Borrow Tracking', description: 'See due dates, reminders, and borrowing history without jumping between screens.' },
  { icon: MessageCircle, iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-500/15', iconColor: 'text-fuchsia-600 dark:text-fuchsia-300', title: 'AI Help Desk', description: 'Ask questions naturally and get quick help for books, summaries, and recommendations.' },
  { icon: Shield, iconBg: 'bg-amber-100 dark:bg-amber-500/15', iconColor: 'text-amber-600 dark:text-amber-300', title: 'Admin Control', description: 'Manage records, users, and stock from a cleaner and more reliable control center.' },
  { icon: Star, iconBg: 'bg-rose-100 dark:bg-rose-500/15', iconColor: 'text-rose-600 dark:text-rose-300', title: 'Ratings & Reviews', description: 'Turn every borrowed book into shared student insight for the next reader.' },
  { icon: BookMarked, iconBg: 'bg-orange-100 dark:bg-orange-500/15', iconColor: 'text-orange-600 dark:text-orange-300', title: 'Fine Management', description: 'Keep overdue tracking and penalties transparent for students and administrators.' },
  { icon: Brain, iconBg: 'bg-violet-100 dark:bg-violet-500/15', iconColor: 'text-violet-600 dark:text-violet-300', title: 'AI Book Summaries', description: 'Get quick takeaways, themes, and reading cues before borrowing a title.' },
  { icon: FileText, iconBg: 'bg-cyan-100 dark:bg-cyan-500/15', iconColor: 'text-cyan-600 dark:text-cyan-300', title: 'Smart Recommendations', description: 'Surface books that fit the reader instead of forcing them to browse everything.' },
  { icon: Lightbulb, iconBg: 'bg-yellow-100 dark:bg-yellow-500/15', iconColor: 'text-yellow-600 dark:text-yellow-300', title: 'Instant Answers', description: 'Explain terms, book themes, and related material in a student-friendly way.' },
  { icon: Zap, iconBg: 'bg-indigo-100 dark:bg-indigo-500/15', iconColor: 'text-indigo-600 dark:text-indigo-300', title: 'Quick Analysis', description: 'Explore key ideas and structure in seconds when time is short.' },
  { icon: Sparkles, iconBg: 'bg-pink-100 dark:bg-pink-500/15', iconColor: 'text-pink-600 dark:text-pink-300', title: 'Literature Insights', description: 'Go deeper into devices, meaning, and interpretation for serious study.' },
  { icon: Bot, iconBg: 'bg-teal-100 dark:bg-teal-500/15', iconColor: 'text-teal-600 dark:text-teal-300', title: '24/7 Guidance', description: 'A digital library guide that stays available beyond the physical help desk.' },
];

const stats = [
  { value: '10k+', label: 'Curated Books' },
  { value: '26k+', label: 'Library Records' },
  { value: '24/7', label: 'AI Assistance' },
];

function AIChatbotFeatures() {
  const loopingFeatures = [...features, ...features];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-sm dark:border-sky-500/20 dark:bg-slate-900/70 dark:text-sky-200">
          <Sparkles className="size-3.5" />
          Intelligent Features
        </p>
        <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
          A Library Interface That Feels Alive
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          Search faster, borrow with confidence, and explore books with AI-powered support built into the journey.
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent dark:from-slate-950 dark:via-slate-950/90" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent dark:from-slate-950 dark:via-slate-950/90" />
        <motion.div
          className="flex gap-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' } as CSSProperties}
        >
          {loopingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={`${feature.title}-${index}`}
                className="min-w-[20rem] rounded-[1.75rem] border border-white/80 bg-white/80 p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/30 sm:min-w-[24rem]"
              >
                <div className={`mb-5 flex size-12 items-center justify-center rounded-2xl ${feature.iconBg}`}>
                  <Icon className={`size-6 ${feature.iconColor}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const handleAssistantClick = () => {
    const isStudentLoggedIn = window.localStorage.getItem('smart-library-student-auth') === 'true';
    navigate(isStudentLoggedIn ? '/student/chatbot' : '/student/login');
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_24%),linear-gradient(180deg,_#f7fbff_0%,_#eef5ff_48%,_#f8fbff_100%)] text-slate-900 transition-colors dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.10),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#0f172a_52%,_#020617_100%)] dark:text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[linear-gradient(120deg,rgba(14,165,233,0.08),rgba(59,130,246,0),rgba(244,114,182,0.08))]" />

      <nav className="sticky top-0 z-30 border-b border-white/60 bg-white/65 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/65">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg shadow-blue-500/30">
              <Book className="size-6" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">Smart Library</p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Knowledge Interface</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/student/login">
              <Button variant="outline" className="rounded-full border-slate-300 bg-white/80 px-5 dark:border-slate-700 dark:bg-slate-900/70">
                User Login
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button className="rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-sm dark:border-sky-500/20 dark:bg-slate-900/80 dark:text-sky-200">
              <Sparkles className="size-3.5" />
              Reimagined Library Experience
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Discover books inside a richer, smarter digital library.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              From book discovery to borrowing, recommendations, and AI support, every step is designed to feel cleaner,
              faster, and more inspiring for students and librarians.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/student/login">
                <Button size="lg" className="h-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-700 px-8 text-base text-white shadow-lg shadow-blue-500/25 hover:from-sky-600 hover:to-blue-800">
                  Explore Library
                  <ArrowRight className="ml-1 size-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={handleAssistantClick}
                className="h-12 rounded-full border-slate-300 bg-white/80 px-8 text-base dark:border-slate-700 dark:bg-slate-900/70"
              >
                Talk to AI Assistant
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.5rem] border border-white/70 bg-white/70 p-5 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <p className="text-3xl font-bold text-slate-950 dark:text-slate-100">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 hidden h-32 w-32 rounded-full bg-sky-400/20 blur-3xl lg:block" />
            <div className="absolute -bottom-12 right-2 hidden h-40 w-40 rounded-full bg-pink-400/20 blur-3xl lg:block" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 p-4 shadow-[0_40px_90px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75">
              <div
                className="h-[26rem] rounded-[1.5rem] bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1533285860212-c85e7140a408?q=80&w=1153&auto=format&fit=crop')",
                }}
              />

              <div className="absolute inset-x-8 bottom-8 rounded-[1.5rem] border border-white/35 bg-slate-950/68 p-5 text-white shadow-2xl backdrop-blur-md">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="size-5 text-sky-300" />
                    <span className="text-sm font-semibold tracking-wide">Library AI</span>
                  </div>
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                    Online
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-200">
                  &quot;Try searching for Data Structures, compare availability, and ask for a quick summary before you borrow.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">About The Library</p>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-slate-100">Built for focused reading, borrowing, and academic flow.</h2>
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
              This system gives students and faculty a calmer, more modern way to access the library. It connects search,
              borrowing, AI guidance, and administration into a single interface that is easier to trust and easier to use.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-[1.75rem] border border-sky-100 bg-gradient-to-br from-sky-500 to-blue-700 p-6 text-white shadow-xl shadow-blue-500/20 dark:border-sky-500/10">
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-white/15">
                <BookOpen className="size-7" />
              </div>
              <h3 className="text-xl font-semibold">Deep Collection</h3>
              <p className="mt-3 text-sm leading-7 text-sky-50/90">
                Access academic and general reading material through a more visual browsing experience.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75">
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Search className="size-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Faster Discovery</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Filter and find titles quickly instead of browsing static, tiring lists.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75">
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                <Users className="size-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Connected Users</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Support students, staff, and administrators with one shared, readable system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50/65 py-20 dark:bg-slate-950/35">
        <AIChatbotFeatures />
      </section>

      <footer className="border-t border-white/60 bg-white/70 py-12 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white">
                <Book className="size-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-950 dark:text-slate-100">Smart Library</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Modern access to knowledge</p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              A creative digital library space designed to make borrowing, reading, discovery, and administration feel smoother and more inviting.
            </p>
            <Link to="/developers" className="mt-6 inline-block">
              <Button
                variant="outline"
                className="rounded-full border-slate-300 bg-white/80 px-6 dark:border-slate-700 dark:bg-slate-900/70"
              >
                Meet Our Developers
              </Button>
            </Link>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.22)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75">
            <h3 className="mb-4 text-lg font-semibold text-slate-950 dark:text-slate-100">Contact Info</h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>Email: pcelibrary@mes.ac.in</li>
              <li>Phone: 022-65748000</li>
              <li>Semesters: Mon-Fri, 8AM - 6PM</li>
              <li>Exams: Mon-Fri, 8AM - 8PM</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-slate-200/80 px-4 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-6 lg:px-8">
          &copy; 2026 Smart Library System. All rights reserved.
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-slate-200/80 px-4 pt-8 text-center text-slate-600 dark:border-slate-800 dark:text-slate-400 sm:px-6 lg:px-8">
          <p className="mt-2 text-sm">
            Developed as a learning project at{' '}
            <a
              href="https://pce.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold dark:text-blue-400 dark:hover:text-blue-300"
            >
              Pillai College of Engineering
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
