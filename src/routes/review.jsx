import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock, FileText, MapPin, Timer } from "lucide-react";
import FlowShell from "@/components/FlowShell";
import DocumentChecklist from "@/components/DocumentChecklist";
import WaitBadge from "@/components/WaitBadge";
import StartOver from "@/components/StartOver";
import SummaryRow from "@/components/SummaryRow";
import { findBranch, findService, formatDate } from "@/data/sampleData";

export const Route = createFileRoute("/review")({
  validateSearch: (search) => ({
    service: typeof search.service === "string" ? search.service : undefined,
    branch: typeof search.branch === "string" ? search.branch : undefined,
    zip: typeof search.zip === "string" ? search.zip : undefined,
    date: typeof search.date === "string" ? search.date : undefined,
    time: typeof search.time === "string" ? search.time : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Review your appointment — BranchFlow" },
      { name: "description", content: "Check your service, branch, date, time, wait and documents before confirming." },
    ],
  }),
  component: ReviewStep,
});

function ReviewStep() {
  const { service: serviceId, branch: branchId, zip, date, time } = Route.useSearch();
  const service = findService(serviceId);
  const branch = findBranch(branchId);
  const navigate = useNavigate();

  if (!service || !branch || !date || !time) {
    return <StartOver message="This appointment summary is incomplete." />;
  }

  const details = { service: service.id, branch: branch.id, zip, date, time };

  return (
    <FlowShell
      step={5}
      eyebrow="Step 6 of 7"
      title="Check everything over"
      intro="One last look before we confirm your sample appointment."
    >
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-medium text-foreground">Your appointment</p>
          <WaitBadge wait={`${branch.wait} wait`} tier={branch.waitTier} />
        </div>

        <div className="mt-5">
          <SummaryRow icon={FileText} label="Service" value={service.name} />
          <SummaryRow icon={MapPin} label="Branch" value={`${branch.name} · ${branch.address}`} />
          <SummaryRow icon={CalendarDays} label="Date" value={formatDate(date)} />
          <SummaryRow icon={Clock} label="Time" value={time} />
          <SummaryRow icon={Timer} label="Estimated wait" value={branch.wait} />
        </div>

        <div className="mt-6 rounded-xl bg-accent/60 p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-accent-foreground/70">
            Document checklist
          </p>
          <div className="mt-3">
            <DocumentChecklist documents={service.documents} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => navigate({ to: "/confirmation", search: details })}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
        >
          Confirm appointment
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <Link
          to="/appointment"
          search={{ service: service.id, branch: branch.id, zip, date, time }}
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Change date or time
        </Link>
      </div>
    </FlowShell>
  );
}