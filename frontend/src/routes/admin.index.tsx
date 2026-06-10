import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import dogImg from "@/assets/dog.png";
import manImg from "@/assets/man.png";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function Decor({ src, count }: { src: string; count: number }) {
  const positions = [
    "-top-6 -left-6 rotate-[-15deg]",
    "-top-8 -right-4 rotate-[12deg]",
    "-bottom-6 -left-8 rotate-[8deg]",
    "-bottom-8 -right-6 rotate-[-10deg]",
    "top-1/2 -left-10 rotate-[20deg]",
    "top-1/3 -right-10 rotate-[-20deg]",
  ];
  return (
    <>
      {positions.slice(0, count).map((cls, i) => (
        <img key={i} src={src} alt="" loading="lazy" className={`pointer-events-none absolute h-16 w-16 opacity-90 drop-shadow-lg ${cls}`} />
      ))}
    </>
  );
}

function Tile({ to, title, subtitle, decor }: { to: string; title: string; subtitle: string; decor: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group relative block w-72 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-slate-800 to-indigo-900/60 p-10 text-center shadow-xl transition hover:-translate-y-1 hover:shadow-[0_0_40px_-5px_rgba(167,139,250,0.5)]"
    >
      {decor}
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-violet-200/80">{subtitle}</p>
    </Link>
  );
}

function AdminHome() {
  return (
    <AdminLayout section="dashboard">
      <div className="min-h-screen px-8 py-12">
        <h1 className="mb-12 text-3xl font-bold tracking-tight">Database Management</h1>
        <div className="flex flex-wrap items-center justify-center gap-16">
          <Tile to="/admin/table/animals" title="Animals" subtitle="Manage all animal records" decor={<Decor src={dogImg} count={6} />} />
          <Tile to="/admin/table/employees" title="Employees" subtitle="Manage shelter staff" decor={<Decor src={manImg} count={6} />} />
        </div>
      </div>
    </AdminLayout>
  );
}
