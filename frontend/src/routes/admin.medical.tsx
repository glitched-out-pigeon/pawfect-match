import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { Heart, Syringe, BookOpen } from "lucide-react";

export const Route = createFileRoute("/admin/medical")({
  component: MedicalPage,
});

function FloatingBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-x-0 top-1/2 w-[200%] -translate-y-1/2 text-sky-300/60" viewBox="0 0 800 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points="0,50 80,50 100,20 120,80 140,50 200,50 220,30 240,70 260,50 400,50 420,15 440,85 460,50 600,50 620,25 640,75 660,50 800,50"
          className="animate-[ekg_4s_linear_infinite]"
        />
      </svg>
      {Array.from({ length: 10 }).map((_, i) => (
        <Heart
          key={i}
          className="absolute text-sky-300/40 animate-[floatY_6s_ease-in-out_infinite]"
          style={{
            left: `${(i * 11) % 100}%`,
            top: `${(i * 23) % 100}%`,
            width: `${16 + (i % 3) * 8}px`,
            height: `${16 + (i % 3) * 8}px`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes ekg { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes floatY { 0%,100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-20px); opacity: 0.8; } }
      `}</style>
    </div>
  );
}

function Tile({ to, title, subtitle, Icon }: any) {
  return (
    <Link
      to={to}
      className="group relative block w-72 rounded-3xl border border-sky-300 bg-white/80 p-10 text-center shadow-xl backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_0_40px_-5px_rgba(56,189,248,0.6)]"
    >
      {[..."1234"].map((_, i) => (
        <Icon
          key={i}
          className="absolute h-8 w-8 text-sky-400/80"
          style={{
            top: i < 2 ? "-12px" : "auto",
            bottom: i >= 2 ? "-12px" : "auto",
            left: i % 2 === 0 ? "-12px" : "auto",
            right: i % 2 === 1 ? "-12px" : "auto",
            transform: `rotate(${i * 30}deg)`,
          }}
        />
      ))}
      <h2 className="text-2xl font-bold text-sky-900">{title}</h2>
      <p className="mt-2 text-sm text-sky-700">{subtitle}</p>
    </Link>
  );
}

function MedicalPage() {
  return (
    <AdminLayout section="medical">
      <div className="relative min-h-screen px-8 py-12 text-sky-950">
        <FloatingBg />
        <div className="relative">
          <h1 className="mb-12 flex items-center gap-3 text-3xl font-bold tracking-tight text-sky-900">
            <Heart className="h-7 w-7 fill-sky-400 text-sky-400" /> Medical Records
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-16">
            <Tile to="/admin/table/vet-records" title="Vet Records" subtitle="Animal health history" Icon={Syringe} />
            <Tile to="/admin/table/intake-records" title="Intake Records" subtitle="Animal arrival history" Icon={BookOpen} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
