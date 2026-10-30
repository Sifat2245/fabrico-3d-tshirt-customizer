"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Fingerprint, Users, Sparkles } from "lucide-react";
import { studioHref } from "@/lib/studio-presets";

const IDEAS = [
  { icon: Fingerprint, title: "For your everyday.", text: "A favorite phrase. A signature shade. Something that feels like you." },
  { icon: Users, title: "For your people.", text: "Your club, your crew, your shared story. Give it something to wear." },
  { icon: Sparkles, title: "For your next idea.", text: "The sketch in your notebook deserves a life beyond the page." },
];

export function StudioSignature() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const hoodieY = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const capY = useTransform(scrollYProgress, [0, 1], [-25, 40]);
  const capRotation = useTransform(scrollYProgress, [0, 1], [-8, 4]);

  return (
    <section ref={root} className="studio-signature overflow-hidden py-20 lg:py-28" aria-labelledby="signature-title">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="signature-composition" aria-label="A matching personalized hoodie and cap">
          <span className="signature-ring" aria-hidden="true" />
          <span className="studio-label absolute left-6 top-6">An idea looks good on you.</span>
          <motion.div className="signature-hoodie" style={reducedMotion ? undefined : { y: hoodieY }}>
            <Image src="/images/studio/hoodie-studio.png" alt="Sage hoodie with your own typography" width={720} height={840} sizes="(max-width: 1023px) 85vw, 42vw" className="h-full w-full object-contain" />
          </motion.div>
          <motion.div className="signature-cap" style={reducedMotion ? undefined : { y: capY, rotate: capRotation }}>
            <Image src="/images/studio/cap-studio.png" alt="Chalk cap with matching typography" width={720} height={840} sizes="(max-width: 1023px) 50vw, 25vw" className="h-full w-full object-contain" />
          </motion.div>
          <span className="signature-note">Same idea.<br />A whole new feeling.</span>
          <span className="studio-label absolute bottom-6 left-6">YOUR WORLD. YOUR WARDROBE.</span>
        </div>
        <div>
          <div data-reveal>
            <p className="studio-label mb-5">More than a one-off</p>
            <h2 id="signature-title" className="section-heading">SAME YOU.<br /><span className="text-accent">EVERY LAYER.</span></h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[var(--muted)]">Take your signature from your tee to your hoodie to your cap. Explore each canvas and make a little collection that belongs together.</p>
          </div>
          <div className="my-8 space-y-6">
            {IDEAS.map(({ icon: Icon, title, text }) => (
              <div key={title} data-reveal className="flex gap-4">
                <Icon className="mt-1 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
                <div><h3 className="text-sm font-medium">{title}</h3><p className="mt-1 max-w-sm text-xs leading-6 text-[var(--muted)]">{text}</p></div>
              </div>
            ))}
          </div>
          <Link href={studioHref("original", "#929e83", "hoodie")} className="text-link">Make your next layer <ArrowUpRight className="h-5 w-5" /></Link>
        </div>
      </div>
    </section>
  );
}
