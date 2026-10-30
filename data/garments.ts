export type GarmentId = "tshirt" | "hoodie" | "cap";

export const GARMENTS = {
  tshirt: {
    id: "tshirt", name: "T-shirt", title: "The everyday original", number: "01",
    model: "/models/tshirt2.glb", previewModel: "/models/tshirt-preview.glb",
    description: "An everyday staple. An entirely new way to say something.",
    detail: "Front + back artwork", color: "#2855f5", tone: "blue",
    price: 49, sizes: ["S", "M", "L", "XL", "XXL"],
    poster: "/images/studio/original.png",
  },
  hoodie: {
    id: "hoodie", name: "Hoodie", title: "Your comfort zone, reimagined", number: "02",
    model: "/models/hoodie-studio.glb", previewModel: "/models/hoodie-studio.glb",
    description: "Big ideas. Easy layers. Make a little room for yourself.",
    detail: "Chest + back artwork", color: "#929e83", tone: "sage",
    price: 69.99, sizes: ["S", "M", "L", "XL", "XXL"],
    poster: "/images/studio/hoodie-studio.png",
  },
  cap: {
    id: "cap", name: "Cap", title: "A little detail. All you.", number: "03",
    model: "/models/cap-studio.glb", previewModel: "/models/cap-studio.glb",
    description: "Your signature, up top. Give every outfit a personal finishing touch.",
    detail: "Front + back crown artwork", color: "#e9e8df", tone: "chalk",
    price: 29.99, sizes: ["One size"],
    poster: "/images/studio/cap-studio.png",
  },
} as const;

export const GARMENT_LIST = Object.values(GARMENTS);

export function isGarmentId(value: unknown): value is GarmentId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(GARMENTS, value);
}
