'use client';

import type { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { StructuredData, generatePersonStructuredData, generateWebsiteStructuredData, generateServiceStructuredData } from "@/components/seo/structured-data";
import {
  Code,
  Link2,
  Zap,
  BarChart3,
  Shield,
  FileText,
  CreditCard,
  Eye,
  CheckCircle2,
  ArrowRight,
  Linkedin,
  Instagram,
  Github,
  Send,
  type LucideIcon,
} from "lucide-react";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";
// import { TechnologiesMarquee } from "@/components/technologies-marquee";
import { getTranslatedProject } from "@/lib/portfolio-data";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Adaptive viewport settings for mobile and desktop
// Use amount instead of negative margins for better mobile compatibility
// amount: 0.2 means trigger when 20% of element is visible
type ViewportSettings = { readonly once: true; readonly amount: number };
const getViewportSettings = (amount = 0.2): ViewportSettings => ({ once: true, amount });




function HeroSection(): ReactElement {
  const t = useTranslations();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const PHRASE_COUNT = 4;

  useEffect((): (() => void) => {
    const intervalId = window.setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASE_COUNT);
    }, 4200);

    return (): void => window.clearInterval(intervalId);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activePhrase = t(`home.hero.rotatingPhrases.${phraseIndex}` as any);

  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 lg:pb-32 overflow-hidden flex items-center">
      <Container className="relative z-10 w-full px-4 md:px-6">
        {/* Two-column grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* LEFT COLUMN - Content */}
          <motion.div
            className="space-y-6 md:space-y-8 text-center lg:text-left"
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

            {/* Main title with rotating phrases */}
            <motion.h1
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight"
              variants={fadeInUp}
            >
              <span className="block text-foreground font-black">
                {t("home.hero.mainTitle")}
              </span>
              <span className="block mt-3 md:mt-4" role="status" aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIndex}
                    className="inline-block bg-linear-to-r from-accent via-[#8a7bff] to-accent bg-size-[200%_200%] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(138,123,255,0.3)] md:drop-shadow-[0_0_30px_rgba(138,123,255,0.3)] font-black"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {activePhrase}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
              variants={fadeInUp}
            >
              {t("home.hero.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 justify-center lg:justify-start"
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
            className="relative w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:mx-0 lg:ml-auto space-y-4 md:space-y-6 mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Photo Card - matching footer style */}
            <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 lg:p-8 border-border/40 overflow-hidden relative group">
              {/* Decorative blur */}
              <div className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 w-32 h-32 md:w-48 md:h-48 bg-accent/10 blur-[60px] md:blur-[80px] rounded-full" />

              <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-linear-to-br from-accent/20 to-accent/5">
                <Image
                  src="/Sayan_Roor_Web_Dev.jpg"
                  alt={t("home.hero.imageAlt")}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>

            {/* Social Links - matching footer style */}
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
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function ExpertiseSection(): ReactElement {
  const t = useTranslations();
  const expertise = [
    {
      id: 'dev',
      icon: Code,
    },
    {
      id: 'integrations',
      icon: Link2,
    },
    {
      id: 'performance',
      icon: Zap,
    },
    {
      id: 'marketing',
      icon: BarChart3,
    },
  ];

  return (
    <section id="expertise" className="relative py-section">
      <Container className="space-y-12 md:space-y-16">
        {/* Section Header */}
        <motion.div
          className="space-y-4 text-center max-w-3xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.p
            className="text-xs font-bold uppercase tracking-[0.2em] text-accent"
            variants={fadeInUp}
          >
            {t("home.expertise.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold"
            variants={fadeInUp}
          >
            {t("home.expertise.title")}
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-muted-foreground leading-relaxed"
            variants={fadeInUp}
          >
            {t("home.expertise.description")}
          </motion.p>
        </motion.div>

        {/* Expertise Grid - Modern bento-style cards */}
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {expertise.map((item, index) => (
            <motion.article
              key={item.id}
              className="glass-card group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:border-accent/60 hover:shadow-xl"
              initial="initial"
              whileInView="animate"
              viewport={getViewportSettings(0.2)}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Accent bar on left */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-accent/80 via-accent/40 to-transparent" />

              {/* Glowing effect on hover */}
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content wrapper */}
              <div className="relative space-y-6">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/10 ring-1 ring-accent/20 group-hover:bg-accent/20 group-hover:ring-accent/40 group-hover:scale-110 transition-all duration-500">
                  <item.icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
                </div>

                {/* Text content */}
                <div className="space-y-3">
                  <h3 className="font-heading text-2xl font-bold leading-tight text-foreground group-hover:text-accent transition-colors duration-300">
                    {t(`home.expertise.items.${item.id}.title`)}
                  </h3>
                  <p className="text-base text-muted-foreground/90 leading-relaxed">
                    {t(`home.expertise.items.${item.id}.description`)}
                  </p>
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-all duration-500" />
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

type ProcessStep = {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly duration: string;
  readonly output: string;
};

type ProcessStepCardProps = {
  readonly step: ProcessStep;
  readonly t: ReturnType<typeof useTranslations>;
};

// Animation variants for process step cards (same as why me cards)
const processStepCardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function ProcessStepCard({ step, t }: ProcessStepCardProps): ReactElement {
  return (
    <motion.article
      className="glass-card rounded-2xl p-6 cursor-pointer overflow-hidden relative group h-full flex flex-col"
      variants={processStepCardVariants}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1] as const,
        },
      }}
    >
      {/* Animated background gradient on hover */}
      <motion.div
        className="absolute inset-0 bg-linear-to-br from-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className="relative z-10 space-y-4 flex-1 flex flex-col">
        {/* Number Badge */}
        <div className="flex items-center justify-between">
          <span className="text-5xl font-heading font-black text-accent/20 group-hover:text-accent/40 transition-colors">
            {step.number}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1 rounded-full bg-muted/30">
            {step.duration}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-xl font-bold leading-tight min-h-[56px] flex items-center">{step.title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed min-h-[80px]">
          {t(`home.process.steps.${step.id}.description`)}
        </p>

        {/* Output Box - pushed to bottom */}
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 space-y-1 mt-auto">
          <p className="text-[10px] font-black uppercase tracking-wider text-accent">
            {t("home.process.outputLabel")}
          </p>
          <p className="text-xs text-foreground/80 font-medium min-h-[32px]">
            {t(`home.process.steps.${step.id}.output`)}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function ProcessSection(): ReactElement {
  const t = useTranslations();
  const steps = [
    {
      id: 'consult',
      number: '01',
      title: t('home.process.steps.consult.title'),
      description: 'Разбираю вашу ситуацию, анализирую конкурентов. Озвучиваю примерную стоимость и сроки.',
      duration: t('home.process.steps.consult.duration'),
      output: 'Понимание, что нужно делать. Бесплатно.',
    },
    {
      id: 'scope',
      number: '02',
      title: t('home.process.steps.scope.title'),
      description: 'Детальное ТЗ с прототипами, план разработки, стратегия маркетинга, договор и график платежей.',
      duration: t('home.process.steps.scope.duration'),
      output: 'Полная картина проекта. Если что-то не нравится — меняем до старта.',
    },
    {
      id: 'development',
      number: '03',
      title: t('home.process.steps.development.title'),
      description: 'Пишу код, каждую неделю — созвон с отчётом, доступ к тестовой версии, вносим правки по ходу.',
      duration: t('home.process.steps.development.duration'),
      output: 'Видите прогресс. Никаких "чёрных ящиков".',
    },
    {
      id: 'launch',
      number: '04',
      title: t('home.process.steps.launch.title'),
      description: 'Переносим на боевой сервер, настраиваю аналитику, запускаю рекламу, обучаю вашу команду.',
      duration: t('home.process.steps.launch.duration'),
      output: 'Работающий инструмент + первые заявки',
    },
  ];

  return (
    <section id="process" className="relative border-t border-border/60 py-section overflow-hidden">
      {/* Background with gradient orbs and grid pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/30" />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          {/* Orb 1 - Azure (top-left) */}
          <div
            className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-[#99b9ff] opacity-20 blur-3xl transition-opacity duration-1000 dark:opacity-10"
          />

          {/* Orb 2 - Spring Green (top-right) */}
          <div
            className="absolute -right-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-[#78ffd1] opacity-15 blur-3xl transition-opacity duration-1000 dark:opacity-8"
          />

          {/* Orb 3 - Flamingo (bottom-left) */}
          <div
            className="absolute -bottom-1/4 -left-1/4 h-[550px] w-[550px] rounded-full bg-[#ffb3c2] opacity-15 blur-3xl transition-opacity duration-1000 dark:opacity-8"
          />

          {/* Orb 4 - Lime (bottom-right) */}
          <div
            className="absolute -bottom-1/4 -right-1/4 h-[450px] w-[450px] rounded-full bg-[#f0ffa6] opacity-12 blur-3xl transition-opacity duration-1000 dark:opacity-6"
          />
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <Container className="relative z-10 space-y-12">
        <motion.div
          className="space-y-4 text-balance text-center"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
            variants={fadeInUp}
          >
            {t("home.process.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            {t("home.process.title")}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {t.rich("home.process.description", {
              highlight: (chunks) => <span className="font-semibold text-foreground">{chunks}</span>,
            })}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.15)}
          variants={staggerContainer}
        >
          {steps.map((step) => (
            <ProcessStepCard
              key={step.id}
              step={step}
              t={t}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

type GuaranteeItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
};

type GuaranteeCardProps = {
  readonly guarantee: GuaranteeItem;
  readonly t: ReturnType<typeof useTranslations>;
};

// Animation variants for guarantee cards
const guaranteeCardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function GuaranteeCard({ guarantee, t }: GuaranteeCardProps): ReactElement {
  const Icon = guarantee.icon;

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 text-center cursor-pointer overflow-hidden relative"
      initial="initial"
      whileInView="animate"
      viewport={getViewportSettings(0.2)}
      variants={guaranteeCardVariants}
      whileHover={{
        scale: 1.05,
        y: -8,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1] as const,
        },
      }}
    >
      {/* Animated background gradient on hover */}
      <motion.div
        className="absolute inset-0 bg-linear-to-br from-accent/5 to-accent/10 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        <div className="flex justify-center mb-4">
          <motion.div
            className="rounded-lg bg-accent/10 p-3"
            whileHover={{
              scale: 1.1,
              opacity: 0.8,
              transition: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1] as const,
              },
            }}
          >
            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: [0, -10, 10, -10, 10, 0],
                transition: {
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1] as const,
                },
              }}
            >
              <Icon className="w-8 h-8 text-accent" />
            </motion.div>
          </motion.div>
        </div>
        <motion.h3
          className="font-heading text-lg mb-2 text-foreground"
        >
          {t(`home.guarantees.items.${guarantee.id}.title`)}
        </motion.h3>
        <p className="text-sm text-muted-foreground">{t(`home.guarantees.items.${guarantee.id}.description`)}</p>
      </div>
    </motion.div>
  );
}

function GuaranteesSection(): ReactElement {
  const t = useTranslations();
  const guarantees: Array<GuaranteeItem> = [
    {
      id: 'warranty',
      title: 'Гарантия',
      description: '12 месяцев бесплатного исправления багов и поддержки',
      icon: Shield,
    },
    {
      id: 'contract',
      title: 'Договор',
      description: 'Работаю с ИП/ТОО, все условия прописаны в договоре',
      icon: FileText,
    },
    {
      id: 'payment',
      title: 'Оплата',
      description: '30% → 40% → 30%. Платите только за выполненную работу',
      icon: CreditCard,
    },
    {
      id: 'process',
      title: 'Процесс',
      description: 'Еженедельные созвоны, доступ к тестовой версии, видите весь прогресс',
      icon: Eye,
    },
  ];

  return (
    <section className="border-t border-border/60 py-section">
      <Container className="space-y-12">
        <motion.div
          className="space-y-4 text-balance text-center"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
            variants={fadeInUp}
          >
            {t("home.guarantees.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            {t("home.guarantees.title")}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.2)}
          variants={staggerContainer}
        >
          {guarantees.map((guarantee) => (
            <GuaranteeCard
              key={guarantee.id}
              guarantee={guarantee}
              t={t}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

// Portfolio section - hidden from homepage
// function PortfolioSection(): ReactElement {
//   const t = useTranslations();
//   const projects = getFeaturedProjects();
//
//   return (
//     <section className="relative border-t border-border/60 py-section overflow-hidden">
//       {/* Background with gradient orbs and grid pattern */}
//       <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
//         {/* Base gradient background */}
//         <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/30" />
//
//         {/* Animated gradient orbs */}
//         <div className="absolute inset-0">
//           {/* Orb 1 - Azure (top-left) */}
//           <div
//             className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-[#99b9ff] opacity-20 blur-3xl transition-opacity duration-1000 dark:opacity-10"
//           />
//
//           {/* Orb 2 - Spring Green (top-right) */}
//           <div
//             className="absolute -right-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-[#78ffd1] opacity-15 blur-3xl transition-opacity duration-1000 dark:opacity-8"
//           />
//
//           {/* Orb 3 - Flamingo (bottom-left) */}
//           <div
//             className="absolute -bottom-1/4 -left-1/4 h-[550px] w-[550px] rounded-full bg-[#ffb3c2] opacity-15 blur-3xl transition-opacity duration-1000 dark:opacity-8"
//           />
//
//           {/* Orb 4 - Lime (bottom-right) */}
//           <div
//             className="absolute -bottom-1/4 -right-1/4 h-[450px] w-[450px] rounded-full bg-[#f0ffa6] opacity-12 blur-3xl transition-opacity duration-1000 dark:opacity-6"
//           />
//         </div>
//
//         {/* Subtle grid pattern overlay */}
//         <div
//           className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
//           style={{
//             backgroundImage: `
//               linear-gradient(to right, currentColor 1px, transparent 1px),
//               linear-gradient(to bottom, currentColor 1px, transparent 1px)
//             `,
//             backgroundSize: '48px 48px',
//           }}
//         />
//       </div>
//
//       <Container className="relative z-10 space-y-12">
//         <motion.div
//           className="space-y-4 text-balance text-center"
//           initial="initial"
//           whileInView="animate"
//           viewport={getViewportSettings(0.1)}
//           variants={staggerContainer}
//         >
//           <motion.p
//             className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
//             variants={fadeInUp}
//           >
//             {t("home.portfolio.label")}
//           </motion.p>
//           <motion.h2
//             className="font-heading text-3xl md:text-4xl"
//             variants={fadeInUp}
//           >
//             {t("home.portfolio.title")}
//           </motion.h2>
//           <motion.p
//             className="text-lg text-muted-foreground max-w-2xl mx-auto"
//             variants={fadeInUp}
//           >
//             {t("home.portfolio.description")}
//           </motion.p>
//         </motion.div>
//
//         <div className="flex justify-center">
//           <div className="grid gap-6 max-w-2xl w-full">
//             {projects.map((project, index) => {
//               const translatedProject = getTranslatedProject(project.id, t) ?? project;
//               return (
//                 <motion.article
//                   key={project.id}
//                   className="group relative rounded-2xl border border-border/60 bg-surface/80 overflow-hidden shadow-soft transition-all hover:-translate-y-2 hover:border-accent/70 hover:shadow-lg"
//                   initial="initial"
//                   whileInView="animate"
//                   viewport={getViewportSettings(0.2)}
//                   variants={fadeInUp}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link
//                     href={`/cases/${translatedProject.id}`}
//                     className="block"
//                     aria-label={t("cases.list.openCaseAria", { title: translatedProject.title })}
//                   >
//                     <ProjectCardContent project={translatedProject} />
//                   </Link>
//                 </motion.article>
//               );
//             })}
//           </div>
//         </div>
//
//         {projects.length > 1 && (
//           <motion.div
//             className="text-center"
//             initial="initial"
//             whileInView="animate"
//             viewport={{ once: true }}
//             variants={fadeInUp}
//           >
//             <Link
//               href="/cases"
//               className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface/80 px-6 py-3 text-sm font-semibold normal-case text-foreground transition-all hover:border-accent hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
//             >
//               {t("common.cta.viewAllCases")}
//               <ArrowRight className="w-4 h-4" />
//             </Link>
//           </motion.div>
//         )}
//       </Container>
//     </section>
//   );
// }

// function ProjectCardContent({ project }: { readonly project: PortfolioProject }): ReactElement {
//   return (
//     <>
//       {/* Image */}
//       <div className="relative aspect-video overflow-hidden bg-linear-to-br from-accent/20 to-accent/5">
//         <Image
//           src={project.image}
//           alt={project.imageAlt}
//           fill
//           className="object-cover transition-transform duration-300 group-hover:scale-105"
//         />
//       </div>
//
//       {/* Content */}
//       <div className="p-6 space-y-4">
//         <div className="space-y-2">
//           <div className="flex items-start justify-between gap-2">
//             <h3 className="font-heading text-xl group-hover:text-accent transition-colors">
//               {project.title}
//             </h3>
//             <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-0.5" />
//           </div>
//           <p className="text-sm text-muted-foreground line-clamp-2">
//             {project.shortDescription}
//           </p>
//         </div>
//
//         {/* Tags */}
//         <div className="flex flex-wrap gap-2">
//           {project.tags.slice(0, 3).map((tag) => (
//             <span
//               key={tag}
//               className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
//             >
//               {tag}
//             </span>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

function LatestCaseSection(): ReactElement {
  const t = useTranslations();
  const project = getTranslatedProject('egemen-kz', t);
  if (!project) return <></>;

  return (
    <section className="border-t border-border/60 py-section overflow-hidden">
      <Container>
        <motion.div
          className="space-y-10"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          {/* Section header */}
          <motion.div className="space-y-3 text-center" variants={fadeInUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              {t("home.latestCase.label")}
            </p>
            <h2 className="font-heading text-3xl md:text-4xl">
              {t("home.latestCase.title")}
            </h2>
          </motion.div>

          {/* Case banner */}
          <motion.div variants={fadeInUp}>
            <Link
              href="/cases/egemen-kz"
              className="group block rounded-3xl overflow-hidden glass-card border-border/60 hover:border-accent/60 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="grid md:grid-cols-2 min-h-[420px]">
                {/* Image side */}
                <div className="relative overflow-hidden bg-linear-to-br from-accent/20 to-accent/5 min-h-[260px] md:min-h-0">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-surface/60 hidden md:block" />
                  {/* Year badge */}
                  <div className="absolute top-4 left-4 rounded-full border border-border/60 bg-surface/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {project.year}
                  </div>
                </div>

                {/* Content side */}
                <div className="flex flex-col justify-center p-8 md:p-10 space-y-6">
                  {/* Category + label */}
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                      {project.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("home.latestCase.newLabel")}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="space-y-3">
                    <h3 className="font-heading text-2xl md:text-3xl group-hover:text-accent transition-colors leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Metrics row */}
                  {project.metrics && (
                    <div className="grid grid-cols-2 gap-3">
                      {project.metrics.slice(0, 4).map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-xl border border-border/60 bg-surface/60 p-3 space-y-0.5"
                        >
                          <p className="text-lg font-bold text-accent">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags + CTA */}
                  <div className="flex flex-wrap items-center gap-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:gap-2.5 transition-all">
                      {t("home.latestCase.cta")}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* View all cases link */}
          <motion.div className="text-center" variants={fadeInUp}>
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface/80 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-accent hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("common.cta.viewAllCases")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function FinalCTASection(): ReactElement {
  const t = useTranslations();
  return (
    <section className="py-section">
      <Container className="max-w-4xl">
        <motion.div
          className="space-y-10 text-balance"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div
            className="space-y-4 text-center"
            variants={fadeInUp}
          >
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
              variants={fadeInUp}
            >
              {t("home.finalCta.label")}
            </motion.p>
            <motion.h2
              className="font-heading text-3xl md:text-4xl lg:text-5xl"
              variants={fadeInUp}
            >
              {t("home.finalCta.title")}
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              {t("home.finalCta.description")}
            </motion.p>
          </motion.div>

          {/* CTA Card — contact page style */}
          <motion.div
            className="rounded-3xl border-2 border-accent/40 bg-linear-to-br from-accent/10 via-accent/5 to-surface/40 p-8 md:p-12 shadow-soft text-center"
            variants={fadeInUp}
          >
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="rounded-xl bg-accent p-3 w-fit mx-auto">
                <Send className="w-7 h-7 text-accent-foreground" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 text-left">
                {[
                  t("home.finalCta.benefits.item1"),
                  t("home.finalCta.benefits.item2"),
                  t("home.finalCta.benefits.item3"),
                  t("home.finalCta.benefits.item4"),
                ].map((text, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground">{text}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {t("home.finalCta.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/brief"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 text-base font-semibold normal-case text-accent-foreground shadow-soft transition-all hover:bg-accent/90 hover:shadow-lg hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t("common.cta.getFreeConsultation")}
                  <Send className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

export default function Home(): ReactElement {
  const locale = useLocale();

  return (
    <SiteShell>
      <StructuredData data={generatePersonStructuredData(locale)} />
      <StructuredData data={generateWebsiteStructuredData(locale)} />
      <StructuredData data={generateServiceStructuredData()} />
      <main id="main-content" className="flex flex-1 flex-col">
        <HeroSection />
        <ExpertiseSection />
        <ProcessSection />
        <GuaranteesSection />
        <LatestCaseSection />
        <FinalCTASection />
      </main>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          type="button"
          className="rounded-full border border-border/60 bg-surface/80 p-3 text-foreground shadow-soft transition hover:-translate-y-1 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Scroll to top"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <ArrowRight className="h-4 w-4 -rotate-90" />
        </button>
        <button
          type="button"
          className="rounded-full border border-border/60 bg-surface/80 p-3 text-foreground shadow-soft transition hover:translate-y-1 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Scroll to bottom"
          onClick={() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }}
        >
          <ArrowRight className="h-4 w-4 rotate-90" />
        </button>
      </div>
    </SiteShell>
  );
}
