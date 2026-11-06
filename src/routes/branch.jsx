import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import FlowShell from "@/components/FlowShell";
import WaitBadge from "@/components/WaitBadge";
import StartOver from "@/components/StartOver";
import { BRANCHES, branchesForZip, findService } from "@/data/sampleData";

export const Route = createFileRoute("/branch")({
  validateSearch: (search) => ({
    service: typeof search.service === "string" ? search.service : undefined,
    zip: typeof search.zip === "string" ? search.zip : undefined,
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
  const { service: serviceId, zip } = Route.useSearch();
  const service = findService(serviceId);

  if (!service) return <StartOver message="Choose a service first." />;

  const nearby = branchesForZip(zip);
  const noMatch = Boolean(zip) && nearby.length === 0;
  const branches = nearby.length ? nearby : BRANCHES;

  const intro = noMatch
    ? `No sample branch is filed under ${zip}, so here are all the sample locations instead.`
    : zip
      ? `Sample branches that cover ZIP ${zip}, with today's estimated wait.`
      : "Each sample branch shows today's estimated wait so you can pick the quieter one.";

  return (
    <FlowShell
      step={2}
      eyebrow={`Step 3 of 7 · ${service.name}`}
      title="Where would you like to go?"
      intro={intro}
    >
      <div className="grid gap-3">
        {branches.map((branch) => (
          <Link
            key={branch.id}
            to="/visit"
            search={{ service: service.id, branch: branch.id, zip }}
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

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          to="/zipcode"
          search={{ service: service.id }}
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Change ZIP code
        </Link>
        <Link
          to="/service"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Back to services
        </Link>
      </div>
    </FlowShell>
  );
}