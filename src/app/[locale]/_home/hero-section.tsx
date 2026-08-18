"use client";

// HeroSection — above-the-fold client component. Uses CSS animations instead of
// framer-motion to keep the library out of the critical JS bundle.
// Single-column, offer-first layout (no personal photo/name): headline states the
// outcome, a tech marquee below provides trust instead of a portrait.
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
import { Container } from "@/components/layout/container";
import { TechnologiesMarquee } from "@/components/technologies-marquee";

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
    <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 overflow-hidden">
      <Container className="relative z-10 w-full px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
          {/* Subtitle badge */}
          <p className="animate-fade-in-up text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground/70">
            {t("home.hero.subtitle")}
          </p>

          {/* Main title — outcome-first, no personal name */}
          <h1 className="animate-fade-in-up-delay-1 font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-foreground font-black">
            {t.rich("home.hero.title", {
              highlight: (chunks) => (
                <span className="bg-linear-to-r from-accent via-[#8a7bff] to-accent bg-size-[200%_200%] bg-clip-text text-transparent">
                  {chunks}
                </span>
              ),
            })}
          </h1>

          {/* Description */}
          <p className="animate-fade-in-up-delay-2 text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {t("home.hero.description")}
          </p>

          {/* Rotating tech/capability phrases */}
          <div
            className="animate-fade-in-up-delay-3 mt-3 md:mt-4"
            role="status" aria-live="polite" aria-atomic="true"
          >
            <span
              key={phraseIndex}
              className={`inline-block bg-linear-to-r from-accent via-[#8a7bff] to-accent bg-size-[200%_200%] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(138,123,255,0.3)] md:drop-shadow-[0_0_30px_rgba(138,123,255,0.3)] font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl ${isAnimating ? "hero-phrase-exit" : "hero-phrase-enter"}`}
            >
              {activePhrase}
            </span>
          </div>

          {/* CTA buttons */}
          <div className="animate-fade-in-up-delay-4 flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 justify-center">
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

          {/* Social links — kept as trust/contact signal, not personal branding */}
          <div className="animate-fade-in-up-delay-5 flex items-center justify-center gap-3 pt-1">
            <a
              href="https://www.linkedin.com/in/sayan-roor/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/satoshi_iam"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://t.me/satoshi_iam"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
              aria-label="Telegram"
            >
              <Send className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/SayanRoor"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Container>

      {/* Tech-stack proof strip — replaces the old portrait as the trust signal */}
      <div className="animate-fade-in-up-delay-5 mt-12 md:mt-16">
        <TechnologiesMarquee />
      </div>
    </section>
  );
}
