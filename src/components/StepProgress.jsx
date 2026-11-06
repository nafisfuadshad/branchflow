const STEPS = [
  "Service",
  "Location",
  "Branch",
  "Wait & documents",
  "Appointment",
  "Review",
  "Confirmed",
];

export default function StepProgress({ current = 0 }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] uppercase tracking-[0.12em]">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={[
                "flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : done
                    ? "border-primary/30 bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground",
              ].join(" ")}
            >
              {i + 1}
            </span>
            <span
              className={
                active
                  ? "font-medium text-foreground"
                  : done
                    ? "text-foreground/60"
                    : "text-muted-foreground"
              }
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 hidden h-px w-4 bg-border sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}