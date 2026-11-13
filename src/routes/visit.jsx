import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Timer } from "lucide-react";
import FlowShell from "@/components/FlowShell";
import WaitBadge from "@/components/WaitBadge";
import DocumentChecklist from "@/components/DocumentChecklist";
import StartOver from "@/components/StartOver";
import { findService } from "@/data/sampleData";
import { branchFromSearch, branchSearchParams } from "@/lib/branch";

export const Route = createFileRoute("/visit")({
  validateSearch: (search) => ({
    service: typeof search.service === "string" ? search.service : undefined,
    branch: typeof search.branch === "string" ? search.branch : undefined,
    address: typeof search.address === "string" ? search.address : undefined,
    wait: typeof search.wait === "string" ? search.wait : undefined,
    tier: typeof search.tier === "string" ? search.tier : undefined,
    hours: typeof search.hours === "string" ? search.hours : undefined,
    zip: typeof search.zip === "string" ? search.zip : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Wait time & documents — BranchFlow" },
      { name: "description", content: "See the estimated wait and the documents to bring for your visit." },
    ],
  }),
  component: VisitStep,
});

function VisitStep() {
  const search = Route.useSearch();
  const { service: serviceId, zip } = search;
  const service = findService(serviceId);
  const branch = branchFromSearch(search);

  if (!service || !branch) return <StartOver message="Pick a service and a branch first." />;

  return (
    <FlowShell
      step={3}
      eyebrow="Step 4 of 7"
      title="Here's what to expect"
      intro="A sample estimate for today, plus the documents the banker would ask to see."
    >
      <div className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] opacity-70">
          <Timer className="h-3.5 w-3.5" />
          Estimated wait right now
        </p>
        <p className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{branch.wait}</p>
        <p className="mt-3 flex items-center gap-1.5 text-sm opacity-80">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {branch.name} · {branch.address}
        </p>
        <p className="mt-1 text-xs opacity-60">{branch.hours}</p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Your service
          </p>
          <p className="mt-2 font-display text-xl tracking-tight text-foreground">
            {service.name}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">{service.duration} at the branch</p>
          <div className="mt-4">
            <WaitBadge wait={branch.wait} tier={branch.waitTier} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Documents to bring
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            For {service.name.toLowerCase()}, plan on bringing:
          </p>
          <div className="mt-4">
            <DocumentChecklist documents={service.documents} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          to="/appointment"
          search={{ service: service.id, zip, ...branchSearchParams(branch) }}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
        >
          Choose a date & time
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          to="/branch"
          search={{ service: service.id, zip }}
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Choose a different branch
        </Link>
      </div>
    </FlowShell>
  );
}