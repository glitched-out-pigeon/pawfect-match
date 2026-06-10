import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Dog, Wrench } from "lucide-react";
import { PawStamp } from "./PawStamp";

export function SiteHeader() {
  const [stamping, setStamping] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-lg">
              🐾
            </span>
            <span className="text-lg font-bold tracking-tight">Pawfect Match</span>
          </Link>
          <button
            aria-label="Staff"
            onClick={() => setStamping(true)}
            className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground/50 transition hover:text-muted-foreground"
          >
            <Dog className="h-5 w-5" />
            <Wrench className="absolute -bottom-0.5 -right-0.5 h-3 w-3" />
          </button>
        </div>
      </header>
      {stamping && <PawStamp onDone={() => navigate({ to: "/admin/login" })} />}
    </>
  );
}
