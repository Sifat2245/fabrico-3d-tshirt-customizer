import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const modelDirectory = new URL("../public/models/", import.meta.url);
const componentSizes = { 5123: 2, 5125: 4, 5126: 4 };
const componentReaders = { 5123: "readUInt16LE", 5125: "readUInt32LE", 5126: "readFloatLE" };
const dimensions = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };

function readAccessor(document, binary, index) {
  const accessor = document.accessors[index];
  const view = document.bufferViews[accessor.bufferView];
  const width = dimensions[accessor.type];
  const size = componentSizes[accessor.componentType];
  const stride = view.byteStride ?? width * size;
  const offset = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
  return Array.from({ length: accessor.count }, (_, vertex) =>
    Array.from({ length: width }, (_, component) =>
      binary[componentReaders[accessor.componentType]](offset + vertex * stride + component * size),
    ),
  );
}

function connectedPanels(positions, indices) {
  const parents = positions.map((_, index) => index);
  const find = (vertex) => {
    while (parents[vertex] !== vertex) {
      parents[vertex] = parents[parents[vertex]];
      vertex = parents[vertex];
    }
    return vertex;
  };
  for (let index = 0; index < indices.length; index += 3) {
    const parent = find(indices[index]);
    parents[find(indices[index + 1])] = parent;
    parents[find(indices[index + 2])] = parent;
  }
  const panels = new Map();
  positions.forEach((position, index) => {
    const parent = find(index);
    const panel = panels.get(parent) ?? { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity], count: 0 };
    position.forEach((value, axis) => {
      panel.min[axis] = Math.min(panel.min[axis], value);
      panel.max[axis] = Math.max(panel.max[axis], value);
    });
    panel.count++;
    panels.set(parent, panel);
  });
  return positions.map((_, index) => panels.get(find(index)));
}

function classifyHoodiePanel(panel) {
  const { min, max, count } = panel;
  if (count > 500 && min[0] < -30 && max[0] > 30) {
    const height = max[1] - min[1];
    if (height > 100) return min[2] > -15 ? "front" : "back";
    if (min[2] > 10 && height > 30 && height < 60) return "front";
  }
  return null;
}

async function prepareGarment(id, sourceName) {
  const raw = await readFile(new URL(sourceName, modelDirectory));
  const jsonLength = raw.readUInt32LE(12);
  const source = JSON.parse(raw.subarray(20, 20 + jsonLength));
  const binary = raw.subarray(28 + jsonLength);
  const output = {
    asset: { version: "2.0", generator: "Fabrico garment preparation" },
    scene: 0, scenes: [{ nodes: [] }], nodes: [], meshes: [], accessors: [], bufferViews: [],
    materials: [], textures: [], images: [], samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }],
  };
  const chunks = [];
  let byteLength = 0;
  const append = (data) => {
    const padding = Buffer.alloc((4 - byteLength % 4) % 4);
    chunks.push(padding, data);
    byteLength += padding.length;
    const index = output.bufferViews.length;
    output.bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: data.length });
    byteLength += data.length;
    return index;
  };
  const attribute = (values, type, integer = false) => {
    const array = integer ? new Uint32Array(values.flat()) : new Float32Array(values.flat());
    const accessor = { bufferView: append(Buffer.from(array.buffer)), componentType: integer ? 5125 : 5126, count: values.length, type };
    if (type === "VEC3") {
      accessor.min = [0, 1, 2].map((axis) => values.reduce((min, value) => Math.min(min, value[axis]), Infinity));
      accessor.max = [0, 1, 2].map((axis) => values.reduce((max, value) => Math.max(max, value[axis]), -Infinity));
    }
    output.accessors.push(accessor);
    return output.accessors.length - 1;
  };

  for (const material of source.materials) {
    const prepared = {
      name: material.name, doubleSided: true,
      pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], roughnessFactor: 0.86, metallicFactor: 0 },
    };
    if (material.normalTexture) {
      const image = source.images[source.textures[material.normalTexture.index].source];
      const view = source.bufferViews[image.bufferView];
      const resized = await sharp(binary.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength))
        .resize(1024, 1024, { fit: "inside", withoutEnlargement: true }).png().toBuffer();
      prepared.normalTexture = { index: output.textures.length, texCoord: 1, scale: material.normalTexture.scale ?? 0.65 };
      output.textures.push({ sampler: 0, source: output.images.length });
      output.images.push({ bufferView: append(resized), mimeType: "image/png" });
    }
    output.materials.push(prepared);
  }

  const statistics = {};
  for (const [meshIndex, mesh] of source.meshes.entries()) {
    for (const primitive of mesh.primitives) {
      const attributes = Object.fromEntries(Object.entries(primitive.attributes)
        .filter(([key]) => ["POSITION", "NORMAL", "TANGENT", "TEXCOORD_0"].includes(key))
        .map(([key, index]) => [key, readAccessor(source, binary, index)]));
      const positions = attributes.POSITION;
      const indices = readAccessor(source, binary, primitive.indices).flat();
      const panels = id === "hoodie" ? connectedPanels(positions, indices) : null;
      const groups = new Map();
      for (let index = 0; index < indices.length; index += 3) {
        const triangle = indices.slice(index, index + 3);
        const z = triangle.reduce((sum, vertex) => sum + positions[vertex][2], 0) / 3;
        const role = id === "cap"
          ? meshIndex === 6 ? z >= 0 ? "front" : "back" : meshIndex === 5 ? "hardware" : meshIndex === 2 || meshIndex === 3 ? "trimBack" : "trimFront"
          : primitive.material === 0 && classifyHoodiePanel(panels[triangle[0]]) || (z >= -3 ? "trimFront" : "trimBack");
        if (!groups.has(role)) groups.set(role, []);
        groups.get(role).push(...triangle);
      }

      for (const [role, triangleIndices] of groups) {
        const vertices = [...new Set(triangleIndices)];
        const remap = new Map(vertices.map((vertex, index) => [vertex, index]));
        const printPanel = role === "front" || role === "back";
        // A shared projection keeps artwork continuous across source UV islands.
        // Back U is reversed so text reads correctly when the garment is turned.
        const uv = vertices.map((vertex) => {
          if (!printPanel) return attributes.TEXCOORD_0[vertex];
          const [x, y] = positions[vertex];
          const [width, bottom, height] = id === "cap" ? [9.5, -1.825, 9.5] : [139, 255, 139];
          return [0.5 + (role === "back" ? -x : x) / width, (y - bottom) / height];
        });
        const prepared = {
          POSITION: attribute(vertices.map((vertex) => positions[vertex]), "VEC3"),
          NORMAL: attribute(vertices.map((vertex) => attributes.NORMAL[vertex]), "VEC3"),
          TEXCOORD_0: attribute(uv, "VEC2"),
          TEXCOORD_1: attribute(vertices.map((vertex) => attributes.TEXCOORD_0[vertex]), "VEC2"),
        };
        if (attributes.TANGENT) prepared.TANGENT = attribute(vertices.map((vertex) => attributes.TANGENT[vertex]), "VEC4");
        const name = `${id}_${meshIndex}_${role}`;
        output.scenes[0].nodes.push(output.nodes.length);
        output.nodes.push({ name, mesh: output.meshes.length, extras: { garmentRole: role } });
        output.meshes.push({ name, primitives: [{ attributes: prepared, indices: attribute(triangleIndices.map((vertex) => [remap.get(vertex)]), "SCALAR", true), material: primitive.material }] });
        statistics[role] = (statistics[role] ?? 0) + triangleIndices.length / 3;
      }
    }
  }
  output.buffers = [{ byteLength }];
  let json = Buffer.from(JSON.stringify(output));
  json = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 32)]);
  let geometry = Buffer.concat(chunks);
  geometry = Buffer.concat([geometry, Buffer.alloc((4 - geometry.length % 4) % 4)]);
  const header = Buffer.alloc(20);
  header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4);
  header.writeUInt32LE(28 + json.length + geometry.length, 8);
  header.writeUInt32LE(json.length, 12); header.writeUInt32LE(0x4e4f534a, 16);
  const binaryHeader = Buffer.alloc(8);
  binaryHeader.writeUInt32LE(geometry.length); binaryHeader.writeUInt32LE(0x004e4942, 4);
  const result = Buffer.concat([header, json, binaryHeader, geometry]);
  const target = new URL(`${id}-studio.glb`, modelDirectory);
  await writeFile(target, result);
  console.log(`${fileURLToPath(target)}: ${(result.length / 1024 / 1024).toFixed(2)} MB`, statistics);
}

await prepareGarment("cap", "baseball_cap.glb");
await prepareGarment("hoodie", "hoodie_black.glb");
