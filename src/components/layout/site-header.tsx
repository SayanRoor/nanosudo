"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { useTranslations } from 'next-intl';
import { ArrowUpRight, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/routing";

const NAV_LINKS: Array<{ readonly href: string; readonly labelKey: string }> = [
  { href: "/", labelKey: "common.nav.home" },
  { href: "/services", labelKey: "common.nav.services" },
  { href: "/cases", labelKey: "common.nav.cases" },
  { href: "/blog", labelKey: "common.nav.blog" },
  { href: "/about", labelKey: "common.nav.about" },
];

const BRIEF_ROUTE = "/brief";

export function SiteHeader(): ReactElement {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = (): void => {
      const current = window.scrollY;
      const previous = lastScrollY.current;
      if (current > previous && current > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setIsScrolled(current > 20);
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return (): void => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return (): void => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const toggleMenu = (): void => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-10",
          isScrolled ? "py-4" : "py-8",
          (isVisible || isMenuOpen) ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className={cn(
          "mx-auto w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
          isScrolled
            ? "max-w-6xl rounded-[2.5rem] glass-card border-accent/20 shadow-2xl shadow-accent/5 backdrop-blur-xl"
            : "max-w-7xl rounded-none bg-transparent border-transparent"
        )}>
          <div className="flex items-center justify-between gap-6 h-16 md:h-20 px-6 md:px-10">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group relative h-full shrink-0"
            >
              <div className="relative z-10 flex items-center gap-2">
                <span className="font-heading text-xl md:text-2xl font-black text-foreground group-hover:text-accent transition-colors duration-300">
                  NANOSUDO<span className="text-accent group-hover:scale-125 inline-block transition-transform duration-300">.</span>
                </span>
              </div>
              <div className="absolute -inset-x-6 -inset-y-3 bg-accent/10 scale-0 group-hover:scale-100 rounded-2xl transition-transform duration-500 -z-10 blur-2xl" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-5 py-2 group overflow-hidden"
                >
                  <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {t(link.labelKey)}
                  </span>
                  <div className="absolute inset-0 bg-muted/30 opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300 scale-90 group-hover:scale-100" />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent group-hover:w-1/2 transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden sm:flex items-center gap-1.5 p-1 bg-muted/20 rounded-2xl border border-border/40">
                <LanguageSwitcher />
                <div className="w-px h-4 bg-border/40" />
                <ThemeToggle />
              </div>

              <Link
                href={BRIEF_ROUTE}
                className="group relative hidden lg:inline-flex items-center justify-center rounded-2xl bg-foreground px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-background transition-all duration-500 hover:bg-accent hover:text-black hover:shadow-lg hover:shadow-accent/30 overflow-hidden active:scale-95"
              >
                <span className="relative z-10">{t('common.cta.submitRequest')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={toggleMenu}
                className="lg:hidden relative group inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-muted/20 border border-border hover:border-accent/50 transition-all shadow-soft overflow-hidden"
                aria-label="Menu"
              >
                <div className="relative w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                  <span className={cn(
                    "block w-6 h-0.5 bg-foreground transition-all duration-300",
                    isMenuOpen ? "rotate-45 translate-y-1" : ""
                  )} />
                  <span className={cn(
                    "block w-6 h-0.5 bg-foreground transition-all duration-300",
                    isMenuOpen ? "opacity-0" : ""
                  )} />
                  <span className={cn(
                    "block w-6 h-0.5 bg-foreground transition-all duration-300",
                    isMenuOpen ? "-rotate-45 -translate-y-1" : ""
                  )} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-110 lg:hidden transition-all duration-300",
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-background/98 backdrop-blur-2xl transition-opacity duration-300",
            isMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMenuOpen(false)}
        />
        {/* Menu content */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col h-full overflow-y-auto no-scrollbar pt-32 pb-12 px-8 transition-all duration-300",
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 p-3 rounded-2xl bg-muted/20 border border-border/50 text-foreground hover:text-accent transition-all duration-300 backdrop-blur-md z-120"
            aria-label="Close menu"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 blur-[120px] rounded-full -z-10" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 blur-[120px] rounded-full -z-10" />

          <div className="flex-1 flex flex-col justify-between min-h-fit">
            <nav className="flex flex-col gap-6 relative z-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center group py-2"
                >
                  <span className="text-5xl md:text-6xl font-heading font-black text-foreground group-hover:text-accent transition-all duration-300 uppercase tracking-tighter">
                    {t(link.labelKey)}
                  </span>
                  <ArrowUpRight className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-4 text-accent" />
                </Link>
              ))}
            </nav>

            <div className="pt-16 flex flex-col gap-10 relative z-10 w-full mt-auto">
              <div className="flex items-center justify-between border-t border-border/50 pt-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">System</span>
                <div className="flex gap-4">
                  <LanguageSwitcher />
                  <div className="w-px h-6 bg-border/40" />
                  <ThemeToggle />
                </div>
              </div>

              <Link
                href={BRIEF_ROUTE}
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center rounded-4xl bg-accent py-8 text-sm font-black uppercase tracking-[0.3em] text-black shadow-2xl shadow-accent/40 active:scale-95 transition-transform"
              >
                {t('common.cta.submitRequest')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
