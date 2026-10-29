"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { STUDIO_TEMPLATES } from "@/data/studio";
import { TemplateCard } from "@/components/TemplateCard";
import { LandingMotion } from "../../components/LandingMotion";

const FILTERS = ["All ideas", "Typography", "Everyday", "Sport", "Essentials"];

export function TemplateCollection() {
  const [filter, setFilter] = useState("All ideas");
  const templates = STUDIO_TEMPLATES.filter(
    (item) => filter === "All ideas" || item.category === filter,
  );

  return (
    <LandingMotion>
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="collection-intro">
          <p data-hero-reveal className="studio-label">
            The collection / Made to be remade
          </p>
          <h1 data-hero-reveal className="collection-title">
            A STARTING POINT.
            <br />
            <span className="text-accent">YOUR POINT OF VIEW.</span>
          </h1>
          <p
            data-hero-reveal
            className="max-w-md text-sm leading-7 text-[var(--muted)]"
          >
            Borrow a little inspiration. Add a lot of yourself. Every design
            here opens in the studio, ready for your own take.
          </p>
        </div>
        <div
          className="collection-filters"
          role="group"
          aria-label="Filter starting points"
        >
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={`collection-filter ${filter === item ? "is-active" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="sr-only">
          {templates.length} starting points
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
        <Link href="/customizer?template=blank" className="blank-canvas-link">
          <div className="flex items-center gap-5">
            <Plus className="h-7 w-7 text-accent" />
            <div>
              <h2 className="text-lg font-medium">
                Rather start from scratch?
              </h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                A blank canvas has your name on it.
              </p>
            </div>
          </div>
          <ArrowUpRight className="h-6 w-6" />
        </Link>
      </section>
    </LandingMotion>
  );
}
