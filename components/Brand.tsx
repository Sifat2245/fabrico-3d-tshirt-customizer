import { Asterisk } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Fabrico">
      <span className="brand-mark">
        <Asterisk aria-hidden="true" strokeWidth={2.3} />
      </span>
      {!compact && (
        <span className="text-2xl font-semibold tracking-tighter">
          fabrico<span className="text-accent">.</span>
        </span>
      )}
    </span>
  );
}
