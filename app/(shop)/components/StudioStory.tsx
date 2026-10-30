"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Check,
  Layers2,
  MousePointer2,
  Type,
} from "lucide-react";
import Link from "next/link";
import { StudioPreview } from "@/components/StudioPreview";

const STEPS = [
  {
    title: "Start with your shade.",
    description:
      "T-shirt, hoodie, or cap. Pick your canvas, find your shade, and watch it change in real time.",
    note: "Your colors. Your starting point.",
    color: "#929e83",
  },
  {
    title: "Put yourself into it.",
    description:
      "Your favorite words, your own artwork, your team’s identity. Add text, upload an image, and place every detail.",
    note: "A little type. A lot of personality.",
    color: "#2855f5",
  },
  {
    title: "See it from every side.",
    description:
      "Turn it around. Get close. Make the front and back feel like you, then choose your size and make it real.",
    note: "No guesswork. Just your vision.",
    color: "#e9e8df",
  },
] as const;

export function StudioStory() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>(".story-step")
        .forEach((element, index) => {
          ScrollTrigger.create({
            trigger: element,
            start: "top 60%",
            end: "bottom 60%",
            onEnter: () => setActive(index),
            onEnterBack: () => setActive(index),
          });
        });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section
      ref={root}
      id="how-it-works"
      className="studio-story scroll-mt-24"
      aria-labelledby="story-title"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div data-reveal className="story-heading">
          <p className="studio-label">Less complicated. More creative.</p>
          <h2 id="story-title" className="section-heading">
            FROM “WHAT IF”
            <br />
            TO <span className="text-accent">“THAT’S ME.”</span>
          </h2>
          <p>
            You bring the idea.
            <br />
            We give you the space to make it happen.
          </p>
        </div>
        <div className="story-layout">
          <div className={`story-visual story-tone-${active}`}>
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="studio-label">Your workspace</span>
              <span className="flex items-center gap-2 text-xs">
                <span className="status-dot" /> Live preview
              </span>
            </div>
            <div className="story-model">
              <StudioPreview
                color={STEPS[active].color}
                template={active === 2 ? "club" : "original"}
                showArtwork={active > 0}
                story
                interactive={false}
              />
            </div>
            <div className="story-layer">
              <span className="story-layer-icon">
                {active === 0 ? (
                  <Layers2 className="h-4 w-4" />
                ) : active === 1 ? (
                  <Type className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </span>
              <div>
                <strong>
                  {active === 0
                    ? "Base color"
                    : active === 1
                      ? "Your artwork"
                      : "Looking like you"}
                </strong>
                <span>{STEPS[active].note}</span>
              </div>
              <Check className="ml-4 h-4 w-4 text-accent" />
            </div>
            <span className="story-cursor">
              <MousePointer2 className="h-5 w-5 fill-current" />
              <span>You, the designer</span>
            </span>
            <div
              className="story-progress"
              aria-label={`Step ${active + 1} of 3`}
            >
              {STEPS.map((_, i) => (
                <span key={i} className={i <= active ? "is-active" : ""} />
              ))}
            </div>
          </div>
          <div className="story-steps">
            {STEPS.map((step, index) => (
              <article
                key={step.title}
                className={`story-step ${active === index ? "is-active" : ""}`}
              >
                <span className="story-step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index === 2 && (
                  <Link href="/customizer" className="text-link mt-7">
                    Let’s make yours <ArrowUpRight className="h-5 w-5" />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
