import { Check, Loader2, Mail } from "lucide-react";

export default function EmailSentNotice({ status, email }) {
  if (status === "idle" || !email) return null;

  const sending = status === "sending";
  const sent = status === "sent";

  const text = sending
    ? "Sending your confirmation email…"
    : sent
      ? `Confirmation email sent to ${email}.`
      : "Confirmation created, but the email could not be delivered.";

  const tone = sending
    ? "border-border bg-secondary text-secondary-foreground"
    : sent
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className={`mt-6 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-xs leading-relaxed ${tone}`}>
      <span className="mt-0.5 shrink-0">
        {sending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : sent ? (
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        ) : (
          <Mail className="h-3.5 w-3.5" />
        )}
      </span>
      <p>{text}</p>
    </div>
  );
}