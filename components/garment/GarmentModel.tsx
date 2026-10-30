"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GARMENTS } from "@/data/garments";
import { createGarmentScene, disposeGarmentScene } from "@/lib/garment-model";
import { useJerseyTextures } from "@/hooks/useJerseyTextures";
import type { CustomizerState } from "@/app/customizer/components/types";

interface GarmentModelProps {
  state: CustomizerState;
  displaySize: number;
  preview?: boolean;
}

export function GarmentModel({ state, displaySize, preview = false }: GarmentModelProps) {
  const garment = GARMENTS[state.garment];
  const { scene } = useGLTF(preview ? garment.previewModel : garment.model);
  const invalidate = useThree((three) => three.invalidate);
  const { frontTex, backTex, trimFrontTex, trimBackTex } = useJerseyTextures(state);
  const prepared = useMemo(() => createGarmentScene(scene, state.garment, displaySize), [scene, state.garment, displaySize]);

  useEffect(() => {
    prepared.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const role = child.userData.garmentRole;
      if (role === "stitch" || role === "hardware") return;
      const materials: THREE.Material[] = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return;
        material.map = role === "front" ? frontTex : role === "back" ? backTex : role === "trimBack" ? trimBackTex : trimFrontTex;
        material.color.set("#ffffff");
        material.needsUpdate = true;
      });
    });
    invalidate();
  }, [prepared, frontTex, backTex, trimFrontTex, trimBackTex, invalidate]);

  useEffect(() => () => disposeGarmentScene(prepared), [prepared]);

  return <primitive object={prepared} dispose={null} />;
}
