"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { OrbitControls, ContactShadows, Html, useProgress } from "@react-three/drei";
import { GARMENTS } from "@/data/garments";
import { GarmentModel } from "@/components/garment/GarmentModel";
import { GarmentFallback } from "@/components/GarmentFallback";
import type { CustomizerState } from "./types";

function Loader({ name }: { name: string }) {
  const { progress } = useProgress();
  return (
    <Html center zIndexRange={[1, 0]}>
      <div role="status" className="flex min-w-44 flex-col items-center gap-3 rounded-2xl bg-[#f8f9f5]/90 px-6 py-4 text-slate-600 backdrop-blur-md">
        <span className="text-xs font-medium">Preparing your {name.toLowerCase()}</span>
        <progress value={progress} max={100} aria-label="Loading 3D garment" className="h-1 w-32 accent-blue-600" />
      </div>
    </Html>
  );
}

export default function ModelViewer3D({ customizerState, autoRotate = false }: {
  customizerState: CustomizerState;
  autoRotate?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const garment = GARMENTS[customizerState.garment];
  return (
    <div className="relative h-full w-full select-none">
      <Canvas
        camera={{ position: [0, 0.05, 1.8], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={autoRotate && !reducedMotion ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: true }}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        aria-label={`Your ${garment.name.toLowerCase()} in 3D. Drag to rotate and scroll to zoom.`}
        fallback={<GarmentFallback failed />}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={2} />
        <directionalLight position={[-5, 3, -5]} intensity={1.2} />
        <Suspense fallback={<Loader name={garment.name} />}>
          <GarmentModel state={customizerState} displaySize={1.15} />
          <ContactShadows position={[0, -0.6, 0]} opacity={0.25} scale={5} blur={2.5} far={3} frames={1} />
        </Suspense>
        <OrbitControls
          key={customizerState.garment}
          makeDefault enablePan={false} enableZoom minDistance={1.2} maxDistance={5}
          target={[0, 0, 0]} autoRotate={autoRotate && !reducedMotion} autoRotateSpeed={1.5}
          maxPolarAngle={Math.PI / 2 + 0.3}
        />
      </Canvas>
    </div>
  );
}
