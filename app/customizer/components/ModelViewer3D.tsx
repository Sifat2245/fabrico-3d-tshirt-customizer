'use client';

import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import {
  OrbitControls,
  ContactShadows,
  useGLTF,
  Html,
  Center,
  useProgress,
} from '@react-three/drei';
import * as THREE from 'three';
import { CustomizerState } from './types';
import { useJerseyTextures } from '../../../hooks/useJerseyTextures';

// ─── Piece classification for tshirt2.glb ────────────────────────────────────
// The garment is a multi-piece Clo3D-style export:
//   - `70_*`  : main FRONT torso panel      (design area)
//   - `28_*`  : main BACK torso panel       (design area)
//   - `71_*` / `29_*` : front / back collar bands
//   - `31_*` / `64_*` : side panels
//   - `2949190` / `30_*` : sleeves
//   - `4474558` / `4491756` : front / back hem bands
//   - `StitchMatShape_*` : stitching details (keep thread material)
type PieceRole = 'front' | 'back' | 'trimFront' | 'trimBack' | 'stitch';

const isPieceId = (name: string, id: string) => {
  const n = name.toLowerCase();
  return (
    n.startsWith(`${id}_`) || n.startsWith(`${id}.`) || n.startsWith(`${id} `)
  );
};

function classifyPiece(name: string): PieceRole {
  const n = name.toLowerCase();
  if (n.includes('stitchmatshape')) return 'stitch';
  // Back hem band → back trim
  if (n.includes('4491756')) return 'trimBack';
  // Back collar band → back trim
  if (isPieceId(n, '29')) return 'trimBack';
  // Front hem band → front trim
  if (n.includes('4474558')) return 'trimFront';
  // Sleeves + side panels + front collar → front trim
  if (n.includes('2949190')) return 'trimFront';
  if (isPieceId(n, '30') || isPieceId(n, '31') || isPieceId(n, '64')) return 'trimFront';
  if (isPieceId(n, '71')) return 'trimFront';
  // Main torso panels — the design print area
  if (isPieceId(n, '70')) return 'front';
  if (isPieceId(n, '28')) return 'back';
  return 'trimFront';
}

// ─── UV normalization ────────────────────────────────────────────────────────
// The GLB ships with pattern-layout UVs (e.g. [-3.2..3.2, -4.9..4.2]) instead
// of the [0,1] unit square, so a plain texture gets clamped/stretched into
// invisibility. We remap every piece's UVs to [0,1] per-piece so the design
// canvas maps cleanly onto the garment.
function normalizeUVs(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const uv = geometry.getAttribute('uv') as THREE.BufferAttribute | undefined;
  if (!uv) return geometry;

  let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i), v = uv.getY(i);
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }
  const du = maxU - minU || 1;
  const dv = maxV - minV || 1;

  const src = uv.array as ArrayLike<number>;
  const dst = new Float32Array(src.length);
  for (let i = 0; i < uv.count; i++) {
    dst[i * 2] = (src[i * 2] - minU) / du;
    dst[i * 2 + 1] = (src[i * 2 + 1] - minV) / dv;
  }

  const cloned = geometry.clone();
  cloned.setAttribute('uv', new THREE.BufferAttribute(dst, 2));
  return cloned;
}

// ─── Main model component ────────────────────────────────────────────────────
interface JerseyModelProps {
  customizerState: CustomizerState;
  shirtColor: string;
}

function JerseyModel({ customizerState, shirtColor }: JerseyModelProps) {
  const invalidate = useThree((state) => state.invalidate);
  const gltf = useGLTF('/models/tshirt2.glb');
  const { frontTex, backTex, trimFrontTex, trimBackTex } = useJerseyTextures(customizerState);

  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.material = Array.isArray(child.material) ? child.material.map((material) => material.clone()) : child.material.clone();
    });
    return clone;
  }, [gltf.scene]);

  // One-time classification + UV normalization per mesh (pure computation)
  const pieceInfo = useMemo(() => {
    const info: { mesh: THREE.Mesh; role: PieceRole; geometry: THREE.BufferGeometry | null }[] = [];
    clonedScene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const role = classifyPiece(mesh.name);
      const geometry =
        role !== 'stitch' && mesh.geometry.getAttribute('uv')
          ? normalizeUVs(mesh.geometry)
          : null;
      info.push({ mesh, role, geometry });
    });
    return info;
  }, [clonedScene]);

  useEffect(() => {
    const color = new THREE.Color(shirtColor);

    pieceInfo.forEach(({ mesh, role, geometry }) => {
      if (geometry) mesh.geometry = geometry;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat) => {
        const m = mat as THREE.MeshStandardMaterial;
        if (!m) return;

        // Stitching keeps its original thread material
        if (role === 'stitch') return;

        m.wireframe = false;
        m.metalness = 0;
        m.roughness = 0.85;

        const tex =
          role === 'front' ? frontTex
          : role === 'back' ? backTex
          : role === 'trimBack' ? trimBackTex
          : trimFrontTex;
        if (tex) {
          m.map = tex;
          m.color.set('#ffffff');
        } else {
          m.map = null;
          m.color.copy(color);
        }
        m.needsUpdate = true;
      });
    });
    invalidate();

  }, [pieceInfo, shirtColor, frontTex, backTex, trimFrontTex, trimBackTex, invalidate]);

  useEffect(() => () => {
    pieceInfo.forEach(({ mesh, geometry }) => {
      geometry?.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => material.dispose());
    });
  }, [pieceInfo]);

  return (
    <Center>
      <primitive object={clonedScene} />
    </Center>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div role="status" className="flex min-w-44 flex-col items-center gap-3 rounded-2xl border border-[#dbe0d6] bg-[#f8f9f5]/90 px-6 py-4 text-slate-600 backdrop-blur-md">
        <span className="text-xs font-medium">Preparing your T-shirt</span>
        <progress value={progress} max={100} aria-label="Loading 3D garment" className="h-1 w-32 accent-blue-600" />
      </div>
    </Html>
  );
}

interface ModelViewer3DProps {
  customizerState: CustomizerState;
  shirtColor?: string;
  autoRotate?: boolean;
  wireframe?: boolean;
}

export default function ModelViewer3D({
  customizerState,
  shirtColor = '#FFFFFF',
  autoRotate = false,
}: ModelViewer3DProps) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="relative w-full h-full select-none">
      <Canvas
        camera={{ position: [0, 0, 1.8], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={autoRotate && !reducedMotion ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Your T-shirt in 3D. Drag to rotate and scroll to zoom."
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={2} castShadow shadow-bias={-0.0001} />
        <directionalLight position={[-5, 3, -5]} intensity={1.2} />

        <Suspense fallback={<Loader />}>
          <JerseyModel customizerState={customizerState} shirtColor={shirtColor} />
          <ContactShadows position={[0, -0.6, 0]} opacity={0.25} scale={5} blur={2.5} far={3} frames={1} />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={true}
          minDistance={1.2}
          maxDistance={5}
          target={[0, 0.05, 0]}
          autoRotate={autoRotate && !reducedMotion}
          autoRotateSpeed={1.5}
          maxPolarAngle={Math.PI / 2 + 0.3}
        />
      </Canvas>
    </div>
  );
}
