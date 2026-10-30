import { STUDIO_TEMPLATES, type StudioTemplateId } from "@/data/studio";
import type { GarmentId } from "@/data/garments";
import {
  DEFAULT_STATE,
  type CustomizerState,
  type TextLayer,
} from "@/app/customizer/components/types";

function readableInk(background: string, ink: string) {
  const luminance = (hex: string) => {
    const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
      .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const base = luminance(background);
  const text = luminance(ink);
  const contrast = (Math.max(base, text) + 0.05) / (Math.min(base, text) + 0.05);
  return contrast >= 3 ? ink : base > 0.3 ? "#26322a" : "#ffffff";
}

export function createStudioPreset(id: StudioTemplateId, color?: string, garment: GarmentId = "tshirt") {
  const template =
    STUDIO_TEMPLATES.find((item) => item.id === id) ?? STUDIO_TEMPLATES[0];
  const primary =
    color && /^#[\da-f]{6}$/i.test(color) ? color : template.color;
  const textLayer: TextLayer = {
    id: `template-${template.id}`,
    type: "text",
    side: "Front",
    text: template.text,
    font: "Oswald",
    fontWeight: "700",
    textSize: 110,
    color: readableInk(primary, template.ink),
    x: 512,
    y: 400,
    scale: 1,
    rotation: 0,
    letterSpacing: -2,
    lineSpacing: 1,
    curveRadius: 0,
    shadowEnabled: false,
    shadowColor: "#000000",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    outlineEnabled: false,
    outlineColor: "#ffffff",
    outlineWidth: 0,
  };
  return {
    ...DEFAULT_STATE,
    garment,
    primary,
    primaryFront: primary,
    primaryBack: primary,
    designPattern: template.pattern,
    designColor: template.id === "motion" ? "#435246" : template.ink,
    textLayers: template.text ? [textLayer] : [],
    layersOrder: template.text ? [textLayer.id] : [],
  } satisfies Omit<CustomizerState, "loadedLogoImages" | "loadedPatterns">;
}

export function studioHref(id: StudioTemplateId = "blank", color?: string, garment: GarmentId = "tshirt") {
  const query = new URLSearchParams({ template: id, garment });
  if (color) query.set("color", color);
  return `/customizer?${query.toString()}`;
}
