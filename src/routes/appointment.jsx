import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import FlowShell from "@/components/FlowShell";
import StartOver from "@/components/StartOver";
import { TIME_SLOTS, findBranch, findService, todayISO } from "@/data/sampleData";

export const Route = createFileRoute("/appointment")({
  validateSearch: (search) => ({
    service: typeof search.service === "string" ? search.service : undefined,
    branch: typeof search.branch === "string" ? search.branch : undefined,
    zip: typeof search.zip === "string" ? search.zip : undefined,
    date: typeof search.date === "string" ? search.date : undefined,
    time: typeof search.time === "string" ? search.time : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Choose a date & time — BranchFlow" },
      { name: "description", content: "Pick a sample appointment date and available time at your branch." },
    ],
  }),
  component: AppointmentStep,
});

function AppointmentStep() {
  const {
    service: serviceId,
    branch: branchId,
    zip,
    date: initialDate,
    time: initialTime,
  } = Route.useSearch();
  const navigate = useNavigate();
  const [minDate, setMinDate] = useState("");
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState(initialTime || "");

  const service = findService(serviceId);
  const branch = findBranch(branchId);

  useEffect(() => {
    setMinDate(todayISO());
  }, []);

  if (!service || !branch) return <StartOver message="Pick a service and a branch first." />;

  const ready = Boolean(date && time);

  const review = () => {
    if (!ready) return;
    navigate({
      to: "/review",
      search: { service: service.id, branch: branch.id, zip, date, time },
    });
  };

  return (
    <FlowShell
      step={4}
      eyebrow="Step 5 of 7"
      title="Pick a date and time"
      intro={`Sample availability at ${branch.name}. Times shown are placeholders for this prototype.`}
    >
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <label
          htmlFor="date"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
        >
          <CalendarDays className="h-3.5 w-3.5" />
          Appointment date
        </label>
        <input
          id="date"
          type="date"
          min={minDate || undefined}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 sm:max-w-xs"
        />

        <div className="mt-7 border-t border-border pt-6">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Available times
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {TIME_SLOTS.map((slot) => {
              const selected = slot === time;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  aria-pressed={selected}
                  className={[
                    "rounded-xl border px-2 py-2.5 text-xs font-medium transition-all",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground/80 hover:border-primary/40 hover:bg-accent",
                  ].join(" ")}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {!date && (
            <p className="mt-4 text-xs text-muted-foreground">
              Choose a date first, then pick a time.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={review}
          disabled={!ready}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg enabled:hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Review appointment
          <ArrowRight className="h-4 w-4 transition-transform group-enabled:group-hover:translate-x-0.5" />
        </button>
        <Link
          to="/visit"
          search={{ service: service.id, branch: branch.id, zip }}
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Back to wait time & documents
        </Link>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        {service.name} · {branch.name} · estimated wait {branch.wait}
      </p>
    </FlowShell>
  );
}