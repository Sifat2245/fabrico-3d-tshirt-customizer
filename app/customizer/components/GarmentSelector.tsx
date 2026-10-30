"use client";

import { GARMENT_LIST, GARMENTS, type GarmentId } from "@/data/garments";

export function GarmentSelector({ selected, onSelect }: {
  selected: GarmentId;
  onSelect: (garment: GarmentId) => void;
}) {
  return (
    <fieldset className="mb-6 border-b border-[#dbe0d6] pb-5">
      <legend className="mb-3 text-xs font-medium text-slate-600">Choose your canvas</legend>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#e9ede6] p-1">
        {GARMENT_LIST.map((garment) => (
          <button
            key={garment.id} type="button" aria-pressed={selected === garment.id}
            onClick={() => onSelect(garment.id)}
            className={`rounded-lg px-2 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${selected === garment.id ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-white/70"}`}
          >
            {garment.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-5 text-slate-500" aria-live="polite">
        {GARMENTS[selected].detail}. Each canvas keeps its own design.
      </p>
    </fieldset>
  );
}
