import { STUDIO_TEMPLATES, type StudioTemplateId } from "@/data/studio";
import {
  DEFAULT_STATE,
  type CustomizerState,
  type TextLayer,
} from "@/app/customizer/components/types";

export function createStudioPreset(id: StudioTemplateId, color?: string) {
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
    color: template.ink,
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
    primary,
    primaryFront: primary,
    primaryBack: primary,
    designPattern: template.pattern,
    designColor: template.id === "motion" ? "#435246" : template.ink,
    textLayers: template.text ? [textLayer] : [],
    layersOrder: template.text ? [textLayer.id] : [],
  } satisfies Omit<CustomizerState, "loadedLogoImages" | "loadedPatterns">;
}

export function studioHref(id: StudioTemplateId = "blank", color?: string) {
  const query = new URLSearchParams({ template: id });
  if (color) query.set("color", color);
  return `/customizer?${query.toString()}`;
}
