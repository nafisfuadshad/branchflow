import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import FlowShell from "@/components/FlowShell";
import { SERVICES } from "@/data/sampleData";

export const Route = createFileRoute("/service")({
  head: () => ({
    meta: [
      { title: "Choose a service — BranchFlow" },
      { name: "description", content: "Pick the banking service you need before your branch visit." },
    ],
  }),
  component: ServiceStep,
});

function ServiceStep() {
  return (
    <FlowShell
      step={0}
      eyebrow="Step 1 of 7"
      title="What do you need help with?"
      intro="Pick the service that fits best. We'll show the right document checklist for it."
    >
      <div className="grid gap-3">
        {SERVICES.map((service) => (
          <Link
            key={service.id}
            to="/zipcode"
            search={{ service: service.id }}
            className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-px hover:border-primary/40 hover:shadow-sm sm:p-6"
          >
            <div>
              <p className="font-display text-xl tracking-tight text-foreground">
                {service.name}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <p className="mt-2.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {service.duration}
              </p>
            </div>
            <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </FlowShell>
  );
}