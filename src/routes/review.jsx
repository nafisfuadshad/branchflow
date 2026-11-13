import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock, FileText, Mail, MapPin, Timer, User } from "lucide-react";
import FlowShell from "@/components/FlowShell";
import DocumentChecklist from "@/components/DocumentChecklist";
import WaitBadge from "@/components/WaitBadge";
import StartOver from "@/components/StartOver";
import SummaryRow from "@/components/SummaryRow";
import { findService, formatDate } from "@/data/sampleData";
import { branchFromSearch, branchSearchParams } from "@/lib/branch";

export const Route = createFileRoute("/review")({
  validateSearch: (search) => ({
    service: typeof search.service === "string" ? search.service : undefined,
    branch: typeof search.branch === "string" ? search.branch : undefined,
    address: typeof search.address === "string" ? search.address : undefined,
    wait: typeof search.wait === "string" ? search.wait : undefined,
    tier: typeof search.tier === "string" ? search.tier : undefined,
    hours: typeof search.hours === "string" ? search.hours : undefined,
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
  const search = Route.useSearch();
  const { service: serviceId, zip, date, time } = search;
  const service = findService(serviceId);
  const branch = branchFromSearch(search);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  if (!service || !branch || !date || !time) {
    return <StartOver message="This appointment summary is incomplete." />;
  }

  const details = { service: service.id, zip, ...branchSearchParams(branch), date, time };

  const confirm = () => {
    const fullName = name.trim();
    const address = email.trim();
    let valid = true;

    if (fullName.length < 2) {
      setNameError("Enter your full name as it appears on your ID.");
      valid = false;
    } else {
      setNameError("");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address)) {
      setEmailError("Enter a valid email address so we can send your confirmation.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!valid) return;
    navigate({ to: "/confirmation", search: { ...details, name: fullName, email: address } });
  };

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
          {name.trim() && <SummaryRow icon={User} label="Name" value={name.trim()} />}
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

        <div className="mt-6 border-t border-border pt-5">
          <label
            htmlFor="fullName"
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
          >
            <User className="h-3.5 w-3.5" />
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jordan Rivera"
            className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 sm:max-w-sm"
          />
          {nameError ? (
            <p className="mt-3 text-xs text-destructive">{nameError}</p>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              We'll put this name on your appointment.
            </p>
          )}
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <label
            htmlFor="email"
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
          >
            <Mail className="h-3.5 w-3.5" />
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 sm:max-w-sm"
          />
          {emailError ? (
            <p className="mt-3 text-xs text-destructive">{emailError}</p>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              We'll send your appointment confirmation to this address.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={confirm}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
        >
          Confirm appointment
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <Link
          to="/appointment"
          search={{ service: service.id, zip, ...branchSearchParams(branch), date, time }}
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Change date or time
        </Link>
      </div>
    </FlowShell>
  );
}