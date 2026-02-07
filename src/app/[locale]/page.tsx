'use client';

import type { ReactElement } from "react";
import { motion, useSpring, useMotionValueEvent, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  TrendingUp,
  Gauge,
  ArrowRight,
  MessageCircle,
  Linkedin,
  Instagram,
  Github,
  Send,
  Mail,
  type LucideIcon,
} from "lucide-react";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import CTAParticles from "@/components/background/cta-particles-clean";
import { SiteShell } from "@/components/layout/site-shell";
import { TechnologiesMarquee } from "@/components/technologies-marquee";
import { getFeaturedProjects, getTranslatedProject, type PortfolioProject } from "@/lib/portfolio-data";

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
    <section className="relative py-20 md:py-32 overflow-hidden min-h-screen flex items-center">
      {/* Background gradient layer */}
      <div className="absolute inset-0 -z-20 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/10" />
      </div>

      {/* Particle animation layer */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <CTAParticles
          baseCount={360}
          text="NANO"
          mode="text"
          followCursor={true}
          center={false}
          trail={true}
        />
      </div>

      <Container className="relative z-10 w-full">
        {/* Two-column grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* LEFT COLUMN - Content */}
          <motion.div
            className="space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Subtitle badge */}
            <motion.p
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70"
              variants={fadeInUp}
            >
              {t("home.hero.subtitle")}
            </motion.p>

            {/* Main title with rotating phrases */}
            <motion.h1
              className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight"
              variants={fadeInUp}
            >
              <span className="block text-foreground font-black">
                {t("home.hero.mainTitle")}
              </span>
              <span className="block mt-4" role="status" aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIndex}
                    className="inline-block bg-linear-to-r from-accent via-[#8a7bff] to-accent bg-size-[200%_200%] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(138,123,255,0.3)] font-black"
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
              className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl"
              variants={fadeInUp}
            >
              {t("home.hero.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              variants={fadeInUp}
            >
              <Link
                href="/brief"
                className="group relative inline-flex items-center justify-center"
              >
                <div className="px-10 py-5 rounded-full bg-accent text-black font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-accent/40 active:scale-95 flex items-center gap-2">
                  {t("common.cta.cost")}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </div>
              </Link>
              <a
                href="#process"
                className="inline-flex items-center justify-center px-10 py-5 rounded-full border-2 border-border/80 font-black uppercase tracking-[0.2em] text-[11px] text-foreground transition-all duration-300 hover:border-accent hover:text-accent hover:bg-accent/5 active:scale-95"
              >
                {t("common.cta.howIWork")}
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN - Photo & Social */}
          <motion.div
            className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Photo Card - matching footer style */}
            <div className="glass-card rounded-[2.5rem] p-8 border-border/40 overflow-hidden relative group">
              {/* Decorative blur */}
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-accent/10 blur-[80px] rounded-full" />

              <div className="relative aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-accent/20 to-accent/5">
                <Image
                  src="/Sayan_Roor_Web_Dev.jpg"
                  alt={t("home.hero.imageAlt")}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>

            {/* Social Links - matching footer style */}
            <div className="flex items-center justify-center gap-4">
              <motion.a
                href="https://www.linkedin.com/in/sayan-roor/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://instagram.com/satoshi_iam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300"
                aria-label="Instagram"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://t.me/satoshi_iam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300"
                aria-label="Telegram"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Send className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://github.com/SayanRoor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300"
                aria-label="GitHub"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Typewriter text component that types out text character by character
 */
type TypewriterTextProps = {
  readonly text: string;
  readonly speed?: number; // milliseconds per character
  readonly delay?: number; // delay before starting
  readonly showCursor?: boolean;
};

function TypewriterText({
  text,
  speed = 30,
  delay = 0,
  showCursor = true
}: TypewriterTextProps): ReactElement {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, getViewportSettings(0.2));

  useEffect(() => {
    if (!isInView) return;

    const startTyping = (): void => {
      setIsTyping(true);
      setDisplayedText('');
      let currentIndex = 0;

      const typeChar = (): void => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeChar, speed);
        } else {
          setIsTyping(false);
        }
      };

      setTimeout(typeChar, delay);
    };

    startTyping();
  }, [isInView, text, speed, delay]);

  return (
    <span ref={ref} className="inline font-mono">
      {displayedText}
      {showCursor && isTyping && (
        <span className="inline-block w-0.5 h-4 bg-accent ml-0.5 align-middle typewriter-cursor" />
      )}
    </span>
  );
}

/**
 * Animated number component that counts from 0 to target
 */
function AnimatedNumber({
  value
}: {
  readonly value: string;
}): ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, getViewportSettings(0.2));

  // Parse value to extract number and suffix
  const match = value.match(/^([\d.]+)(.*)$/);

  const spring = useSpring(0, { stiffness: 50, damping: 30 });
  const [display, setDisplay] = useState(0);

  const numStr = match?.[1] ?? '';
  const suffix = match?.[2] ?? '';
  const targetNum = match ? parseFloat(numStr) : 0;
  const hasDecimals = numStr.includes('.');
  const decimalPlaces = hasDecimals ? (numStr.split('.')[1]?.length ?? 1) : 0;

  useEffect(() => {
    if (isInView && match) {
      spring.set(targetNum);
    }
  }, [isInView, targetNum, spring, match]);

  useMotionValueEvent(spring, "change", (latest) => {
    if (match) {
      if (hasDecimals) {
        setDisplay(parseFloat(latest.toFixed(decimalPlaces)));
      } else {
        setDisplay(Math.round(latest));
      }
    }
  });

  // If value doesn't match pattern, return as-is
  if (!match) {
    return <span ref={ref}>{value}</span>;
  }

  // Format number (preserve decimals if original had them)
  const formattedNum = hasDecimals
    ? display.toFixed(decimalPlaces)
    : display.toString();

  return <span ref={ref}>{formattedNum}{suffix}</span>;
}

type StatItem = {
  readonly value: string;
  readonly label: string;
  readonly icon: LucideIcon;
};

type StatsCardProps = {
  readonly stat: StatItem;
};

// Animation variants for stats cards
const statsCardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function StatsCard({ stat }: StatsCardProps): ReactElement {
  const Icon = stat.icon;

  return (
    <motion.div
      className="rounded-xl border border-border/60 bg-surface/80 p-6 shadow-soft text-center cursor-pointer overflow-hidden relative"
      initial="initial"
      whileInView="animate"
      viewport={getViewportSettings(0.2)}
      variants={statsCardVariants}
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
        <div className="flex justify-center mb-2">
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
            <Icon className="w-6 h-6 text-accent" />
          </motion.div>
        </div>
        <motion.p
          className="text-2xl md:text-3xl font-heading text-accent mb-1"
          whileHover={{
            scale: 1.1,
            transition: {
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1] as const,
            },
          }}
        >
          <AnimatedNumber value={stat.value} />
        </motion.p>
        <p className="text-xs text-muted-foreground">{stat.label}</p>
      </div>
    </motion.div>
  );
}

function StatsSection(): ReactElement {
  const t = useTranslations();
  const stats: Array<StatItem> = [
    { value: '20+', label: t('home.stats.items.successfulProjects'), icon: TrendingUp },
    { value: '95+', label: t('home.stats.items.pageSpeed'), icon: Gauge },
    { value: '1.2с', label: t('home.stats.items.avgLoad'), icon: Zap },
    { value: '12 мес', label: t('home.stats.items.codeWarranty'), icon: Shield },
  ];

  return (
    <section className="border-t border-border/60 py-section bg-surface/40">
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
            {t("home.stats.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            {t("home.stats.title")}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.2)}
          variants={staggerContainer}
        >
          {stats.map((stat) => (
            <StatsCard
              key={stat.label}
              stat={stat}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function ExpertiseSection(): ReactElement {
  const t = useTranslations();
  const expertise = [
    {
      id: 'dev',
      title: 'Разработка полного цикла',
      description: 'Frontend, Backend, Database, API — весь стек в одних руках. От архитектуры до деплоя.',
      tech: ['Next.js 16', 'TypeScript', 'PostgreSQL'],
      icon: Code,
    },
    {
      id: 'integrations',
      title: 'Интеграции и автоматизация',
      description: 'CRM, 1С, Kaspi API, платежи — связываю все системы в единый рабочий процесс.',
      tech: ['1С интеграция', 'Kaspi API', 'CRM системы'],
      icon: Link2,
    },
    {
      id: 'performance',
      title: 'Производительность и SEO',
      description: 'Скорость загрузки 1-1.5 сек, Core Web Vitals в зелёной зоне. Техническая оптимизация.',
      tech: ['Core Web Vitals', 'SSR/SSG', 'Image Optimization'],
      icon: Zap,
    },
    {
      id: 'marketing',
      title: 'Маркетинг и аналитика',
      description: 'Настройка рекламы, аналитика, A/B тесты — видите полную картину эффективности.',
      tech: ['Google Ads', 'Яндекс.Директ', 'GA4'],
      icon: BarChart3,
    },
  ];

  return (
    <section id="expertise" className="relative border-t border-border/60 py-section overflow-hidden">
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
            {t("home.expertise.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            {t("home.expertise.title")}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {t("home.expertise.description")}
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {expertise.map((item, index) => (
            <motion.article
              key={index}
              className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft transition hover:-translate-y-1 hover:border-accent/70"
              initial="initial"
              whileInView="animate"
              viewport={getViewportSettings(0.2)}
              variants={fadeInUp}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-accent/10 p-3 shrink-0">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="font-heading text-xl">{t(`home.expertise.items.${item.id}.title`)}</h3>
                  <p className="text-sm text-muted-foreground">
                    <TypewriterText
                      text={t(`home.expertise.items.${item.id}.description`)}
                      speed={15}
                      delay={index * 300}
                      showCursor={true}
                    />
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
  readonly payment?: string;
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
      className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft cursor-pointer overflow-hidden relative group"
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

      <div className="relative z-10 space-y-4">
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
        <h3 className="font-heading text-xl font-bold leading-tight">{step.title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t(`home.process.steps.${step.id}.description`)}
        </p>

        {/* Output Box */}
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-accent">
            {t("home.process.outputLabel")}
          </p>
          <p className="text-xs text-foreground/80 font-medium">
            {t(`home.process.steps.${step.id}.output`)}
          </p>
        </div>

        {/* Payment info if exists */}
        {step.payment && (
          <p className="text-xs text-muted-foreground font-semibold">
            💰 {step.payment}
          </p>
        )}
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
      payment: '30% от стоимости',
    },
    {
      id: 'development',
      number: '03',
      title: t('home.process.steps.development.title'),
      description: 'Пишу код, каждую неделю — созвон с отчётом, доступ к тестовой версии, вносим правки по ходу.',
      duration: t('home.process.steps.development.duration'),
      output: 'Видите прогресс. Никаких "чёрных ящиков".',
      payment: '40% по готовности 50% функционала',
    },
    {
      id: 'launch',
      number: '04',
      title: t('home.process.steps.launch.title'),
      description: 'Переносим на боевой сервер, настраиваю аналитику, запускаю рекламу, обучаю вашу команду.',
      duration: t('home.process.steps.launch.duration'),
      output: 'Работающий инструмент + первые заявки',
      payment: '30% после запуска',
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
      className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft text-center cursor-pointer overflow-hidden relative"
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

function PortfolioSection(): ReactElement {
  const t = useTranslations();
  const projects = getFeaturedProjects();

  return (
    <section className="relative border-t border-border/60 py-section overflow-hidden">
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
            {t("home.portfolio.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            {t("home.portfolio.title")}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {t("home.portfolio.description")}
          </motion.p>
        </motion.div>

        <div className="flex justify-center">
          <div className="grid gap-6 max-w-2xl w-full">
            {projects.map((project, index) => {
              const translatedProject = getTranslatedProject(project.id, t) ?? project;
              return (
                <motion.article
                  key={project.id}
                  className="group relative rounded-2xl border border-border/60 bg-surface/80 overflow-hidden shadow-soft transition-all hover:-translate-y-2 hover:border-accent/70 hover:shadow-lg"
                  initial="initial"
                  whileInView="animate"
                  viewport={getViewportSettings(0.2)}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/cases/${translatedProject.id}`}
                    className="block"
                    aria-label={t("cases.list.openCaseAria", { title: translatedProject.title })}
                  >
                    <ProjectCardContent project={translatedProject} />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>

        {projects.length > 1 && (
          <motion.div
            className="text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface/80 px-6 py-3 text-sm font-semibold normal-case text-foreground transition-all hover:border-accent hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("common.cta.viewAllCases")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </Container>
    </section>
  );
}

function ProjectCardContent({ project }: { readonly project: PortfolioProject }): ReactElement {
  return (
    <>
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-linear-to-br from-accent/20 to-accent/5">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-xl group-hover:text-accent transition-colors">
              {project.title}
            </h3>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-0.5" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.shortDescription}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function FinalCTASection(): ReactElement {
  const t = useTranslations();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  return (
    <section className="relative border-t border-border/60 py-section overflow-hidden">
      {/* Static background (video removed for improved UX) */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/30" />
      </div>

      <CTAParticles />

      <Container className="relative z-10 max-w-4xl">
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

          {/* Benefits Grid */}
          <motion.div
            className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {[
              t("home.finalCta.benefits.item1"),
              t("home.finalCta.benefits.item2"),
              t("home.finalCta.benefits.item3"),
              t("home.finalCta.benefits.item4"),
            ].map((text, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/80 p-4 shadow-soft"
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-foreground">{text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div className="space-y-4 text-center" variants={fadeInUp}>
            <motion.p className="text-sm text-muted-foreground" variants={fadeInUp}>
              {t("home.finalCta.subtitle")}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="btn-accent inline-flex items-center justify-center rounded-lg bg-accent px-10 py-5 text-base font-semibold normal-case border-2 shadow-soft transition-all hover:bg-accent/90 hover:shadow-lg hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("common.cta.getFreeConsultation")}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>

      {isContactModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/60 bg-surface/95 p-6 shadow-soft text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                  {t("contact.hero.label")}
                </p>
                <h3 className="font-heading text-2xl text-foreground">{t("contact.hero.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t("contact.hero.description")}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="rounded-full border border-border/60 p-2 text-muted-foreground transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label="Close contact options"
              >
                <ArrowRight className="h-4 w-4 rotate-45" />
              </button>
            </div>
            <div className="grid gap-3">
              {[
                { icon: MessageCircle, label: t("common.footer.whatsapp"), href: "https://wa.me/77478277485" },
                { icon: Send, label: t("common.footer.telegram"), href: "https://t.me/satoshi_iam" },
                { icon: Instagram, label: t("common.footer.instagram"), href: "https://instagram.com/satoshi_iam" },
                { icon: Linkedin, label: t("common.footer.linkedin"), href: "https://www.linkedin.com/in/sayan-roor/" },
                { icon: Github, label: t("common.footer.github"), href: "https://github.com/SayanWD" },
                { icon: Mail, label: t("common.footer.email"), href: "mailto:roorsayan@gmail.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-surface px-4 py-3 text-sm font-semibold text-foreground shadow-soft transition hover:border-accent hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-accent" />
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
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
        <StatsSection />
        <TechnologiesMarquee />
        <ExpertiseSection />
        <TechnologiesMarquee direction="right" />
        <ProcessSection />
        <GuaranteesSection />
        <PortfolioSection />
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
