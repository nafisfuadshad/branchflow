import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, MapPin } from "lucide-react";
import FlowShell from "@/components/FlowShell";
import StartOver from "@/components/StartOver";
import { lookupZipcode } from "@/lib/server-fns";
import { SAMPLE_ZIPS, findService } from "@/data/sampleData";

export const Route = createFileRoute("/zipcode")({
  validateSearch: (search) => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Enter your ZIP code — BranchFlow" },
      { name: "description", content: "Enter your U.S. ZIP code to see the city, state and nearby fictional branches." },
    ],
  }),
  component: ZipcodeStep,
});

function ZipcodeStep() {
  const { service: serviceId } = Route.useSearch();
  const service = findService(serviceId);
  const navigate = useNavigate();
  const lookup = useServerFn(lookupZipcode);
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  if (!service) return <StartOver message="Choose a service first." />;

  const submit = async (event) => {
    event.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a valid 5-digit U.S. ZIP code, like 02108.");
      return;
    }

    setError("");
    setChecking(true);
    try {
      const result = await lookup({ data: { zip } });
      if (!result.valid) {
        setError(
          result.reason === "not_found"
            ? "We couldn't find that ZIP code. Please check it and try again."
            : "We couldn't check that ZIP code right now. Please try again.",
        );
        return;
      }
      navigate({
        to: "/branch",
        search: {
          service: service.id,
          zip: result.zip,
          city: result.city,
          state: result.state,
        },
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <FlowShell
      step={1}
      eyebrow={`Step 2 of 7 · ${service.name}`}
      title="Where should we look?"
      intro="Enter your ZIP code and we'll show the city, state and nearby fictional branches."
    >
      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <label
          htmlFor="zip"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
        >
          <MapPin className="h-3.5 w-3.5" />
          ZIP code
        </label>
        <input
          id="zip"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          value={zip}
          onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
          placeholder="e.g. 01402"
          className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm tracking-wide text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 sm:max-w-xs"
        />

        {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={checking}
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg enabled:hover:shadow-primary/20 disabled:cursor-wait disabled:opacity-60"
        >
          {checking ? "Checking ZIP code…" : "Find nearby branches"}
          {!checking && (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </button>

        <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          Sample ZIP codes:{" "}
          {SAMPLE_ZIPS.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setZip(sample);
                setError("");
              }}
              className="mr-2 underline-offset-4 hover:text-foreground hover:underline"
            >
              {sample}
            </button>
          ))}
        </p>
      </form>
    </FlowShell>
  );
}