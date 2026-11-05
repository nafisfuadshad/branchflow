import { Check } from "lucide-react";

export default function DocumentChecklist({ documents = [] }) {
  return (
    <ul className="space-y-2.5">
      {documents.map((doc) => (
        <li key={doc} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span className="text-sm leading-relaxed text-foreground/85">{doc}</span>
        </li>
      ))}
    </ul>
  );
}