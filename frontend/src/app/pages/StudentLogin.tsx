import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Book, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

import { ThemeToggle } from '../components/theme/ThemeToggle';
import { manualLogin, loginWithGoogle, createGoogleCredentials } from '../data/api';
import { signInWithGoogle } from '../data/firebase';
import { AlertCircle } from 'lucide-react';

const highlights = [
  'Discover books with a calmer search experience',
  'Track due dates and borrow history in one place',
  'Use the AI assistant for quick reading guidance',
];

export default function StudentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [pendingGoogleUser, setPendingGoogleUser] = useState<any>(null);
  const [newAdm, setNewAdm] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newConfirm, setNewConfirm] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userData = await manualLogin(email, password);
      
      window.localStorage.setItem('smart-library-student-auth', 'true');
      window.localStorage.setItem('smart-library-user', JSON.stringify(userData));
      window.localStorage.removeItem('smart-library-admin-auth');
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const gUser = await signInWithGoogle();
      const idToken = await gUser.getIdToken();
      
      const res = await loginWithGoogle(idToken);
      
      if (res.new_user) {
        setPendingGoogleUser({ email: res.email, name: res.name });
        return; // Don't navigate yet, show credential creation form
      } else {
        window.localStorage.setItem('smart-library-user', JSON.stringify(res));
      }
      
      window.localStorage.setItem('smart-library-student-auth', 'true');
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || "Google Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPass !== newConfirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await createGoogleCredentials({
        email: pendingGoogleUser.email,
        name: pendingGoogleUser.name,
        admission_number: newAdm,
        password: newPass
      });
      window.localStorage.setItem('smart-library-user', JSON.stringify(res));
      window.localStorage.setItem('smart-library-student-auth', 'true');
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to finalize account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.20),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef5ff_50%,_#f6faff_100%)] px-4 py-8 transition-colors dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_55%,_#020617_100%)] sm:px-6 lg:px-8">
      <div className="absolute left-[-4rem] top-20 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-3 text-slate-700 dark:text-slate-200">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg shadow-blue-500/25">
            <Book className="size-5" />
          </div>
          <div>
            <p className="text-base font-semibold">Smart Library</p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Student Portal</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/admin/login">
            <Button variant="outline" className="rounded-full border-slate-300 bg-white/80 px-5 dark:border-slate-700 dark:bg-slate-900/70">
              Admin Login
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-sky-600 via-blue-700 to-slate-900 p-8 text-white shadow-[0_35px_90px_-35px_rgba(30,64,175,0.65)] sm:p-10">
          <div className="absolute -right-10 top-6 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-sky-300/10 blur-3xl" />

          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
              <Sparkles className="size-3.5" />
              Welcome Back
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              Step back into your reading space.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-sky-50/85">
              Borrow smarter, explore faster, and keep your academic reading flow organized with a cleaner student dashboard.
            </p>

            <div className="mt-10 space-y-4">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-xl bg-white/15">
                    <ShieldCheck className="size-4 text-sky-100" />
                  </div>
                  <p className="text-sm leading-6 text-sky-50/90">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/78 p-8 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/78 dark:shadow-black/30 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[1.4rem] bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
              <UserRound className="size-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">User Login</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Access your books, history, and library assistant.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              <AlertCircle className="size-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {!pendingGoogleUser ? (
            <>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Admission Number</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="e.g. 2023PE1250"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 dark:border-slate-700 dark:bg-slate-950"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 dark:border-slate-700 dark:bg-slate-950"
                    required
                  />
                </div>

                <div className="flex items-center justify-end text-sm">
                  <a href="#" className="font-medium text-sky-700 hover:underline dark:text-sky-300">
                    Forgot password?
                  </a>
                </div>

                <Button 
                    type="submit" 
                    disabled={loading}
                    className="h-12 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:from-sky-600 hover:to-blue-800 disabled:opacity-70"
                >
                  {loading ? 'Entering...' : 'Enter Dashboard'}
                  <ArrowRight className="size-4" />
                </Button>
              </form>

              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:bg-slate-900">or continue</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="h-12 w-full rounded-2xl border-slate-200 bg-white/70 dark:border-slate-700 dark:bg-slate-950" 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Login with Google'}
              </Button>
            </>
          ) : (
            <form onSubmit={handleCreateCredentials} className="space-y-5">
              <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800/30 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Welcome <strong>{pendingGoogleUser.name}</strong>! Since this is your first time using Google Login, please link your Admission Number and create a backup password.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newAdm">Admission Number</Label>
                <Input
                  id="newAdm"
                  type="text"
                  placeholder="e.g. 2023PE1250"
                  value={newAdm}
                  onChange={(e) => setNewAdm(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 dark:border-slate-700 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPass">Create Password</Label>
                <Input
                  id="newPass"
                  type="password"
                  placeholder="Enter a secure password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 dark:border-slate-700 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newConfirm">Confirm Password</Label>
                <Input
                  id="newConfirm"
                  type="password"
                  placeholder="Re-enter password"
                  value={newConfirm}
                  onChange={(e) => setNewConfirm(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 dark:border-slate-700 dark:bg-slate-950"
                  required
                />
              </div>

              <Button 
                  type="submit" 
                  disabled={loading}
                  className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-green-700 disabled:opacity-70 mt-4"
              >
                {loading ? 'Creating Account...' : 'Continue to Dashboard'}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
