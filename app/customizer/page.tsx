"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, ShoppingBag } from "lucide-react";
import { Brand } from "@/components/Brand";
import { GARMENTS } from "@/data/garments";
import { StudioViewport } from "./components/StudioViewport";
import { useCustomizerState } from "@/hooks/useCustomizerState";
import SettingsIconSidebar, {
  type CustomizerTab,
} from "./components/SettingsIconSidebar";
import { StudioSettings } from "./components/StudioSettings";
import CheckoutSummaryPanel from "./components/CheckoutSummaryPanel";
import "./studio.css";

export default function CustomizerPage() {
  const [activeTab, setActiveTab] = useState<CustomizerTab>("colors");
  const [autoRotate, setAutoRotate] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [orderOpen, setOrderOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const orderPanel = useRef<HTMLDivElement>(null);
  const orderButton = useRef<HTMLButtonElement>(null);
  const customizer = useCustomizerState();
  const { state } = customizer;

  const closeSettings = () => {
    setSettingsOpen(false);
    setCollapsed(true);
    document
      .querySelector<HTMLButtonElement>(
        '.studio-tools button[aria-pressed="true"]',
      )
      ?.focus();
  };

  useEffect(() => {
    if (!settingsOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
        setCollapsed(true);
        document
          .querySelector<HTMLButtonElement>(
            '.studio-tools button[aria-pressed="true"]',
          )
          ?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settingsOpen]);

  useEffect(() => {
    if (!orderOpen) return;
    const closeButton =
      orderPanel.current?.querySelector<HTMLButtonElement>("button");
    closeButton?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOrderOpen(false);
        orderButton.current?.focus();
      }
      if (event.key !== "Tab" || !orderPanel.current) return;
      const focusable = Array.from(
        orderPanel.current.querySelectorAll<HTMLElement>("button, input, a"),
      ).filter((element) => element.offsetParent !== null);
      const first = focusable[0],
        last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [orderOpen]);

  const selectTool = (tab: CustomizerTab) => {
    setActiveTab(tab);
    setSettingsOpen(true);
    setCollapsed(false);
  };

  return (
    <div className="design-app">
      <header className="studio-app-header">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Fabrico home">
            <Brand />
          </Link>
          <span className="studio-header-divider">/</span>
          <span className="studio-app-name">Design studio</span>
        </div>
        <div className="studio-save-status">
          <span className="studio-file-name">Your original {GARMENTS[state.garment].name.toLowerCase()}</span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3 w-3" /> Saved to this browser
          </span>
        </div>
        <button
          ref={orderButton}
          type="button"
          onClick={() => setOrderOpen(true)}
          className="studio-review-button"
        >
          <span>Review design</span>
          <ShoppingBag className="h-4 w-4" />
        </button>
      </header>
      <div className="studio-workspace">
        <SettingsIconSidebar activeTab={activeTab} onTabChange={selectTool} />
        {settingsOpen && (
          <button
            type="button"
            className="studio-settings-scrim"
            aria-label="Close design settings"
            onClick={closeSettings}
          />
        )}
        <aside
          id="design-settings"
          aria-labelledby="settings-title"
          className={`studio-settings ${settingsOpen ? "is-mobile-open" : ""} ${collapsed ? "is-collapsed" : ""}`}
        >
          <StudioSettings
            activeTab={activeTab}
            customizer={customizer}
            autoRotate={autoRotate}
            onAutoRotateChange={setAutoRotate}
            onClose={closeSettings}
          />
        </aside>
        <StudioViewport
          ready={customizer.hydrated}
          state={state}
          autoRotate={autoRotate}
          collapsed={collapsed}
          onTogglePanel={() => setCollapsed(!collapsed)}
          onOpenSettings={() => setSettingsOpen(true)}
          onToggleRotation={() => setAutoRotate(!autoRotate)}
        />
        {orderOpen && (
          <div
            className="studio-order-backdrop"
            onClick={() => setOrderOpen(false)}
            aria-hidden="true"
          />
        )}
        <div
          ref={orderPanel}
          className={`studio-order ${orderOpen ? "is-open" : ""}`}
          role={orderOpen ? "dialog" : undefined}
          aria-modal={orderOpen ? true : undefined}
          aria-label="Review your design"
        >
          <CheckoutSummaryPanel
            key={state.garment}
            customizerState={state}
            qty={quantity}
            onQtyChange={setQuantity}
            onClose={() => {
              setOrderOpen(false);
              orderButton.current?.focus();
            }}
          />
        </div>
      </div>
      <div className="studio-app-footer">
        <Link href="/">
          A little more you. <ArrowUpRight className="inline h-3 w-3" />
        </Link>
        <span>FABRICO DESIGN STUDIO</span>
        <span>Made by you.</span>
      </div>
    </div>
  );
}
