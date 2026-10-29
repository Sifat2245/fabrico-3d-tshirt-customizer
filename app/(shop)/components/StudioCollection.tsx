import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { STUDIO_TEMPLATES } from "@/data/studio";
import { TemplateCard } from "@/components/TemplateCard";

export function StudioCollection() {
  return (
    <section
      id="collection"
      className="studio-collection"
      aria-labelledby="collection-title"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          data-reveal
          className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="studio-label mb-5">A nudge for your imagination</p>
            <h2 id="collection-title" className="section-heading">
              GOOD STARTS.
              <br />
              GREAT <span className="text-accent">POSSIBILITIES.</span>
            </h2>
          </div>
          <Link href="/templates" className="text-link mb-2">
            Explore the collection <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STUDIO_TEMPLATES.slice(0, 3).map((template) => (
            <div key={template.id} data-reveal>
              <TemplateCard template={template} />
            </div>
          ))}
        </div>
        <p data-reveal className="mt-5 text-sm text-[var(--muted)]">
          A starting point, never a finished idea. Change every detail in the
          studio.
        </p>
      </div>
    </section>
  );
}
