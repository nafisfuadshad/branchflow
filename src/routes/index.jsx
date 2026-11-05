import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, FileText, CalendarCheck } from "lucide-react";
import { BRANCHES } from "@/data/sampleData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BranchFlow — Plan your branch visit before you arrive" },
      {
        name: "description",
        content:
          "Pick a service, choose a sample branch, see the wait time and documents, then book a sample appointment.",
      },
    ],
  }),
  component: Home,
});

const PREVIEW_STEPS = [
  { icon: Clock, label: "See the wait", text: "Know how long the line runs today." },
  { icon: FileText, label: "Bring the right papers", text: "A checklist built for your service." },
  { icon: CalendarCheck, label: "Book a time", text: "Reserve a sample slot before you go." },
];

function Home() {
  const branch = BRANCHES[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
      <section className="grid items-center gap-12 py-14 sm:py-20 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Branch visits, without the guesswork
          </p>
          <h1 className="mt-4 font-display text-6xl leading-[0.95] tracking-tight text-foreground sm:text-7xl">
            BranchFlow
          </h1>
          <p className="mt-6 max-w-md text-xl leading-snug text-foreground/80 sm:text-2xl">
            Plan your branch visit before you arrive.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Choose what you need, see the estimated wait at each office, and get a
            checklist of documents to bring — in about a minute.
          </p>

          <div className="mt-8">
            <Link
              to="/service"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
            >
              Plan My Visit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-[hsl(var(--sand))]" />
          <div className="relative rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Sample branch
            </p>
            <p className="mt-2 font-display text-2xl tracking-tight">{branch.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {branch.address}
            </p>

            <div className="mt-5 flex items-baseline gap-2 border-t border-border pt-4">
              <span className="font-display text-4xl tracking-tight text-primary">
                {branch.wait}
              </span>
              <span className="text-xs text-muted-foreground">estimated wait</span>
            </div>

            <div className="mt-4 space-y-1 text-xs text-muted-foreground">
              <p>{branch.hours}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/70 py-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {PREVIEW_STEPS.map(({ icon: Icon, label, text }) => (
            <div key={label} className="flex gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}