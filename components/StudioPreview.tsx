"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { GarmentFallback } from "./GarmentFallback";
import { PreviewBoundary } from "./PreviewBoundary";
import type { GarmentPreviewProps } from "./garment/GarmentPreview";

const GarmentPreview = dynamic(() => import("./garment/GarmentPreview"), {
  ssr: false,
  loading: () => <GarmentFallback />,
});

export function StudioPreview(props: GarmentPreviewProps) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className="h-full w-full">
      <PreviewBoundary key={props.garment}>
        {ready ? <GarmentPreview {...props} /> : <GarmentFallback />}
      </PreviewBoundary>
    </div>
  );
}
