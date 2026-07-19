"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Work" },
  { href: "/#patricians", label: "Patricians" },
  { href: "/#resume", label: "Resume" },
  { href: "/#contact", label: "Contact" },
];

export function PortfolioNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[70] flex justify-center px-4 pt-5"
      aria-label="Portfolio navigation"
    >
      <div
        className="relative transition-all duration-500"
        style={{
          background: scrolled || mobileOpen ? "rgba(7,7,18,0.86)" : "transparent",
          backdropFilter: scrolled || mobileOpen ? "blur(20px) saturate(180%)" : "none",
          border:
            scrolled || mobileOpen
              ? "1px solid rgba(255,255,255,0.07)"
              : "1px solid transparent",
          borderRadius: "9999px",
          padding: "10px 20px",
          boxShadow: scrolled || mobileOpen ? "0 8px 40px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div className="flex items-center gap-8">
          <Link
            href="/#home"
            className="block transition-opacity duration-200 hover:opacity-90"
            aria-label="Shayan Batoaq home"
          >
            <Image
              src="/assets/shayan-batoaq-logo.png"
              alt="Shayan Batoaq"
              width={1597}
              height={256}
              className="h-auto w-36 sm:w-40"
              priority
              draggable={false}
            />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/40 transition-colors duration-300 hover:text-white/85"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="text-white/40 transition-colors hover:text-white/80 md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="portfolio-mobile-navigation"
          >
            {mobileOpen ? (
              <X size={16} aria-hidden="true" />
            ) : (
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                <rect y="0" width="16" height="1.5" rx="1" fill="currentColor" />
                <rect y="5.25" width="10" height="1.5" rx="1" fill="currentColor" />
                <rect y="10.5" width="16" height="1.5" rx="1" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen && (
          <div
            id="portfolio-mobile-navigation"
            className="absolute left-0 right-0 top-full mt-2 flex flex-col gap-4 rounded-2xl border border-white/[0.08] px-6 py-4 md:hidden"
            style={{ background: "rgba(7,7,18,0.96)", backdropFilter: "blur(20px)" }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-white/50 transition-colors hover:text-white/90"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
