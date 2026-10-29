export const STUDIO_COLORS = [
  {
    id: "cobalt",
    name: "Studio blue",
    hex: "#2855f5",
    className: "swatch-cobalt",
  },
  { id: "chalk", name: "Chalk", hex: "#e9e8df", className: "swatch-chalk" },
  { id: "ink", name: "Ink", hex: "#252b30", className: "swatch-ink" },
  { id: "sage", name: "Sage", hex: "#929e83", className: "swatch-sage" },
  { id: "clay", name: "Clay", hex: "#b97865", className: "swatch-clay" },
] as const;

export const STUDIO_TEMPLATES = [
  {
    id: "original",
    name: "The original",
    category: "Typography",
    color: "#2855f5",
    ink: "#ffffff",
    text: "MAKE IT\nYOURS.",
    pattern: "plain",
    image: "/images/studio/original.png",
    tone: "blue",
  },
  {
    id: "club",
    name: "Off-duty club",
    category: "Everyday",
    color: "#e9e8df",
    ink: "#284e35",
    text: "OFF DUTY\nCLUB",
    pattern: "plain",
    image: "/images/studio/club.png",
    tone: "chalk",
  },
  {
    id: "motion",
    name: "In motion",
    category: "Sport",
    color: "#252b30",
    ink: "#c2d5b1",
    text: "IN\nMOTION",
    pattern: "strike",
    image: "/images/studio/motion.png",
    tone: "ink",
  },
  {
    id: "blank",
    name: "A blank canvas",
    category: "Essentials",
    color: "#929e83",
    ink: "#ffffff",
    text: "",
    pattern: "plain",
    image: "/images/studio/blank.png",
    tone: "sage",
  },
] as const;

export type StudioTemplate = (typeof STUDIO_TEMPLATES)[number];
export type StudioTemplateId = StudioTemplate["id"];
