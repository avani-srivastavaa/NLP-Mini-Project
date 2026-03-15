import { useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Eye, EyeOff, ArrowLeft, Shield, Lock, User } from "lucide-react";

export function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials. Try: admin / admin123");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}
    >
      {/* Left side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1767862672771-bdc6e9486c9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-900/80 to-slate-950/95" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/40">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white mb-3" style={{ fontSize: "2rem", fontWeight: 700 }}>
            Admin Portal
          </h2>
          <p className="text-slate-300 max-w-xs mx-auto" style={{ fontSize: "0.95rem", lineHeight: "1.7" }}>
            Manage library resources, track borrowings, and oversee student activity from one place.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {["Books", "Students", "Records"].map((item) => (
              <div key={item} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-white" style={{ fontSize: "0.75rem", fontWeight: 500 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontSize: "0.875rem" }}>Back to Portal Selection</span>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-white" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
              LibraMS
            </span>
          </div>

          <h1 className="text-white mb-1" style={{ fontSize: "1.875rem", fontWeight: 700 }}>
            Admin Sign In
          </h1>
          <p className="text-slate-400 mb-8" style={{ fontSize: "0.9rem" }}>
            Enter your credentials to access the admin dashboard
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-6" style={{ fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-300 mb-2" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-10 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
                  style={{ fontSize: "0.9rem" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-2" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-10 py-3 pr-12 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
                  style={{ fontSize: "0.9rem" }}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl py-3 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-600/30"
              style={{ fontWeight: 600, fontSize: "0.9rem" }}
            >
              {loading ? "Signing in..." : "Sign In as Admin"}
            </button>
          </form>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400" style={{ fontSize: "0.8rem" }}>
              <span className="text-slate-300" style={{ fontWeight: 500 }}>Demo credentials:</span>{" "}
              Username: <code className="text-indigo-400">admin</code> / Password:{" "}
              <code className="text-indigo-400">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
