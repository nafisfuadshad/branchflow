import StepProgress from "@/components/StepProgress";

export default function FlowShell({ step, eyebrow, title, intro, children }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <StepProgress current={step} />

      <div className="mt-8">
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-display text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {intro}
          </p>
        )}
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}