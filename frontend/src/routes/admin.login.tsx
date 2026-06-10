import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { setAdminAuthed } from "@/lib/admin-auth";
import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [wiping, setWiping] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (res.status === 200) {
        setAdminAuthed(true);
        setWiping(true);
        setTimeout(() => navigate({ to: "/admin" }), 700);
        return;
      }
      if (res.status === 401) {
        setError("Invalid credentials");
      } else {
        setError(`Login failed (${res.status})`);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-mode relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-slate-100">
      <div className="grid min-h-screen place-items-center px-4">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm rounded-2xl border border-violet-500/20 bg-slate-900/70 p-8 shadow-2xl backdrop-blur"
        >
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="text-2xl">🐾</span>
            <h1 className="text-xl font-bold tracking-tight">Pawfect Match Admin</h1>
          </div>
          <label className="mb-3 block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-violet-400"
              required
            />
          </label>
          <label className="mb-4 block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 pr-10 text-sm outline-none focus:border-violet-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-violet-400 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
      <div
        className={`pointer-events-none fixed inset-0 z-50 bg-slate-950 transition-opacity duration-700 ${wiping ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
