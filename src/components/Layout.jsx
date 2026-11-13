import { Link } from "@tanstack/react-router";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="h-2 w-2 rounded-full bg-[hsl(var(--warm))]" />
            </span>
            <span className="font-display text-lg tracking-tight text-foreground">
              BranchFlow
            </span>
          </Link>
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Sample data
          </span>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/70">
        <div className="mx-auto w-full max-w-5xl px-5 py-6 text-xs leading-relaxed text-muted-foreground sm:px-8">
          BranchFlow is a student prototype built for a class project. It is not
          affiliated with or endorsed by Wells Fargo. Branch locations come from
          public map data and wait times are sample estimates. No appointments are
          booked and no banking or account details are collected.
        </div>
      </footer>
    </div>
  );
}