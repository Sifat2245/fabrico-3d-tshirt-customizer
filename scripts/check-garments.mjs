import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readModel(name) {
  const buffer = await readFile(new URL(`../public/models/${name}`, import.meta.url));
  assert.equal(buffer.readUInt32LE(0), 0x46546c67);
  assert.equal(buffer.readUInt32LE(8), buffer.length);
  const jsonLength = buffer.readUInt32LE(12);
  return { document: JSON.parse(buffer.subarray(20, 20 + jsonLength)), binary: buffer.subarray(28 + jsonLength), size: buffer.length };
}

function values(model, index) {
  const accessor = model.document.accessors[index];
  const view = model.document.bufferViews[accessor.bufferView];
  const width = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[accessor.type];
  const size = { 5123: 2, 5125: 4, 5126: 4 }[accessor.componentType];
  const read = { 5123: "readUInt16LE", 5125: "readUInt32LE", 5126: "readFloatLE" }[accessor.componentType];
  return Array.from({ length: accessor.count }, (_, vertex) =>
    Array.from({ length: width }, (_, component) => model.binary[read]((view.byteOffset ?? 0) + (accessor.byteOffset ?? 0) + vertex * (view.byteStride ?? size * width) + component * size)),
  );
}

for (const [id, filename] of [["cap", "baseball_cap.glb"], ["hoodie", "hoodie_black.glb"]]) {
  const source = await readModel(filename);
  const model = await readModel(`${id}-studio.glb`);
  const { document } = model;
  const sourceTriangles = source.document.meshes.reduce((sum, mesh) => sum + mesh.primitives.reduce((count, primitive) => count + source.document.accessors[primitive.indices].count / 3, 0), 0);
  let triangles = 0;
  const roles = new Set();
  for (const node of document.nodes) {
    const role = node.extras.garmentRole;
    roles.add(role);
    for (const primitive of document.meshes[node.mesh].primitives) {
      const { POSITION, NORMAL, TEXCOORD_0, TEXCOORD_1 } = primitive.attributes;
      const positions = values(model, POSITION);
      const uv = values(model, TEXCOORD_0);
      assert.equal(document.accessors[NORMAL].count, positions.length);
      assert.equal(document.accessors[TEXCOORD_1].count, positions.length);
      assert.equal(uv.length, positions.length);
      const indices = values(model, primitive.indices).flat();
      assert.equal(indices.length % 3, 0);
      assert.ok(indices.every((index) => index >= 0 && index < positions.length));
      assert.ok([...positions, ...uv].every((vertex) => vertex.every(Number.isFinite)));
      triangles += indices.length / 3;
      if (role === "front" || role === "back") {
        for (let vertex = 0; vertex < positions.length; vertex++) {
          const [x, y] = positions[vertex];
          const [width, bottom, height] = id === "cap" ? [9.5, -1.825, 9.5] : [139, 255, 139];
          assert.ok(Math.abs(uv[vertex][0] - (0.5 + (role === "back" ? -x : x) / width)) < 0.00001, "Panel seams must share the projection and back artwork must read correctly");
          assert.ok(Math.abs(uv[vertex][1] - (y - bottom) / height) < 0.00001);
        }
      }
    }
  }
  assert.equal(triangles, sourceTriangles, "Preparation must preserve every source triangle");
  assert.ok(roles.has("front") && roles.has("back") && roles.has("trimFront") && roles.has("trimBack"));
  assert.ok(model.size < source.size * 0.3, "Prepared assets must remove oversized source textures");
  document.materials.forEach((material) => {
    assert.equal(material.pbrMetallicRoughness.metallicFactor, 0);
    if (material.normalTexture) assert.equal(material.normalTexture.texCoord, 1, "Fabric normals must retain original UVs");
  });
  console.log(`${id}: ${triangles.toLocaleString()} triangles preserved; front/back UVs, seams, indices, fabric normals, and asset size passed.`);
}
