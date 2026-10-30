"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  MoveUpRight,
  RotateCcw,
} from "lucide-react";
import { StudioPreview } from "@/components/StudioPreview";
import { STUDIO_COLORS } from "@/data/studio";
import { studioHref } from "@/lib/studio-presets";
import { GARMENT_LIST, GARMENTS, type GarmentId } from "@/data/garments";

export function StudioHero() {
  const [colorIndex, setColorIndex] = useState(0);
  const [artwork, setArtwork] = useState(true);
  const [rotation, setRotation] = useState(-0.3);
  const [garmentId, setGarmentId] = useState<GarmentId>("tshirt");
  const garment = GARMENTS[garmentId];
  const color = STUDIO_COLORS[colorIndex];

  return (
    <section className="studio-hero" aria-labelledby="hero-title">
      <div className="hero-watermark" aria-hidden="true">
        YOUR CANVAS.
      </div>
      <div className="hero-layout mx-auto max-w-7xl px-6 lg:px-8">
        <div className="hero-copy">
          <p data-hero-reveal className="studio-label flex items-center gap-2">
            <span className="status-dot" /> Your 3D apparel design studio
          </p>
          <h1 id="hero-title" className="hero-heading">
            <span data-hero-reveal>DON’T JUST</span>
            <span data-hero-reveal>WEAR IT.</span>
            <span data-hero-reveal className="text-accent">
              MAKE IT.
            </span>
          </h1>
          <div data-hero-reveal className="mb-5 flex gap-2" role="group" aria-label="Choose a garment to preview">
            {GARMENT_LIST.map((item) => (
              <button key={item.id} type="button" aria-pressed={item.id === garmentId}
                onClick={() => { setGarmentId(item.id); setRotation(-0.3); }}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${item.id === garmentId ? "bg-[#26322a] text-white" : "bg-[#e5e8df] text-[#59615a] hover:bg-[#dbe0d6]"}`}
              >{item.name}</button>
            ))}
          </div>
          <p data-hero-reveal className="hero-description">
            T-shirts. Hoodies. Caps. A head full of ideas.
            <br />
            Turn your colors, words, and artwork into something you can actually
            wear.
          </p>
          <div data-hero-reveal className="flex flex-wrap items-center gap-5">
            <Link
              href={studioHref(artwork ? "original" : "blank", color.hex, garmentId)}
              className="studio-button studio-button-blue"
            >
              Design your {garment.name.toLowerCase()} <ArrowUpRight className="h-5 w-5" />
            </Link>
            <a href="#how-it-works" className="hero-secondary-link">
              See how it works <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div data-hero-reveal className="hero-footnote">
            <span className="flex -space-x-2" aria-hidden="true">
              <span className="creator-dot">a</span>
              <span className="creator-dot">m</span>
              <span className="creator-dot">y</span>
            </span>
            <span>
              For the “I made this” feeling.
              <br />
              <strong>No design experience needed.</strong>
            </span>
          </div>
        </div>

        <div className="hero-stage">
          <div className="hero-stage-label studio-label">
            <span className="crosshair">+</span> YOUR IDEA, IN REAL TIME
          </div>
          <div className="hero-orbit" aria-hidden="true" />
          <span className="hero-coordinate studio-label" aria-hidden="true">
            F / 0{garment.number}
          </span>
          <div className="hero-model">
            <StudioPreview
              garment={garmentId}
              color={color.hex}
              showArtwork={artwork}
              rotation={rotation}
            />
          </div>
          <div className="hero-model-shadow" aria-hidden="true" />
          <div className="hero-artwork-note">
            <MoveUpRight className="h-7 w-7" strokeWidth={1} />
            <span>Your art goes here.</span>
          </div>
          <button
            type="button"
            className="hero-rotate"
            aria-label={`Rotate ${garment.name.toLowerCase()} to the other side`}
            onClick={() => setRotation((value) => value + Math.PI)}
          >
            <RotateCcw className="h-4 w-4" />
            <span>See every side</span>
          </button>
          <div className="hero-color-card">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="studio-label">Make it your color</span>
              <span className="text-xs text-[var(--muted)]" aria-live="polite">
                {color.name}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div
                className="flex gap-2"
                role="group"
                aria-label={`Preview ${garment.name.toLowerCase()} color`}
              >
                {STUDIO_COLORS.map((swatch, index) => (
                  <button
                    key={swatch.id}
                    type="button"
                    aria-label={swatch.name}
                    aria-pressed={colorIndex === index}
                    className={`color-swatch ${swatch.className} ${colorIndex === index ? "is-selected" : ""}`}
                    onClick={() => setColorIndex(index)}
                  >
                    {colorIndex === index && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
              <span className="text-[var(--line)]">/</span>
              <button
                type="button"
                className="artwork-toggle"
                aria-pressed={artwork}
                onClick={() => setArtwork(!artwork)}
              >
                {artwork ? "With artwork" : "Keep it blank"}
                <span
                  className={artwork ? "toggle-track is-on" : "toggle-track"}
                />
              </button>
            </div>
          </div>
          <p className="hero-drag-hint studio-label">
            Drag the {garment.name.toLowerCase()}. Try a color. Make it yours.
          </p>
        </div>
      </div>
      <div className="hero-bottom mx-auto max-w-7xl px-6 lg:px-8">
        <a href="#how-it-works" className="flex items-center gap-3">
          <ArrowDown className="h-4 w-4" /> A LITTLE SCROLL. A LOT OF
          POSSIBILITIES.
        </a>
        <span>
          DESIGNED BY YOU. <span className="text-accent">WORN BY YOU.</span>
        </span>
      </div>
    </section>
  );
}
