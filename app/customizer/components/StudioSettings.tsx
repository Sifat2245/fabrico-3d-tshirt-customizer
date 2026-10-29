"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import type { useCustomizerState } from "@/hooks/useCustomizerState";
import type { CustomizerState } from "./types";
import type { CustomizerTab } from "./SettingsIconSidebar";
import ColorSettings from "./ColorSettings";
import DesignsSettings from "./DesignsSettings";
import PatternsSettings from "./PatternsSettings";
import TextSettings from "./TextSettings";
import LogoUploadSettings from "./LogoUploadSettings";

const LABELS: Record<CustomizerTab, { title: string; description: string }> = {
  designs: {
    title: "A starting point",
    description: "Find a shape for your idea.",
  },
  colors: { title: "Set the mood", description: "Your canvas. Your colors." },
  patterns: {
    title: "A little texture",
    description: "Give your design another dimension.",
  },
  text: { title: "Say it your way", description: "Words worth wearing." },
  logos: { title: "Make your mark", description: "Your artwork belongs here." },
  settings: {
    title: "Your workspace",
    description: "A few things, just how you like them.",
  },
};

interface StudioSettingsProps {
  activeTab: CustomizerTab;
  customizer: ReturnType<typeof useCustomizerState>;
  autoRotate: boolean;
  onAutoRotateChange: (value: boolean) => void;
  onClose: () => void;
}

export function StudioSettings({
  activeTab,
  customizer,
  autoRotate,
  onAutoRotateChange,
  onClose,
}: StudioSettingsProps) {
  const {
    state,
    update,
    resetAll,
    preloadPattern,
    preloadImage,
    addTextLayer,
    updateTextLayer,
    deleteTextLayer,
    addLogoLayer,
    updateLogoLayer,
    deleteLogoLayer,
    moveLayer,
  } = customizer;
  const onUpdate = <K extends keyof CustomizerState>(
    key: K,
    value: CustomizerState[K],
  ) => update(key, value);

  return (
    <>
      <div className="studio-settings-heading">
        <div>
          <h2 id="settings-title">{LABELS[activeTab].title}</h2>
          <p>{LABELS[activeTab].description}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close design settings"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="studio-settings-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "colors" && (
              <ColorSettings
                state={state}
                onUpdate={onUpdate}
                onReset={resetAll}
              />
            )}
            {activeTab === "designs" && (
              <DesignsSettings state={state} onUpdate={onUpdate} />
            )}
            {activeTab === "patterns" && (
              <PatternsSettings
                state={state}
                onUpdate={onUpdate}
                preloadPattern={preloadPattern}
              />
            )}
            {activeTab === "text" && (
              <TextSettings
                state={state}
                onAddTextLayer={addTextLayer}
                onUpdateTextLayer={updateTextLayer}
                onDeleteTextLayer={deleteTextLayer}
              />
            )}
            {activeTab === "logos" && (
              <LogoUploadSettings
                state={state}
                onAddLogoLayer={addLogoLayer}
                onUpdateLogoLayer={updateLogoLayer}
                onDeleteLogoLayer={deleteLogoLayer}
                onMoveLayer={moveLayer}
                preloadImage={preloadImage}
              />
            )}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <label className="flex items-center justify-between gap-4 rounded-xl bg-[#e9ede6] p-4 text-xs">
                  <span>Rotate the preview</span>
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(event) =>
                      onAutoRotateChange(event.target.checked)
                    }
                    className="h-4 w-4 accent-blue-600"
                  />
                </label>
                <p className="text-xs leading-6 text-slate-500">
                  Your design is saved automatically in this browser. Come back
                  any time to keep creating.
                </p>
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center gap-2 text-xs text-red-600"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to a blank T-shirt
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
