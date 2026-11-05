import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import FlowShell from "@/components/FlowShell";
import WaitBadge from "@/components/WaitBadge";
import StartOver from "@/components/StartOver";
import { BRANCHES, findService } from "@/data/sampleData";

export const Route = createFileRoute("/branch")({
  validateSearch: (search) => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Choose a branch — BranchFlow" },
      { name: "description", content: "Compare sample branches, their hours and estimated wait times." },
    ],
  }),
  component: BranchStep,
});

function BranchStep() {
  const { service: serviceId } = Route.useSearch();
  const service = findService(serviceId);

  if (!service) return <StartOver message="Choose a service first." />;

  return (
    <FlowShell
      step={1}
      eyebrow={`Step 2 of 5 · ${service.name}`}
      title="Where would you like to go?"
      intro="Each sample branch shows today's estimated wait so you can pick the quieter one."
    >
      <div className="grid gap-3">
        {BRANCHES.map((branch) => (
          <Link
            key={branch.id}
            to="/visit"
            search={{ service: service.id, branch: branch.id }}
            className="group block rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-px hover:border-primary/40 hover:shadow-sm sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl tracking-tight text-foreground">
                  {branch.name}
                </p>
                <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {branch.address}
                </p>
              </div>
              <WaitBadge wait={branch.wait} tier={branch.waitTier} />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                {branch.hours}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                View details
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/service"
        className="mt-6 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        Back to services
      </Link>
    </FlowShell>
  );
}