import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, Check, Phone, Mail } from "lucide-react";
import { fetchAnimal, API_BASE } from "@/lib/api";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/animals/$id")({
  component: AnimalDetail,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center">
      <p className="text-destructive">{error.message}</p>
      <Link to="/" className="mt-4 inline-block text-primary underline">Back home</Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <p>Animal not found.</p>
      <Link to="/" className="mt-4 inline-block text-primary underline">Back home</Link>
    </div>
  ),
});

const CONTACT_PHONE = "+91 20000 20000";
const CONTACT_EMAIL = "exampleemail@mail.com";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };
  return (
    <button
      onClick={onCopy}
      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
      aria-label={`Copy ${label}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function AnimalDetail() {
  const { id } = Route.useParams();
  const [open, setOpen] = useState(false);

  const { data: animal, isLoading, isError } = useQuery({
    queryKey: ["animal", id],
    queryFn: () => fetchAnimal(id),
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to all pets</Link>

        {isLoading && <div className="mt-8 h-96 animate-pulse rounded-3xl bg-muted" />}
        {isError && <p className="mt-8 text-destructive">Could not load this animal.</p>}

        {animal && (
          <div className="mt-6 grid gap-10 md:grid-cols-2">
            <div className="relative">
              <img
                src={animal.image_url}
                alt={animal.name}
                className="aspect-square w-full rounded-3xl object-cover shadow-xl ring-1 ring-border"
              />
              {animal.is_adopted && (
                <span className="absolute left-4 top-4 rounded-full bg-success px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-success-foreground shadow">
                  Adopted
                </span>
              )}
            </div>

            <div>
              <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                {animal.species}
              </span>
              <h1 className="mt-3 text-5xl font-bold">{animal.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {animal.breed} · {animal.age} {animal.age === 1 ? "year" : "years"} old
              </p>

              <div className="mt-6 rounded-2xl bg-card p-5 ring-1 ring-border">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">About {animal.name}</h2>
                <p className="mt-2 leading-relaxed text-foreground">{animal.description}</p>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setOpen(true)}
                  className="w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
                >
                  Adopt {animal.name} ❤
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl max-h-[90vh] overflow-y-auto">
          {animal?.is_adopted ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">🐾 Already adopted!</DialogTitle>
                <DialogDescription className="pt-2 text-base">
                  This pet has already found their forever home! 🐾
                </DialogDescription>
              </DialogHeader>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">🐾 Apply to adopt {animal?.name}</DialogTitle>
                <DialogDescription className="pt-2 text-base">
                  Fill in the form below and we&apos;ll be in touch soon.
                </DialogDescription>
              </DialogHeader>

              <AdoptionForm animalId={id} onDone={() => setOpen(false)} />

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Or contact us directly</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted/60 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</p>
                      <p className="truncate font-semibold">{CONTACT_PHONE}</p>
                    </div>
                  </div>
                  <CopyButton value={CONTACT_PHONE} label="Phone number" />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted/60 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</p>
                      <p className="truncate font-semibold">{CONTACT_EMAIL}</p>
                    </div>
                  </div>
                  <CopyButton value={CONTACT_EMAIL} label="Email address" />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdoptionForm({ animalId, onDone }: { animalId: string; onDone: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    message: "",
  });
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicant_name || !form.applicant_email) {
      toast.error("Name and email are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/applications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_name: form.applicant_name,
          applicant_email: form.applicant_email,
          applicant_phone: form.applicant_phone,
          animal_id: animalId,
          status: "pending",
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Your application has been submitted! We'll be in touch soon 🐾");
      onDone();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input required placeholder="Full name *" value={form.applicant_name} onChange={(e) => update("applicant_name", e.target.value)} className={cls} />
      <input required type="email" placeholder="Email address *" value={form.applicant_email} onChange={(e) => update("applicant_email", e.target.value)} className={cls} />
      <input placeholder="Phone number" value={form.applicant_phone} onChange={(e) => update("applicant_phone", e.target.value)} className={cls} />
      <textarea rows={3} placeholder="Why do you want to adopt?" value={form.message} onChange={(e) => update("message", e.target.value)} className={cls} />
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit application 🐾"}
      </button>
    </form>
  );
}
