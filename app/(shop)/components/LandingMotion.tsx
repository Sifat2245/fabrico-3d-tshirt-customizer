"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.from("[data-hero-reveal]", {
          y: 38,
          opacity: 0,
          duration: 0.3,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "all",
        });
        if (root.current?.querySelector(".hero-stage")) {
          gsap.from(".hero-stage", {
            scale: 0.92,
            opacity: 0,
            duration: 0.3,
            delay: 0.12,
            ease: "power2.out",
            clearProps: "all",
          });
          gsap.to(".hero-orbit", {
            rotation: 24,
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: ".studio-hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.to(".hero-watermark", {
            xPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: ".studio-hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            y: 28,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
            clearProps: "all",
          });
        });
        if (root.current?.querySelector(".invitation-asterisk")) {
          gsap.fromTo(
            ".invitation-asterisk",
            { rotation: -35 },
            {
              rotation: 35,
              ease: "none",
              scrollTrigger: {
                trigger: ".studio-invitation",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return <div ref={root}>{children}</div>;
}
