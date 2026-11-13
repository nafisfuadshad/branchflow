import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import FlowShell from "@/components/FlowShell";
import StartOver from "@/components/StartOver";
import { findService, formatDate } from "@/data/sampleData";
import { branchFromSearch, branchSearchParams } from "@/lib/branch";
import { availableSlots, isoFromDate, nextOpenDate, weekdayName } from "@/lib/hours";

export const Route = createFileRoute("/appointment")({
  validateSearch: (search) => ({
    service: typeof search.service === "string" ? search.service : undefined,
    branch: typeof search.branch === "string" ? search.branch : undefined,
    address: typeof search.address === "string" ? search.address : undefined,
    wait: typeof search.wait === "string" ? search.wait : undefined,
    tier: typeof search.tier === "string" ? search.tier : undefined,
    hours: typeof search.hours === "string" ? search.hours : undefined,
    sched: typeof search.sched === "string" ? search.sched : undefined,
    zip: typeof search.zip === "string" ? search.zip : undefined,
    date: typeof search.date === "string" ? search.date : undefined,
    time: typeof search.time === "string" ? search.time : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Choose a date & time — BranchFlow" },
      {
        name: "description",
        content: "Pick an appointment date and a 30-minute time inside your branch's open hours.",
      },
    ],
  }),
  component: AppointmentStep,
});

function AppointmentStep() {
  const search = Route.useSearch();
  const {
    service: serviceId,
    zip,
    date: initialDate,
    time: initialTime,
  } = search;
  const navigate = useNavigate();
  const [now, setNow] = useState(null);
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState(initialTime || "");

  const service = findService(serviceId);
  const branch = branchFromSearch(search);
  const schedule = branch?.schedule;

  // The current time is only known in the browser, so availability is worked
  // out after mount and the first open day is preselected.
  useEffect(() => {
    setNow(new Date());
  }, []);

  useEffect(() => {
    if (!now || !schedule || date) return;
    const nextDate = nextOpenDate(schedule, now);
    if (nextDate) setDate(nextDate);
  }, [now, schedule, date]);

  if (!service || !branch) return <StartOver message="Pick a service and a branch first." />;

  const minDate = now ? isoFromDate(now) : undefined;
  const availability = date && now ? availableSlots(branch.schedule, date, now) : null;
  const nextDate = now ? nextOpenDate(branch.schedule, now) : "";
  const slots = availability?.slots || [];
  const ready = Boolean(time) && slots.some((slot) => slot.value === time);

  const changeDate = (value) => {
    setDate(value);
    setTime("");
  };

  const review = () => {
    if (!ready) return;
    navigate({
      to: "/review",
      search: { service: service.id, zip, ...branchSearchParams(branch), date, time },
    });
  };

  return (
    <FlowShell
      step={4}
      eyebrow="Step 5 of 7"
      title="Pick a date and time"
      intro={`Appointment times follow ${branch.name}'s open hours (${branch.hours}). Slots are 30 minutes.`}
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
          min={minDate}
          value={date}
          onChange={(e) => changeDate(e.target.value)}
          className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 sm:max-w-xs"
        />

        <div className="mt-7 border-t border-border pt-6">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Available times
          </p>

          {slots.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const selected = slot.value === time;
                return (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => setTime(slot.value)}
                    aria-pressed={selected}
                    className={[
                      "rounded-xl border px-2 py-2.5 text-xs font-medium transition-all",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground/80 hover:border-primary/40 hover:bg-accent",
                    ].join(" ")}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {!now
                ? "Checking today's availability…"
                : !date
                  ? "Choose a date first, then pick a time."
                  : availability?.closed
                    ? `${branch.name} is closed on ${weekdayName(date)}s.${
                        nextDate ? ` The next open day is ${formatDate(nextDate)}.` : ""
                      }`
                    : `There are no appointment times left on ${formatDate(date)}.${
                        nextDate ? ` The next available day is ${formatDate(nextDate)}.` : ""
                      }`}
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
          search={{ service: service.id, zip, ...branchSearchParams(branch) }}
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