import Link from "next/link";
import { ArrowUpRight, Asterisk } from "lucide-react";

export function StudioInvitation() {
  return (
    <section className="studio-invitation" aria-labelledby="invitation-title">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <Asterisk
          className="invitation-asterisk"
          aria-hidden="true"
          strokeWidth={1}
        />
        <div className="relative z-10" data-reveal>
          <p className="studio-label mb-6">
            The best thing you’ll wear? Your own idea.
          </p>
          <h2 id="invitation-title">
            YOUR NEXT
            <br />
            FAVORITE THING.
            <br />
            <span>BY YOU.</span>
          </h2>
          <Link
            href="/customizer"
            className="studio-button studio-button-light mt-9"
          >
            Let’s make something <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
        <span className="invitation-note">
          One of a kind.
          <br />
          Just like you.
        </span>
      </div>
    </section>
  );
}
