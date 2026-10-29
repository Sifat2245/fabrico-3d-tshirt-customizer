"use client";

import {
  Palette,
  Type,
  Image,
  SlidersHorizontal,
  Shapes,
  Grid2X2,
  type LucideIcon,
} from "lucide-react";

export type CustomizerTab =
  "designs" | "colors" | "patterns" | "text" | "logos" | "settings";
const TABS: { id: CustomizerTab; icon: LucideIcon; label: string }[] = [
  { id: "designs", icon: Shapes, label: "Designs" },
  { id: "colors", icon: Palette, label: "Colors" },
  { id: "patterns", icon: Grid2X2, label: "Patterns" },
  { id: "text", icon: Type, label: "Text" },
  { id: "logos", icon: Image, label: "Uploads" },
  { id: "settings", icon: SlidersHorizontal, label: "Settings" },
];

export default function SettingsIconSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: CustomizerTab;
  onTabChange: (tab: CustomizerTab) => void;
}) {
  return (
    <nav className="studio-tools" aria-label="Design tools">
      {TABS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          aria-pressed={activeTab === id}
          aria-controls="design-settings"
          className={activeTab === id ? "is-active" : ""}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
