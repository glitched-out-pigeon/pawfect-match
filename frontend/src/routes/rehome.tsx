import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/rehome")({
  head: () => ({
    meta: [
      { title: "Rehome a pet — Pawfect Match" },
      { name: "description", content: "Submit details about an animal that needs a loving new home." },
    ],
  }),
  component: RehomePage,
});

function RehomePage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    animal_name: "",
    species: "",
    breed: "",
    age: "",
    description: "",
    reason_for_rehoming: "",
    image_url: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.owner_name || !form.owner_email || !form.animal_name || !form.species) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/rehoming/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: form.age ? Number(form.age) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold">Help a pet find a home</h1>
        <p className="mt-2 text-muted-foreground">
          Know an animal that needs a loving family? Submit their details and we&apos;ll help find them the perfect match.
        </p>

        {done ? (
          <ThankYou />
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl bg-card p-6 ring-1 ring-border">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name *">
                <input required value={form.owner_name} onChange={(e) => update("owner_name", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Your email *">
                <input required type="email" value={form.owner_email} onChange={(e) => update("owner_email", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Your phone">
                <input value={form.owner_phone} onChange={(e) => update("owner_phone", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Animal's name *">
                <input required value={form.animal_name} onChange={(e) => update("animal_name", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Species *">
                <input required value={form.species} onChange={(e) => update("species", e.target.value)} placeholder="e.g. Dog, Cat, Rabbit…" className={inputCls} />
              </Field>
              <Field label="Breed">
                <input value={form.breed} onChange={(e) => update("breed", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Age (years)">
                <input type="number" min="0" value={form.age} onChange={(e) => update("age", e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Photo">
              <ImageDrop value={form.image_url} onChange={(v) => update("image_url", v)} />
            </Field>
            <Field label="Description of the animal">
              <textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Reason for rehoming">
              <textarea rows={3} value={form.reason_for_rehoming} onChange={(e) => update("reason_for_rehoming", e.target.value)} className={inputCls} />
            </Field>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit 🐾"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ImageDrop({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [err, setErr] = useState("");

  function handleFile(file: File) {
    setErr("");
    if (!file.type.startsWith("image/")) { setErr("Please drop an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { setErr("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center text-sm transition ${dragOver ? "border-primary bg-primary/5" : "border-border bg-background"}`}
      >
        {value ? (
          <div className="flex w-full items-center gap-3">
            <img src={value} alt="preview" className="h-16 w-16 rounded object-cover" />
            <div className="flex-1 truncate text-left text-xs text-muted-foreground">
              {value.startsWith("data:") ? "Uploaded image" : value}
            </div>
            <button type="button" onClick={() => onChange("")} className="text-xs text-red-500 hover:text-red-400">Remove</button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground">Drag &amp; drop a photo here, or</p>
            <label className="cursor-pointer rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              Browse
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
          </>
        )}
      </div>
      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
    </div>
  );
}

function ThankYou() {
  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl bg-warm/40 p-8 text-center ring-1 ring-border">
        <p className="text-lg font-medium">
          Thank you! We&apos;ve received your submission and will review it shortly. 🐾❤️
        </p>
      </div>
      <hr className="border-border" />
      <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
        <h2 className="text-xl font-semibold">Get in touch</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Feel free to contact us anytime, or visit us in person during our open hours.
        </p>
        <div className="mt-4 space-y-1 text-sm">
          <p className="font-semibold">Pawfect Match Animal Shelter</p>
          <p>123 Pawfect Lane, 5th Block, Koramangala</p>
          <p>Bengaluru, Karnataka 560034, India</p>
          <p className="pt-2"><span className="font-medium">Phone:</span> +91 80 1234 5678</p>
          <p><span className="font-medium">Email:</span> adopt@pawfectmatch.in</p>
          <p><span className="font-medium">Hours:</span> Monday–Saturday, 10:00 AM – 6:00 PM</p>
        </div>
        <p className="mt-4 text-sm">🐾 ❤️</p>
      </div>
    </div>
  );
}
