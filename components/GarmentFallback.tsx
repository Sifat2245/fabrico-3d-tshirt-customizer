import { Shirt } from "lucide-react";

export function GarmentFallback({ failed = false }: { failed?: boolean }) {
  return (
    <div className="garment-fallback" role="status">
      <Shirt aria-hidden="true" strokeWidth={0.6} />
      <span className="studio-label">
        {failed
          ? "Your canvas is waiting in the studio"
          : "Preparing your canvas…"}
      </span>
    </div>
  );
}
