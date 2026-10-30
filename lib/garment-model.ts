import * as THREE from "three";
import type { GarmentId } from "@/data/garments";

type GarmentRole = "front" | "back" | "trimFront" | "trimBack" | "stitch" | "hardware";

function shirtRole(name: string): GarmentRole {
  if (name.toLowerCase().includes("stitchmatshape")) return "stitch";
  if (/^28[_. ]/.test(name)) return "back";
  if (/^70[_. ]/.test(name)) return "front";
  if (name.includes("4491756") || /^29[_. ]/.test(name)) return "trimBack";
  return "trimFront";
}

function normalizeShirtUVs(geometry: THREE.BufferGeometry) {
  const uv = geometry.getAttribute("uv");
  if (!uv) return;
  let minU = Infinity, minV = Infinity, maxU = -Infinity, maxV = -Infinity;
  for (let vertex = 0; vertex < uv.count; vertex++) {
    minU = Math.min(minU, uv.getX(vertex));
    minV = Math.min(minV, uv.getY(vertex));
    maxU = Math.max(maxU, uv.getX(vertex));
    maxV = Math.max(maxV, uv.getY(vertex));
  }
  for (let vertex = 0; vertex < uv.count; vertex++) {
    uv.setXY(vertex, (uv.getX(vertex) - minU) / (maxU - minU || 1), (uv.getY(vertex) - minV) / (maxV - minV || 1));
  }
}

export function createGarmentScene(source: THREE.Group, id: GarmentId, displaySize: number) {
  const scene = source.clone(true);
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const role: GarmentRole = id === "tshirt" ? shirtRole(child.name) : child.userData.garmentRole ?? "trimFront";
    child.userData.garmentRole = role;
    child.geometry = child.geometry.clone();
    if (id === "tshirt" && role !== "stitch") normalizeShirtUVs(child.geometry);
    const materials: THREE.Material[] = Array.isArray(child.material) ? child.material : [child.material];
    const prepared = materials.map((original) => {
      const material = original.clone();
      if (material instanceof THREE.MeshStandardMaterial && role !== "stitch") {
        material.roughness = role === "hardware" ? 0.4 : 0.86;
        material.metalness = role === "hardware" ? 0.55 : 0;
        material.side = THREE.DoubleSide;
      }
      return material;
    });
    child.material = Array.isArray(child.material) ? prepared : prepared[0];
  });
  const bounds = new THREE.Box3().setFromObject(scene);
  const size = bounds.getSize(new THREE.Vector3());
  scene.position.sub(bounds.getCenter(new THREE.Vector3()));
  const group = new THREE.Group();
  group.add(scene);
  group.scale.setScalar(displaySize / Math.max(size.x, size.y, size.z));
  return group;
}

export function disposeGarmentScene(scene: THREE.Group) {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const materials: THREE.Material[] = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => material.dispose());
  });
}
