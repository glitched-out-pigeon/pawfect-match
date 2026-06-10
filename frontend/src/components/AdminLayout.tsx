import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Home, Heart, Folder, LogOut, Dog } from "lucide-react";
import { isAdminAuthed, setAdminAuthed } from "@/lib/admin-auth";
import { ADMIN_THEMES, type AdminSection } from "@/lib/admin-themes";
import runGif from "@/assets/fast-run.gif";

export function AdminLayout({
  children,
  section = "dashboard",
}: {
  children: React.ReactNode;
  section?: AdminSection;
}) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const theme = ADMIN_THEMES[section];

  useEffect(() => {
    if (!isAdminAuthed()) {
      navigate({ to: "/admin/login" });
    } else {
      setReady(true);
      requestAnimationFrame(() => setEntered(true));
    }
  }, [navigate]);

  // Wait until window 'load' (all images/pngs loaded) before hiding overlay.
  useEffect(() => {
    if (!ready) return;
    if (typeof document === "undefined") return;
    const check = () => {
      const imgs = Array.from(document.images);
      if (imgs.length === 0 || imgs.every((i) => i.complete)) {
        setAssetsLoaded(true);
        return true;
      }
      return false;
    };
    if (document.readyState === "complete" && check()) return;
    const onLoad = () => {
      // poll briefly in case new imgs mounted after window load
      let tries = 0;
      const id = window.setInterval(() => {
        tries++;
        if (check() || tries > 20) window.clearInterval(id);
      }, 100);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, [ready, path]);

  if (!ready) return null;

  const items = [
    { icon: Home, to: "/admin", label: "Dashboard", match: (p: string) => p === "/admin" || p.startsWith("/admin/table/animals") || p.startsWith("/admin/table/employees") },
    { icon: Heart, to: "/admin/medical", label: "Medical Records", match: (p: string) => p.startsWith("/admin/medical") || p.startsWith("/admin/table/vet-records") || p.startsWith("/admin/table/intake-records") },
    { icon: Folder, to: "/admin/adoption", label: "Adoption Management", match: (p: string) => p.startsWith("/admin/adoption") || p.startsWith("/admin/table/adopters") || p.startsWith("/admin/table/applications") },
  ];

  function handleSignOut() {
    setLeaving(true);
    setTimeout(() => {
      setAdminAuthed(false);
      navigate({ to: "/" });
    }, 600);
  }

  function handleExitToPublic() {
    setLeaving(true);
    setTimeout(() => navigate({ to: "/" }), 600);
  }

  // Sidebar color tints by section
  const sidebarBg = section === "dashboard" ? "bg-slate-900/80 border-slate-800" : section === "medical" ? "bg-sky-900/85 border-sky-800" : "bg-amber-900/85 border-amber-800";
  const sidebarAccent = section === "dashboard" ? "bg-violet-500/20 text-violet-300" : section === "medical" ? "bg-sky-400/30 text-sky-100" : "bg-amber-400/30 text-amber-100";

  return (
    <div className={`admin-mode flex min-h-screen ${theme.pageText}`} style={{ backgroundColor: theme.loadingBg }}>
      <aside className={`fixed inset-y-0 left-0 z-20 flex w-16 flex-col items-center gap-2 border-r py-6 ${sidebarBg}`}>
        <div className={`mb-4 grid h-9 w-9 place-items-center rounded-full ${sidebarAccent}`}>🐾</div>
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.match(path);
          return (
            <Link
              key={it.to}
              to={it.to}
              title={it.label}
              className={`group relative grid h-10 w-10 place-items-center rounded-lg transition ${active ? sidebarAccent : "text-slate-300 hover:bg-white/10"}`}
            >
              <Icon className="h-5 w-5" />
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-100 opacity-0 shadow-lg transition group-hover:opacity-100">
                {it.label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          title="Sign out"
          className="mt-auto grid h-10 w-10 place-items-center rounded-lg text-slate-300 hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </aside>

      {/* Exit to public site (dog + home icon) — only on section landing pages */}
      {!path.startsWith("/admin/table/") && (
        <button
          onClick={handleExitToPublic}
          title="Back to public site"
          aria-label="Back to public site"
          className="fixed right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-slate-100 backdrop-blur transition hover:bg-white/20"
        >
          <Dog className="h-5 w-5" />
          <Home className="absolute -bottom-0.5 -right-0.5 h-3 w-3" />
        </button>
      )}

      <main
        className={`ml-16 flex-1 transition-all duration-500 ease-out ${entered && !leaving ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
      >
        {children}
      </main>

      {/* Themed loading overlay until all images load */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-center transition-opacity duration-500 ${assetsLoaded ? "opacity-0" : "opacity-100"}`}
        style={{ backgroundColor: theme.loadingBg }}
      >
        <img src={runGif} alt="" width={160} height={160} className="select-none" />
        <p className={`mt-6 text-lg font-semibold ${theme.headingText}`}>Loading dashboard…</p>
      </div>

      {/* Sign-out / exit fade overlay */}
      <div
        className={`pointer-events-none fixed inset-0 z-[70] transition-opacity duration-500 ${leaving ? "opacity-100" : "opacity-0"}`}
        style={{ backgroundColor: theme.loadingBg }}
      />
    </div>
  );
}
