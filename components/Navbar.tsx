"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { Brand } from "./Brand";
import { useCart } from "@/lib/cart-context";

const LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/templates", label: "The collection" },
  { href: "/about", label: "Our studio" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const { totalItems, openSidebar } = useCart();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (event.key !== "Tab" || !panel.current) return;
      const links = panel.current.querySelectorAll<HTMLAnchorElement>("a");
      const first = links[0],
        last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        menuButton.current?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        menuButton.current?.focus();
      } else if (document.activeElement === menuButton.current) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="site-header">
      <nav
        className="mx-auto flex h-22 max-w-7xl items-center justify-between gap-6 px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="shrink-0 transition-opacity hover:opacity-70"
        >
          <Brand />
        </Link>
        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="nav-link"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 sm:gap-5">
          {totalItems > 0 && (
            <button
              type="button"
              onClick={openSidebar}
              className="relative rounded-full p-2"
              aria-label={`Open bag, ${totalItems} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="cart-count">{totalItems}</span>
            </button>
          )}
          <Link
            href="/customizer"
            className="studio-button studio-button-dark nav-cta"
          >
            Open studio <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="rounded-full p-2 lg:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      {open && (
        <div
          ref={panel}
          id="mobile-navigation"
          className="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <span className="studio-label">A little direction</span>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
              <ArrowUpRight className="h-6 w-6" />
            </Link>
          ))}
          <Link href="/customizer" onClick={() => setOpen(false)}>
            Start creating
            <ArrowUpRight className="h-6 w-6" />
          </Link>
          <p>Your ideas look good on you.</p>
        </div>
      )}
    </header>
  );
}
