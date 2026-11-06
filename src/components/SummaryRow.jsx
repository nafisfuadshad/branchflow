export default function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 border-t border-border py-3.5 first:border-t-0 first:pt-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}