"""Create the landing preview from the original garment, without dense stitch geometry."""
import copy
import json
from pathlib import Path
import struct

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public/models/tshirt2.glb"
TARGET = ROOT / "public/models/tshirt-preview.glb"

raw = SOURCE.read_bytes()
json_length = struct.unpack_from("<I", raw, 12)[0]
source = json.loads(raw[20:20 + json_length])
binary = raw[28 + json_length:]
output = {key: copy.deepcopy(source[key]) for key in ("asset", "scene", "scenes", "nodes")}
output.update(meshes=[], accessors=[], bufferViews=[], materials=[{
    "name": "Preview cotton", "doubleSided": True,
    "pbrMetallicRoughness": {"metallicFactor": 0, "roughnessFactor": 0.9},
}])
buffer = bytearray()
mesh_map = {}

def copy_accessor(index):
    accessor = copy.deepcopy(source["accessors"][index])
    view = source["bufferViews"][accessor["bufferView"]]
    components = {"SCALAR": 1, "VEC2": 2, "VEC3": 3}[accessor["type"]]
    size = {5126: 4, 5125: 4, 5123: 2}[accessor["componentType"]] * components
    stride = view.get("byteStride", size)
    start = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
    while len(buffer) % 4:
        buffer.append(0)
    offset = len(buffer)
    if stride == size:
        buffer.extend(binary[start:start + accessor["count"] * size])
    else:
        for vertex in range(accessor["count"]):
            buffer.extend(binary[start + vertex * stride:start + vertex * stride + size])
    accessor["bufferView"] = len(output["bufferViews"])
    accessor.pop("byteOffset", None)
    output["bufferViews"].append({"buffer": 0, "byteOffset": offset, "byteLength": len(buffer) - offset})
    output["accessors"].append(accessor)
    return len(output["accessors"]) - 1

for mesh_index in range(0, 30, 3):
    mesh = source["meshes"][mesh_index]
    primitive = mesh["primitives"][0]
    attributes = {key: copy_accessor(value) for key, value in primitive["attributes"].items()
                  if key in ("POSITION", "NORMAL", "TEXCOORD_0")}
    mesh_map[mesh_index] = len(output["meshes"])
    output["meshes"].append({"name": mesh["name"], "primitives": [{
        "attributes": attributes, "indices": copy_accessor(primitive["indices"]), "material": 0,
    }]})

for node in output["nodes"]:
    if "mesh" in node:
        original = node.pop("mesh")
        if original in mesh_map:
            node["mesh"] = mesh_map[original]

while len(buffer) % 4:
    buffer.append(0)
output["buffers"] = [{"byteLength": len(buffer)}]
encoded = json.dumps(output, separators=(",", ":")).encode()
encoded += b" " * (-len(encoded) % 4)
result = struct.pack("<III", 0x46546C67, 2, 28 + len(encoded) + len(buffer))
result += struct.pack("<II", len(encoded), 0x4E4F534A) + encoded
result += struct.pack("<II", len(buffer), 0x004E4942) + buffer
TARGET.write_bytes(result)
print(f"Preview: {len(result):,} bytes (original: {len(raw):,} bytes)")
