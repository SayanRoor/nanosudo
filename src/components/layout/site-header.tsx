"use client";

import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/routing";
import { Container } from "./container";

const NAV_LINKS: Array<{ readonly href: string; readonly labelKey: string }> = [
  { href: "/", labelKey: "common.nav.home" },
  { href: "/cases", labelKey: "common.nav.cases" },
  { href: "/about", labelKey: "common.nav.about" },
  { href: "/blog", labelKey: "common.nav.blog" },
  { href: "/contact", labelKey: "common.nav.contact" },
];

const BRIEF_ROUTE = "/brief";

function AnimatedLogoText(): ReactElement {
  return (
    <span className="inline-block font-heading text-xl tracking-tighter normal-case font-bold">
      NANOSUDO<span className="text-accent">.</span>
    </span>
  );
}

export function SiteHeader(): ReactElement {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: (isVisible || isMenuOpen) ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-10",
          isScrolled ? "py-4" : "py-8"
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
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[110] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-background/98 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="absolute inset-0 flex flex-col h-full overflow-y-auto no-scrollbar pt-32 pb-12 px-8"
            >
              {/* Close Button Inside Menu */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-8 right-8 p-3 rounded-2xl bg-muted/20 border border-border/50 text-foreground hover:text-accent transition-all duration-300 backdrop-blur-md z-[120]"
                aria-label="Close menu"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 blur-[120px] rounded-full -z-10" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 blur-[120px] rounded-full -z-10" />

              <div className="flex-1 flex flex-col justify-between min-h-fit">
                <nav className="flex flex-col gap-6 relative z-10">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center group py-2"
                      >
                        <span className="text-5xl md:text-6xl font-heading font-black text-foreground group-hover:text-accent transition-all duration-300 uppercase tracking-tighter">
                          {t(link.labelKey)}
                        </span>
                        <ArrowUpRight className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-4 text-accent" />
                      </Link>
                    </motion.div>
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
                    className="w-full flex items-center justify-center rounded-[2rem] bg-accent py-8 text-sm font-black uppercase tracking-[0.3em] text-black shadow-2xl shadow-accent/40 active:scale-95 transition-transform"
                  >
                    {t('common.cta.submitRequest')}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
