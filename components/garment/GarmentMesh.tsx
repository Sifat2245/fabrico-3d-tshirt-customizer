"use client";

import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Group } from "three";
import type { StudioTemplateId } from "@/data/studio";
import type { GarmentId } from "@/data/garments";
import { createStudioPreset } from "@/lib/studio-presets";
import { GarmentModel } from "./GarmentModel";

interface GarmentMeshProps {
  color: string;
  template: StudioTemplateId;
  garment: GarmentId;
  showArtwork: boolean;
  rotation: number;
  story?: boolean;
}

export function GarmentMesh({ color, template, garment, showArtwork, rotation, story }: GarmentMeshProps) {
  const group = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const state = useMemo(() => ({
    ...createStudioPreset(template, color, garment),
    ...(!showArtwork ? { textLayers: [], layersOrder: [], designPattern: "plain" } : {}),
    loadedLogoImages: {}, loadedPatterns: {},
  }), [template, color, garment, showArtwork]);

  useEffect(() => {
    if (!group.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tween = gsap.to(group.current.rotation, {
      y: rotation, z: story ? 0 : -0.08, duration: reduced ? 0 : 0.3,
      ease: "power2.out", onUpdate: invalidate,
    });
    return () => { tween.kill(); };
  }, [rotation, story, invalidate]);

  useEffect(() => {
    if (!story || !group.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(group.current!.rotation, {
        y: Math.PI * 1.85, z: 0.08, ease: "none", onUpdate: invalidate,
        scrollTrigger: { trigger: "#how-it-works", start: "top 35%", end: "bottom bottom", scrub: true },
      });
    });
    return () => media.revert();
  }, [story, invalidate]);

  return <group ref={group}><GarmentModel state={state} displaySize={2.75} preview /></group>;
}
