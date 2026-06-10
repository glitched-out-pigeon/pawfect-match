import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import helloDog from "@/assets/hello-dog.jpg";

export const Route = createFileRoute("/learn-more")({
  head: () => ({
    meta: [
      { title: "Learn more — Pawfect Match" },
      { name: "description", content: "Visit Pawfect Match Animal Shelter in Bengaluru. Address, phone, email and hours." },
    ],
  }),
  component: LearnMorePage,
});

function LearnMorePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <img
          src={helloDog}
          alt="Friendly dog holding a Hello sign in front of a little house"
          width={1024}
          height={1024}
          loading="lazy"
          className="mx-auto w-full max-w-md rounded-3xl shadow-xl ring-1 ring-border"
        />

        <div className="mt-10 space-y-4 text-left text-base leading-relaxed text-foreground">
          <p>
            Hey there! We would love to have you learn more about what we do and visit us personally.
          </p>

          <div className="rounded-2xl bg-card p-6 ring-1 ring-border shadow-sm">
            <h2 className="text-xl font-bold text-primary">Pawfect Match Animal Shelter</h2>
            <p className="mt-2">
              123 Pawfect Lane, 5th Block, Koramangala
              <br />
              Bengaluru, Karnataka 560034, India
            </p>
            <p className="mt-4">
              <span className="font-semibold">Phone:</span> +91 80 1234 5678
              <br />
              <span className="font-semibold">Email:</span> adopt@pawfectmatch.in
              <br />
              <span className="font-semibold">Hours:</span> Monday–Saturday, 10:00 AM – 6:00 PM
            </p>
          </div>

          <p>
            This is our address and contact information, feel free to contact us anytime and visit us when we&apos;re open 🐾❤️
          </p>
        </div>
      </section>
    </div>
  );
}
