import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MapPin, Clock, CalendarDays, Timer, FileText } from "lucide-react";
import FlowShell from "@/components/FlowShell";
import DocumentChecklist from "@/components/DocumentChecklist";
import WaitBadge from "@/components/WaitBadge";
import StartOver from "@/components/StartOver";
import Row from "@/components/SummaryRow";
import { findBranch, findService, formatDate } from "@/data/sampleData";

export const Route = createFileRoute("/confirmation")({
  validateSearch: (search) => ({
    service: typeof search.service === "string" ? search.service : undefined,
    branch: typeof search.branch === "string" ? search.branch : undefined,
    date: typeof search.date === "string" ? search.date : undefined,
    time: typeof search.time === "string" ? search.time : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Appointment confirmed — BranchFlow" },
      { name: "description", content: "Your sample branch visit summary: service, branch, date, time, wait and documents." },
    ],
  }),
  component: ConfirmationStep,
});

function referenceCode(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  return `BF-${String(hash).padStart(5, "0")}`;
}

function ConfirmationStep() {
  const { service: serviceId, branch: branchId, date, time } = Route.useSearch();
  const service = findService(serviceId);
  const branch = findBranch(branchId);

  if (!service || !branch || !date || !time) {
    return <StartOver message="This appointment summary is incomplete." />;
  }

  const code = referenceCode(`${service.id}|${branch.id}|${date}|${time}`);

  return (
    <FlowShell step={6} eyebrow="Step 7 of 7" title="You're all set.">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-5 w-5" strokeWidth={3} />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Appointment confirmed</p>
              <p className="text-xs text-muted-foreground">Reference {code}</p>
            </div>
          </div>
          <WaitBadge wait={`${branch.wait} wait`} tier={branch.waitTier} />
        </div>

        <div className="mt-6">
          <Row icon={FileText} label="Service" value={service.name} />
          <Row icon={MapPin} label="Branch" value={`${branch.name} · ${branch.address}`} />
          <Row icon={CalendarDays} label="Date" value={formatDate(date)} />
          <Row icon={Clock} label="Time" value={time} />
          <Row icon={Timer} label="Estimated wait" value={branch.wait} />
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
        <Link
          to="/service"
          className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
        >
          Plan another visit
        </Link>
        <Link to="/" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
          Back to home
        </Link>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        This is a prototype confirmation. No appointment was booked with a real bank
        and no personal information was collected.
      </p>
    </FlowShell>
  );
}