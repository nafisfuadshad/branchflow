import { Link } from "@tanstack/react-router";

export default function StartOver({ message = "Let's start from the beginning." }) {
  return (
    <div className="mx-auto w-full max-w-md px-5 py-24 text-center">
      <p className="font-display text-2xl tracking-tight text-foreground">{message}</p>
      <Link
        to="/service"
        className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
      >
        Choose a service
      </Link>
    </div>
  );
}