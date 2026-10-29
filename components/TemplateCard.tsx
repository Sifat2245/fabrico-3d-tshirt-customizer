import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { StudioTemplate } from "@/data/studio";
import { studioHref } from "@/lib/studio-presets";

export function TemplateCard({ template }: { template: StudioTemplate }) {
  return (
    <Link
      href={studioHref(template.id)}
      className={`template-card template-tone-${template.tone}`}
    >
      <div className="template-card-visual">
        <span className="studio-label template-category">
          {template.category}
        </span>
        <Image
          src={template.image}
          alt={`${template.name} T-shirt design — open this starting point in the studio`}
          width={700}
          height={800}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="template-shirt"
        />
        <span className="template-card-action" aria-hidden="true">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 px-1 py-5">
        <h3 className="text-lg font-medium tracking-tight">{template.name}</h3>
        <span className="text-xs text-[var(--muted)]">Make it yours ↗</span>
      </div>
    </Link>
  );
}
