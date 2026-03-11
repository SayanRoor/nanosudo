"use client";

// HeroSection — above-the-fold client component. Uses CSS animations instead of
// framer-motion to keep the library out of the critical JS bundle.
import type { ReactElement } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Linkedin,
  Instagram,
  Github,
  Send,
} from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/layout/container";

const PHRASE_COUNT = 3;
const PHRASE_INTERVAL = 2500;

export function HeroSection(): ReactElement {
  const t = useTranslations();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPhraseRef = useRef<string>("");

  const rotatePhrase = useCallback((): void => {
    setIsAnimating(true);
    // After exit animation (400ms), switch phrase and play enter animation
    setTimeout(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASE_COUNT);
      setIsAnimating(false);
    }, 400);
  }, []);

  useEffect((): (() => void) => {
    const intervalId = window.setInterval(rotatePhrase, PHRASE_INTERVAL);
    return (): void => window.clearInterval(intervalId);
  }, [rotatePhrase]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activePhrase = t(`home.hero.rotatingPhrases.${phraseIndex}` as any);
  prevPhraseRef.current = activePhrase;

  return (
    <section className="relative pt-28 md:pt-32 pb-16 md:pb-24 lg:pb-32 overflow-hidden flex items-center">
      <Container className="relative z-10 w-full px-4 md:px-6">
        {/* Two-column grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* LEFT COLUMN - Content only */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left order-1 lg:order-1">
            {/* Subtitle badge */}
            <p className="animate-fade-in-up text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground/70">
              {t("home.hero.subtitle")}
            </p>

            {/* Main title with highlighted name */}
            <h1 className="animate-fade-in-up-delay-1 font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight">
              <span className="block text-foreground font-black">
                {t("home.hero.mainTitle").split("Sayan").map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}><span className="bg-linear-to-r from-accent via-[#8a7bff] to-accent bg-size-[200%_200%] bg-clip-text text-transparent">Sayan</span></span>
                  ) : part
                )}
              </span>
            </h1>

            {/* Description after main title */}
            <p className="animate-fade-in-up-delay-2 text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t("home.hero.description")}
            </p>

            {/* Rotating phrases */}
            <div
              className="animate-fade-in-up-delay-3 mt-3 md:mt-4"
              role="status" aria-live="polite" aria-atomic="true"
            >
              <span
                key={phraseIndex}
                className={`inline-block bg-linear-to-r from-accent via-[#8a7bff] to-accent bg-size-[200%_200%] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(138,123,255,0.3)] md:drop-shadow-[0_0_30px_rgba(138,123,255,0.3)] font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${isAnimating ? "hero-phrase-exit" : "hero-phrase-enter"}`}
              >
                {activePhrase}
              </span>
            </div>

            {/* CTA Buttons - shown on desktop */}
            <div className="animate-fade-in-up-delay-4 hidden lg:flex flex-row gap-3 md:gap-4 pt-2 md:pt-4 justify-center lg:justify-start">
              <Link
                href="/brief"
                prefetch
                className="group relative inline-flex items-center justify-center"
              >
                <div className="px-8 md:px-10 py-4 md:py-5 rounded-full bg-accent text-black font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-[11px] transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-accent/40 active:scale-95 flex items-center gap-2">
                  {t("common.cta.cost")}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </div>
              </Link>
              <a
                href="#process"
                className="inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 rounded-full border-2 border-border/80 font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-[11px] text-foreground transition-all duration-300 hover:border-accent hover:text-accent hover:bg-accent/5 active:scale-95"
              >
                {t("common.cta.howIWork")}
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN - Photo & Social */}
          <div className="animate-fade-in-right relative w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:mx-0 lg:ml-auto space-y-4 md:space-y-6 mt-8 lg:mt-0 order-2 lg:order-2">
            {/* Photo — glass card */}
            <div className="glass-card rounded-4xl md:rounded-[2.5rem] p-4 md:p-6 lg:p-8 border-border/40 overflow-hidden relative group">
              <div className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 w-32 h-32 md:w-48 md:h-48 bg-accent/10 blur-[60px] md:blur-[80px] rounded-full" />
              <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-linear-to-br from-accent/20 to-accent/5">
                <Image
                  src="/Roor_Sayan_Web_Developer.jpg"
                  alt={t("home.hero.imageAlt")}
                  fill
                  className="object-cover"
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <a
                href="https://www.linkedin.com/in/sayan-roor/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="https://instagram.com/satoshi_iam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="https://t.me/satoshi_iam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="https://github.com/SayanRoor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>

            {/* CTA Buttons - shown after photo on mobile, hidden on desktop */}
            <div className="animate-fade-in-up-delay-4 flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 justify-center lg:hidden">
              <Link
                href="/brief"
                prefetch
                className="group relative inline-flex items-center justify-center"
              >
                <div className="px-8 md:px-10 py-4 md:py-5 rounded-full bg-accent text-black font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-[11px] transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-accent/40 active:scale-95 flex items-center gap-2">
                  {t("common.cta.cost")}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </div>
              </Link>
              <a
                href="#process"
                className="inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 rounded-full border-2 border-border/80 font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-[11px] text-foreground transition-all duration-300 hover:border-accent hover:text-accent hover:bg-accent/5 active:scale-95"
              >
                {t("common.cta.howIWork")}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
