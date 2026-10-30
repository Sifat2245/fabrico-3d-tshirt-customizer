"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GARMENT_LIST } from "@/data/garments";
import { studioHref } from "@/lib/studio-presets";

export function StudioCanvases() {
  const reducedMotion = useReducedMotion();
  return (
    <section id="your-canvas" className="scroll-mt-24 py-20 lg:py-28" aria-labelledby="canvases-title">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div data-reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="studio-label mb-5">The lineup / Three personal canvases</p>
            <h2 id="canvases-title" className="section-heading">ONE IDEA.<br />MORE WAYS TO <span className="text-accent">WEAR IT.</span></h2>
          </div>
          <p className="max-w-xs text-sm leading-7 text-[var(--muted)]">Your everyday tee. Your go-to layer. Your finishing touch. Pick a canvas and put a little of yourself into it.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {GARMENT_LIST.map((garment, index) => (
            <motion.article key={garment.id}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.3, delay: reducedMotion ? 0 : index * 0.06 }}
            >
              <Link href={studioHref("original", garment.color, garment.id)} className="canvas-card group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
                <div className={`canvas-card-visual canvas-tone-${garment.tone}`}>
                  <div className="absolute inset-x-6 top-6 z-10 flex items-center justify-between">
                    <span className="studio-label">F / {garment.number}</span>
                    <span className="rounded-full bg-white/65 px-3 py-1 text-[10px]">{garment.id === "tshirt" ? "The original" : "New canvas"}</span>
                  </div>
                  <Image src={garment.poster} alt={`Personalized ${garment.name.toLowerCase()} with MAKE IT YOURS artwork`} width={720} height={840}
                    sizes="(max-width: 767px) 90vw, 30vw" className="canvas-product-image h-full w-full object-contain p-4" />
                  <span className="canvas-card-action" aria-hidden="true"><ArrowUpRight className="h-5 w-5" /></span>
                </div>
                <div className="flex justify-between gap-4 pt-5">
                  <div><h3 className="text-xl font-medium">The {garment.name.toLowerCase()}.</h3><p className="mt-2 text-xs text-[var(--muted)]">{garment.detail}</p></div>
                  <span className="studio-label pt-1 text-[var(--muted)]">Make it yours</span>
                </div>
                <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--muted)]">{garment.description}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
