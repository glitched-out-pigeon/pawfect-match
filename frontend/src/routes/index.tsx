import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchAnimals } from "@/lib/api";
import { AnimalCard } from "@/components/AnimalCard";
import { SiteHeader } from "@/components/SiteHeader";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pawfect Match — Adopt your new best friend" },
      { name: "description", content: "Browse loving dogs, cats, rabbits and more waiting for a forever home." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["animals"],
    queryFn: fetchAnimals,
  });
  const [filter, setFilter] = useState<string>("All");

  const species = useMemo(() => {
    const set = new Set<string>();
    data?.forEach((a) => set.add(a.species));
    return ["All", ...Array.from(set).sort()];
  }, [data]);

  const filtered = useMemo(
    () => (filter === "All" ? data ?? [] : (data ?? []).filter((a) => a.species === filter)),
    [data, filter],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
              Find a friend for life
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              Meet your <span className="text-primary">pawfect</span> match.
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Hundreds of loving animals are searching for their forever home. Browse, fall in love, and adopt today.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/browse"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
              >
                Browse pets
              </Link>
              <Link
                to="/learn-more"
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
              >
                Learn more
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-warm/40 blur-3xl" />
            <img
              src={heroImg}
              alt="Happy dog and cat illustration"
              width={1536}
              height={1024}
              className="rounded-[2rem] shadow-xl ring-1 ring-border"
            />
          </div>
        </div>
      </section>

      {/* Animals */}
      <section id="animals" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Pets looking for a home</h2>
            <p className="mt-1 text-muted-foreground">Filter by species to find your match.</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-6 flex flex-wrap gap-2">
          {species.map((s) => {
            const active = s === filter;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={
                  "rounded-full px-4 py-2 text-sm font-medium transition " +
                  (active
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-card text-foreground ring-1 ring-border hover:bg-secondary")
                }
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="mt-8">
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          )}
          {isError && (
            <p className="rounded-xl bg-destructive/10 p-4 text-destructive">Could not load animals. Please try again.</p>
          )}
          {!isLoading && !isError && filtered.length === 0 && (
            <p className="rounded-xl bg-secondary p-6 text-center text-muted-foreground">
              No pets in this category right now.
            </p>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <AnimalCard key={a.id} animal={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 text-center">
        <Link
          to="/rehome"
          className="inline-block rounded-full border-2 border-warm bg-warm/20 px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-warm/40"
        >
          Looking for a new home? 🐾
        </Link>
      </section>

      <footer className="border-t border-border bg-card/50 py-8 text-center text-sm text-muted-foreground">
        Made with 🐾 by Pawfect Match
      </footer>
    </div>
  );
}
//hello there