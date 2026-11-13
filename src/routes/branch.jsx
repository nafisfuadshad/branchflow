import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, Navigation } from "lucide-react";
import FlowShell from "@/components/FlowShell";
import WaitBadge from "@/components/WaitBadge";
import StartOver from "@/components/StartOver";
import { findService } from "@/data/sampleData";
import { branchSearchParams } from "@/lib/branch";
import { findNearbyBranches } from "@/lib/server-fns";

export const Route = createFileRoute("/branch")({
  validateSearch: (search) => ({
    service: typeof search.service === "string" ? search.service : undefined,
    zip: typeof search.zip === "string" ? search.zip : undefined,
    city: typeof search.city === "string" ? search.city : undefined,
    state: typeof search.state === "string" ? search.state : undefined,
  }),
  loaderDeps: ({ search }) => ({ zip: search.zip }),
  loader: ({ deps }) =>
    deps.zip ? findNearbyBranches({ data: { zip: deps.zip } }) : Promise.resolve(null),
  head: () => ({
    meta: [
      { title: "Choose a branch — BranchFlow" },
      {
        name: "description",
        content: "Wells Fargo branch locations within 25 miles of your ZIP code, with sample wait estimates.",
      },
    ],
  }),
  component: BranchStep,
});

function BranchStep() {
  const { service: serviceId, zip } = Route.useSearch();
  const result = Route.useLoaderData();
  const service = findService(serviceId);

  if (!service) return <StartOver message="Choose a service first." />;
  if (!zip) return <StartOver message="Enter a ZIP code first." />;

  const place = result?.place ? `${result.place.city}, ${result.place.state}` : zip;
  const branches = result?.ok ? result.branches : [];

  return (
    <FlowShell
      step={2}
      eyebrow={`Step 3 of 7 · ${service.name}`}
      title="Where would you like to go?"
      intro={`Wells Fargo branches within 25 miles of ${place}. Estimated wait times are sample data for this prototype, not live from Wells Fargo.`}
    >
      {!result?.ok ? (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="text-sm font-medium text-foreground">We couldn't load branches for {zip}.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {result?.reason === "zip"
              ? "That ZIP code wasn't recognized. Try another U.S. ZIP code."
              : "The branch lookup didn't respond. Please try again in a moment."}
          </p>
          <Link
            to="/zipcode"
            search={{ service: service.id }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Try another ZIP code
          </Link>
        </div>
      ) : branches.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="text-sm font-medium text-foreground">
            No Wells Fargo branches found within 25 miles of {place}.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a ZIP code closer to a larger city so we can find a branch near you.
          </p>
          <Link
            to="/zipcode"
            search={{ service: service.id }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Try another ZIP code
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {branches.map((branch) => (
              <Link
                key={branch.id}
                to="/visit"
                search={{ service: service.id, zip, ...branchSearchParams(branch) }}
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
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Navigation className="h-3.5 w-3.5 shrink-0" />
                      {branch.distanceLabel} from {zip}
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

          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Branch locations come from public map data. Wait times are sample prototype
            estimates and are not provided by Wells Fargo.
          </p>
        </>
      )}

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