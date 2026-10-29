"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import type { StudioTemplateId } from "@/data/studio";
import { createStudioPreset } from "@/lib/studio-presets";
import { useJerseyTextures } from "@/hooks/useJerseyTextures";

function normalizedGeometry(source: THREE.BufferGeometry) {
  const geometry = source.clone();
  const uv = geometry.getAttribute("uv");
  if (!uv) return geometry;
  let minU = Infinity,
    minV = Infinity,
    maxU = -Infinity,
    maxV = -Infinity;
  for (let i = 0; i < uv.count; i++) {
    minU = Math.min(minU, uv.getX(i));
    maxU = Math.max(maxU, uv.getX(i));
    minV = Math.min(minV, uv.getY(i));
    maxV = Math.max(maxV, uv.getY(i));
  }
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(
      i,
      (uv.getX(i) - minU) / (maxU - minU || 1),
      (uv.getY(i) - minV) / (maxV - minV || 1),
    );
  }
  return geometry;
}

interface GarmentMeshProps {
  color: string;
  template: StudioTemplateId;
  showArtwork: boolean;
  rotation: number;
  story?: boolean;
}

export function GarmentMesh({
  color,
  template,
  showArtwork,
  rotation,
  story,
}: GarmentMeshProps) {
  const { scene } = useGLTF("/models/tshirt-preview.glb");
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const state = useMemo(
    () => ({
      ...createStudioPreset(template, color),
      ...(!showArtwork
        ? { textLayers: [], layersOrder: [], designPattern: "plain" }
        : {}),
      loadedLogoImages: {},
      loadedPatterns: {},
    }),
    [template, color, showArtwork],
  );
  const { frontTex, backTex, trimFrontTex } = useJerseyTextures(state);

  const garment = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.geometry = normalizedGeometry(child.geometry);
      child.material = new THREE.MeshStandardMaterial({
        roughness: 0.86,
        metalness: 0,
        side: THREE.DoubleSide,
      });
    });
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const wrapper = new THREE.Group();
    clone.position.sub(center);
    wrapper.add(clone);
    wrapper.scale.setScalar(2.75 / Math.max(size.x, size.y, size.z));
    return wrapper;
  }, [scene]);

  useEffect(() => {
    garment.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const material = child.material as THREE.MeshStandardMaterial;
      material.map = child.name.startsWith("70_")
        ? frontTex
        : child.name.startsWith("28_")
          ? backTex
          : trimFrontTex;
      material.needsUpdate = true;
    });
    invalidate();
  }, [garment, frontTex, backTex, trimFrontTex, invalidate]);

  useEffect(() => {
    if (!group.current) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const tween = gsap.to(group.current.rotation, {
      y: rotation,
      z: story ? 0 : -0.08,
      duration: reduced ? 0 : 0.3,
      ease: "power2.out",
      onUpdate: invalidate,
    });
    return () => {
      tween.kill();
    };
  }, [rotation, story, invalidate]);

  useEffect(() => {
    if (!story || !group.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(group.current!.rotation, {
        y: Math.PI * 1.85,
        z: 0.08,
        ease: "none",
        onUpdate: invalidate,
        scrollTrigger: {
          trigger: "#how-it-works",
          start: "top 35%",
          end: "bottom bottom",
          scrub: true,
        },
      });
    });
    return () => media.revert();
  }, [story, invalidate]);

  useEffect(
    () => () => {
      garment.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      });
    },
    [garment],
  );

  return (
    <group ref={group}>
      <primitive object={garment} dispose={null} />
    </group>
  );
}
