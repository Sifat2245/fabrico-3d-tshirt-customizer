import Link from "next/link";
import { ArrowUpRight, Asterisk } from "lucide-react";
import { Brand } from "./Brand";

export function Footer() {
  return (
    <footer className="studio-footer" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 py-12 sm:flex-row sm:items-start">
          <div>
            <Link href="/">
              <Brand />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/55">
              A space for your ideas.
              <br />A T-shirt that could only be yours.
            </p>
          </div>
          <div className="flex gap-12 text-sm sm:gap-20">
            <div className="flex flex-col gap-3">
              <span className="studio-label text-white/40">Explore</span>
              <Link href="/customizer">Design studio</Link>
              <Link href="/templates">The collection</Link>
              <Link href="/about">Our studio</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="studio-label text-white/40">Your space</span>
              <Link href="/cart">Your bag</Link>
              <Link href="/auth/login">
                Sign in <ArrowUpRight className="inline h-3 w-3" />
              </Link>
              <Link href="/#questions">Questions</Link>
            </div>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          MADE BY YOU
          <Asterisk />
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/15 py-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Fabrico. Make something personal.</p>
          <p>From a blank canvas to your favorite T-shirt.</p>
        </div>
      </div>
    </footer>
  );
}
