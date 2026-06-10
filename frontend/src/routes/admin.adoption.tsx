import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { Folder } from "lucide-react";
import babies from "@/assets/babies.webp";

export const Route = createFileRoute("/admin/adoption")({
  component: AdoptionPage,
});

function Tile({ to, title, subtitle }: { to: string; title: string; subtitle: string }) {
  return (
    <Link
      to={to}
      className="group relative block w-72 rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 p-10 text-center shadow-xl transition hover:-translate-y-1 hover:shadow-[0_0_40px_-5px_rgba(196,168,130,0.7)]"
    >
      <h2 className="text-2xl font-bold text-amber-900">{title}</h2>
      <p className="mt-2 text-sm text-amber-700">{subtitle}</p>
    </Link>
  );
}

function AdoptionPage() {
  return (
    <AdminLayout section="adoption">
      <div className="relative min-h-screen overflow-hidden px-8 py-12 text-amber-950">
        <img
          src={babies}
          alt=""
          loading="lazy"
          className="pointer-events-none fixed bottom-0 left-16 h-80 w-80 object-contain opacity-80"
          style={{ maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 40%, transparent 75%)" }}
        />
        <div className="relative">
          <h1 className="mb-12 flex items-center gap-3 text-3xl font-bold tracking-tight text-amber-900">
            <Folder className="h-7 w-7" /> Adoption Management
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-16">
            <Tile to="/admin/table/adopters" title="Adopters" subtitle="People who adopted animals" />
            <Tile to="/admin/table/applications" title="Applications" subtitle="Pending and reviewed applications" />
            <Tile to="/admin/table/rehoming-applications" title="Rehoming Applications" subtitle="Animals submitted for rehoming" />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
