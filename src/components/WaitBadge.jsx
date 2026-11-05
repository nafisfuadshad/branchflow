const TIERS = {
  short: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  long: "border-rose-200 bg-rose-50 text-rose-800",
};

export default function WaitBadge({ wait, tier = "short", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${TIERS[tier] || TIERS.short} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {wait}
    </span>
  );
}