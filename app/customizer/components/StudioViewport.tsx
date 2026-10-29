"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Layers2,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { PreviewBoundary } from "@/components/PreviewBoundary";
import { GarmentFallback } from "@/components/GarmentFallback";
import type { CustomizerState } from "./types";

const ModelViewer3D = dynamic(() => import("./ModelViewer3D"), {
  ssr: false,
  loading: () => <GarmentFallback />,
});

interface StudioViewportProps {
  state: CustomizerState;
  autoRotate: boolean;
  collapsed: boolean;
  onTogglePanel: () => void;
  onOpenSettings: () => void;
  onToggleRotation: () => void;
}

export function StudioViewport({
  state,
  autoRotate,
  collapsed,
  onTogglePanel,
  onOpenSettings,
  onToggleRotation,
}: StudioViewportProps) {
  return (
    <main id="main-content" className="studio-viewport">
      <div className="studio-viewport-top">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={
              collapsed ? "Expand design settings" : "Collapse design settings"
            }
            className="studio-panel-toggle"
            onClick={onTogglePanel}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
          <span className="flex items-center gap-2">
            <span className="studio-live-dot" /> LIVE 3D PREVIEW
          </span>
        </div>
        <span className="flex items-center gap-2">
          <Layers2 className="h-3.5 w-3.5" />
          {state.textLayers.length + state.logoLayers.length} layers
        </span>
      </div>
      <span className="studio-canvas-word" aria-hidden="true">
        YOUR CANVAS.
      </span>
      <PreviewBoundary>
        <ModelViewer3D
          customizerState={state}
          shirtColor={state.primary}
          autoRotate={autoRotate}
        />
      </PreviewBoundary>
      <div className="studio-viewport-bottom">
        <button
          type="button"
          className="studio-mobile-settings-button"
          onClick={onOpenSettings}
        >
          <SlidersHorizontal className="h-4 w-4" /> Design tools
        </button>
        <span className="studio-interaction-hint">
          Drag to rotate <span>·</span> Scroll to zoom
        </span>
        <button
          type="button"
          className={`studio-rotation-button ${autoRotate ? "is-active" : ""}`}
          onClick={onToggleRotation}
          aria-label="Toggle automatic rotation"
          aria-pressed={autoRotate}
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
      <Link href="/templates" className="studio-template-link">
        <ArrowLeft className="h-3 w-3" /> Try another starting point
      </Link>
    </main>
  );
}
