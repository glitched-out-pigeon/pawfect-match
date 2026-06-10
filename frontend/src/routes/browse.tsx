import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchAnimals } from "@/lib/api";
import { AnimalCard } from "@/components/AnimalCard";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse pets — Pawfect Match" },
      { name: "description", content: "All animals available for adoption at Pawfect Match." },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["animals"],
    queryFn: fetchAnimals,
  });

  const sorted = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => Number(a.is_adopted) - Number(b.is_adopted));
  }, [data]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold">All our pets</h1>
        <p className="mt-2 text-muted-foreground">
          Pets available to adopt are listed first, followed by those who&apos;ve already found a home.
        </p>

        <div className="mt-8">
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          )}
          {isError && (
            <p className="rounded-xl bg-destructive/10 p-4 text-destructive">
              Could not load animals. Please try again.
            </p>
          )}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((a) => (
                <AnimalCard key={a.id} animal={a} />
              ))}
            </div>
          )}
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
