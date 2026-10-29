"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { StudioTemplateId } from "@/data/studio";
import { GarmentMesh } from "./GarmentMesh";
import { GarmentFallback } from "../GarmentFallback";

export interface GarmentPreviewProps {
  color: string;
  template?: StudioTemplateId;
  showArtwork?: boolean;
  rotation?: number;
  story?: boolean;
  interactive?: boolean;
}

export default function GarmentPreview({
  color,
  template = "original",
  showArtwork = true,
  rotation = -0.3,
  story,
  interactive = true,
}: GarmentPreviewProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.8], fov: 37 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, alpha: true }}
      aria-label="Interactive 3D preview of your customized T-shirt"
      className="garment-canvas"
      fallback={<GarmentFallback failed />}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[3, 5, 5]} intensity={3} />
      <directionalLight position={[-4, 1, 3]} intensity={1.2} color="#dae5ff" />
      <directionalLight position={[1, 3, -4]} intensity={2} />
      <Suspense fallback={null}>
        <GarmentMesh
          color={color}
          template={template}
          showArtwork={showArtwork}
          rotation={rotation}
          story={story}
        />
      </Suspense>
      {interactive && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2 - 0.4}
          maxPolarAngle={Math.PI / 2 + 0.4}
        />
      )}
    </Canvas>
  );
}
