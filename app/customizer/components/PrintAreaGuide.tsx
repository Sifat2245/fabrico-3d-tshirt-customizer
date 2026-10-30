import type { GarmentId } from "@/data/garments";

export function PrintAreaGuide({ garment, side }: { garment: GarmentId; side: "Front" | "Back" }) {
  return (
    <svg className="pointer-events-none absolute h-60 w-60 text-[#768273]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6" aria-hidden="true">
      {garment === "cap" ? (
        <>
          <path d="M 1 81 C 1 45 20 19 50 19 S 99 45 99 81 Z" fill="currentColor" fillOpacity="0.04" />
          {side === "Back" && <path d="M 30 81 V 69 C 30 53 70 53 70 69 V 81" />}
          <path d="M 50 20 V 80" strokeDasharray="2 2" opacity="0.5" />
        </>
      ) : garment === "hoodie" ? (
        <>
          <path d="M 18 100 V 14 L 35 2 Q 50 16 65 2 L 82 14 V 100 Z" fill="currentColor" fillOpacity="0.04" />
          {side === "Front" && <path d="M 27 71 H 73 L 77 96 H 23 Z" opacity="0.5" />}
          <path d="M 50 10 V 100" strokeDasharray="2 2" opacity="0.5" />
        </>
      ) : (
        <>
          <path d={side === "Front"
            ? "M 50 16 C 43.5 16 38.5 10.5 38.5 10.5 H 24 L 6 26 L 19 38 L 29.5 31 V 88 H 70.5 V 31 L 81 38 L 94 26 L 79.5 10.5 H 61.5 C 61.5 10.5 56.5 16 50 16 Z"
            : "M 50 11.5 C 44.5 11.5 38.5 10.5 38.5 10.5 H 24 L 6 26 L 19 38 L 29.5 31 V 88 H 70.5 V 31 L 81 38 L 94 26 L 79.5 10.5 H 61.5 C 61.5 10.5 55.5 11.5 50 11.5 Z"} fill="currentColor" fillOpacity="0.04" />
          <path d="M 50 16 V 88" strokeDasharray="2 2" opacity="0.5" />
        </>
      )}
      <path d="M 20 50 H 80" strokeDasharray="2 2" opacity="0.3" />
    </svg>
  );
}
