import { MapPin, Timer } from "lucide-react";

export default function BranchStatus({ branch, status }) {
  const closedNow = status && !status.isOpen;

  return (
    <div className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] opacity-70">
        <Timer className="h-3.5 w-3.5" />
        Branch status
      </p>

      {!status ? (
        <p className="mt-3 font-display text-4xl tracking-tight opacity-70 sm:text-5xl">
          Checking today's hours…
        </p>
      ) : status.isOpen ? (
        <>
          <p className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">Open now</p>
          {branch.wait && (
            <p className="mt-2 text-sm opacity-80">Estimated walk-in wait: {branch.wait}</p>
          )}
        </>
      ) : (
        <>
          <p className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            {status.opensLaterToday ? "Closed right now" : "Closed for today"}
          </p>
          <p className="mt-2 text-sm opacity-80">{status.message}</p>
        </>
      )}

      <p className="mt-4 flex items-center gap-1.5 text-sm opacity-80">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {branch.name} · {branch.address}
      </p>
      <p className="mt-1 text-xs opacity-60">{branch.hours}</p>
      {closedNow && (
        <p className="mt-3 text-xs opacity-60">
          Walk-in wait is only estimated while the branch is open.
        </p>
      )}
    </div>
  );
}