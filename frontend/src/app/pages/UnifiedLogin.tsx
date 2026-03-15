import { useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Eye, EyeOff, Lock, User } from "lucide-react";
import { authenticateUser } from "../lib/firebase";

export function UnifiedLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await authenticateUser(username.trim(), password);
      if (!user) {
        setError("Invalid username or password. Please try again.");
        setLoading(false);
        return;
      }
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl" />
      </div>

      {/* Left side – Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1680449786212-de3b835dc467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-900/80 to-slate-950/95" />
        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/40">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white mb-3" style={{ fontSize: "2rem", fontWeight: 700 }}>
            LibraMS
          </h2>
          <p
            className="text-slate-300 max-w-xs mx-auto"
            style={{ fontSize: "0.95rem", lineHeight: "1.7" }}
          >
            Your complete library management solution — borrow books, track records, and manage resources all in one place.
          </p>
          <div className="mt-8 space-y-3 max-w-xs mx-auto">
            {[
              "Browse & Borrow Books",
              "Track Return Dates",
              "Manage Student Records",
              "Chat with AI Assistant",
            ].map((item) => (
              <div key={item} className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                <p className="text-slate-300 text-left" style={{ fontSize: "0.85rem" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side – Login form */}
      <div className="relative flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo (mobile only) */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-white" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
              LibraMS
            </span>
          </div>

          <h1 className="text-white mb-1" style={{ fontSize: "1.875rem", fontWeight: 700 }}>
            Welcome back
          </h1>
          <p className="text-slate-400 mb-8" style={{ fontSize: "0.9rem" }}>
            Sign in to your account to continue
          </p>

          {error && (
            <div
              className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-6"
              style={{ fontSize: "0.875rem" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label
                className="block text-slate-300 mb-2"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-10 py-3 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all"
                  style={{ fontSize: "0.9rem" }}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-slate-300 mb-2"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-10 py-3 pr-12 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all"
                  style={{ fontSize: "0.9rem" }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-white/5 accent-blue-500"
                />
                <span className="text-slate-400" style={{ fontSize: "0.875rem" }}>
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 transition-colors"
                style={{ fontSize: "0.875rem" }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl py-3 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30"
              style={{ fontWeight: 600, fontSize: "0.9rem" }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5">
            <p className="text-slate-300" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              Demo credentials
            </p>
            <p className="text-slate-400" style={{ fontSize: "0.8rem" }}>
              Admin — <code className="text-indigo-400">admin</code> /{" "}
              <code className="text-indigo-400">admin123</code>
            </p>
            <p className="text-slate-400" style={{ fontSize: "0.8rem" }}>
              Student — <code className="text-blue-400">STU2024</code> /{" "}
              <code className="text-blue-400">student123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
