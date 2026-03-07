"use client";

// HeroSection — above-the-fold client component for the home page.
import type { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
import { fadeInUp, staggerContainer } from "./animations";

export function HeroSection(): ReactElement {
  const t = useTranslations();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const PHRASE_COUNT = 3;

  useEffect((): (() => void) => {
    const intervalId = window.setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASE_COUNT);
    }, 2500);

    return (): void => window.clearInterval(intervalId);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activePhrase = t(`home.hero.rotatingPhrases.${phraseIndex}` as any);

  return (
    <section className="relative pt-28 md:pt-32 pb-16 md:pb-24 lg:pb-32 overflow-hidden flex items-center">
      <Container className="relative z-10 w-full px-4 md:px-6">
        {/* Two-column grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* LEFT COLUMN - Content only */}
          <motion.div
            className="space-y-6 md:space-y-8 text-center lg:text-left order-1 lg:order-1"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Subtitle badge */}
            <motion.p
              className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground/70"
              variants={fadeInUp}
            >
              {t("home.hero.subtitle")}
            </motion.p>

            {/* Main title with highlighted name */}
            <motion.h1
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight"
              variants={fadeInUp}
            >
              <span className="block text-foreground font-black">
                {t("home.hero.mainTitle").split("Sayan").map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}><span className="bg-linear-to-r from-accent via-[#8a7bff] to-accent bg-size-[200%_200%] bg-clip-text text-transparent">Sayan</span></span>
                  ) : part
                )}
              </span>
            </motion.h1>

            {/* Description after main title */}
            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
              variants={fadeInUp}
            >
              {t("home.hero.description")}
            </motion.p>

            {/* Rotating phrases */}
            <motion.div
              className="mt-3 md:mt-4"
              variants={fadeInUp}
              role="status" aria-live="polite" aria-atomic="true"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  className="inline-block bg-linear-to-r from-accent via-[#8a7bff] to-accent bg-size-[200%_200%] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(138,123,255,0.3)] md:drop-shadow-[0_0_30px_rgba(138,123,255,0.3)] font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {activePhrase}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* CTA Buttons - shown on desktop */}
            <motion.div
              className="hidden lg:flex flex-row gap-3 md:gap-4 pt-2 md:pt-4 justify-center lg:justify-start"
              variants={fadeInUp}
            >
              <Link
                href="/brief"
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
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN - Photo & Social */}
          <motion.div
            className="relative w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:mx-0 lg:ml-auto space-y-4 md:space-y-6 mt-8 lg:mt-0 order-2 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Photo — glass card */}
            <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 lg:p-8 border-border/40 overflow-hidden relative group">
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
              <motion.a
                href="https://www.linkedin.com/in/sayan-roor/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
              </motion.a>
              <motion.a
                href="https://instagram.com/satoshi_iam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300"
                aria-label="Instagram"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </motion.a>
              <motion.a
                href="https://t.me/satoshi_iam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300"
                aria-label="Telegram"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </motion.a>
              <motion.a
                href="https://github.com/SayanRoor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300"
                aria-label="GitHub"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-4 h-4 md:w-5 md:h-5" />
              </motion.a>
            </div>

            {/* CTA Buttons - shown after photo on mobile, hidden on desktop */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 justify-center lg:hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/brief"
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
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
