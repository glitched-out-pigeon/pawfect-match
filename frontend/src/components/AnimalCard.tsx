import { Link } from "@tanstack/react-router";
import type { Animal } from "@/lib/api";

export function AnimalCard({ animal }: { animal: Animal }) {
  return (
    <Link
      to="/animals/$id"
      params={{ id: animal.id }}
      className="group relative block overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={animal.image_url}
          alt={animal.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {animal.is_adopted && (
          <span className="absolute left-3 top-3 rounded-full bg-success px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success-foreground shadow">
            Adopted
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow">
          {animal.species}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground">{animal.name}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {animal.breed} · {animal.age} {animal.age === 1 ? "year" : "years"}
        </p>
      </div>
    </Link>
  );
}
