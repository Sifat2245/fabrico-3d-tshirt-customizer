import type { Metadata } from "next";
import { Asterisk, ArrowUpRight, Layers2, Palette, Scan } from "lucide-react";
import Link from "next/link";
import { StudioPreview } from "@/components/StudioPreview";
import { LandingMotion } from "../components/LandingMotion";
import { StudioInvitation } from "../components/StudioInvitation";

export const metadata: Metadata = {
  title: "Our studio",
  description:
    "Fabrico is a space to turn your ideas into something you can wear. Meet your new T-shirt design studio.",
};

export default function AboutPage() {
  return (
    <LandingMotion>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <p data-hero-reveal className="studio-label">
          Our studio / Your imagination
        </p>
        <h1 data-hero-reveal className="collection-title">
          STYLE SHOULDN’T
          <br />
          COME <span className="text-accent">PREDEFINED.</span>
        </h1>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div data-reveal className="about-art">
            <span className="about-art-word" aria-hidden="true">
              ORIGINAL.
            </span>
            <div className="about-model">
              <StudioPreview color="#e9e8df" template="club" rotation={0.25} />
            </div>
            <Asterisk
              className="absolute right-6 top-6 h-8 w-8 text-accent"
              strokeWidth={1}
            />
          </div>
          <div data-reveal className="lg:px-8">
            <p className="studio-label mb-5 text-accent">A little more you</p>
            <h2 className="section-heading">
              LESS OFF THE RACK.
              <br />
              MORE OFF THE TOP
              <br />
              OF YOUR HEAD.
            </h2>
            <p className="mt-7 text-sm leading-8 text-[var(--muted)]">
              That sketch in your notes. The words you keep coming back to. An
              idea for your team. We believe those things deserve to exist
              beyond your screen.
            </p>
            <p className="mt-4 text-sm leading-8 text-[var(--muted)]">
              Fabrico puts a T-shirt design studio in your hands. Start with a
              color, add your own mark, and see it take shape in 3D. Every
              detail is yours to decide.
            </p>
            <Link href="/customizer" className="text-link mt-8">
              Find your canvas <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="py-24" data-reveal>
          <p className="studio-label mb-7">Our point of view</p>
          <p className="about-manifesto">
            THE BEST DESIGN TOOL DOESN’T TELL YOU WHAT TO MAKE.{" "}
            <span className="text-accent">
              IT HELPS YOU MAKE WHAT’S ALREADY IN YOUR HEAD.
            </span>
          </p>
        </div>
        <div className="grid gap-10 pb-12 sm:grid-cols-3">
          {[
            {
              Icon: Palette,
              title: "Your creative freedom.",
              text: "Colors, patterns, type, and artwork. Room to experiment, without a rulebook.",
            },
            {
              Icon: Scan,
              title: "A clearer picture.",
              text: "A real garment in 3D. See your idea from every angle before you make it yours.",
            },
            {
              Icon: Layers2,
              title: "Every detail matters.",
              text: "Front to back, layer by layer. Keep refining until it feels unmistakably you.",
            },
          ].map(({ Icon, title, text }) => (
            <article
              key={title}
              data-reveal
              className="border-t border-[var(--line)] pt-6"
            >
              <Icon className="mb-6 h-6 w-6 text-accent" strokeWidth={1.4} />
              <h3 className="text-xl font-medium tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>
      <StudioInvitation />
    </LandingMotion>
  );
}
