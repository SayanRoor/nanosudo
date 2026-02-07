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
import { SiteShell } from "@/components/layout/site-shell";
import { TechnologiesMarquee } from "@/components/technologies-marquee";
// import { HeroBackground } from "@/components/hero-background";
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
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden">
      {/* Animated Hero Background with Floating Tech Icons - Replaced by Global Background */}

      <Container className="relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* Left Column - Content */}
          <motion.div
            className="space-y-8 text-center lg:text-left pt-10 lg:pt-0"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >

            {/* Main Heading */}
            <motion.div className="space-y-6" variants={fadeInUp}>
              <h1 className="text-foreground tracking-tighter">
                {t("home.hero.mainTitle")}
              </h1>

              {/* Rotating Phrases with Gradient */}
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-extrabold" role="status" aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="block tech-gradient-text"
                  >
                    {activePhrase}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              className="max-w-xl mx-auto lg:mx-0"
              variants={fadeInUp}
            >
              {t("home.hero.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              variants={fadeInUp}
            >
              <Link
                href="/brief"
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                {t("common.cta.cost")}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href="#process"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-surface px-8 py-4 text-base font-semibold text-foreground transition-all duration-300 hover:bg-muted hover:border-accent/50"
              >
                {t("common.cta.howIWork")}
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-4 pt-4"
              variants={fadeInUp}
            >
              {[
                { icon: Linkedin, href: "https://www.linkedin.com/in/sayan-roor/", label: "LinkedIn" },
                { icon: Github, href: "https://github.com/SayanRoor", label: "GitHub" },
                { icon: Instagram, href: "https://instagram.com/satoshi_iam", label: "Instagram" },
                { icon: Send, href: "https://t.me/satoshi_iam", label: "Telegram" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface border border-border text-muted-foreground transition-all duration-300 hover:text-accent hover:border-accent hover:-translate-y-1 shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Image Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-accent/10 to-secondary/10 shadow-2xl">
              {/* Image */}
              <Image
                src="/Sayan_Roor_Web_Dev.jpg"
                alt={t("home.hero.imageAlt")}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              {/* Tech Badges */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                <span className="px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border text-sm font-semibold text-foreground shadow-lg">
                  Database
                </span>
                <span className="px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border text-sm font-semibold text-foreground shadow-lg">
                  Frontend
                </span>
                <span className="px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border text-sm font-semibold text-foreground shadow-lg">
                  Backend
                </span>
                <span className="px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border text-sm font-semibold text-foreground shadow-lg">
                  API
                </span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-accent/20 to-secondary/20 blur-3xl opacity-30 rounded-3xl" />
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
      tech: ['Core Web Vitals', 'SSR/SSG', 'Optimization'],
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
    <section id="expertise" className="relative border-t border-border/5 py-section overflow-hidden bg-background/20 backdrop-blur-[1px]">
      <Container className="relative z-10 space-y-16">
        <motion.div
          className="space-y-4 text-balance text-center"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <span className="label-caps">
              {t("home.expertise.label")}
            </span>
          </motion.div>
          <motion.h2
            className="tracking-tight"
            variants={fadeInUp}
          >
            {t("home.expertise.title")}
          </motion.h2>
          <motion.p
            className="max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {t("home.expertise.description")}
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          {expertise.map((item, index) => (
            <motion.article
              key={index}
              className="glass-card group rounded-3xl p-10 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
              initial="initial"
              whileInView="animate"
              viewport={getViewportSettings(0.2)}
              variants={fadeInUp}
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <item.icon className="w-32 h-32" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="rounded-2xl bg-accent/10 p-4 border border-accent/20 text-accent group-hover:bg-accent group-hover:text-black dark:group-hover:text-white transition-all duration-500">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-2xl group-hover:tech-gradient-text transition-all duration-300">
                    {t(`home.expertise.items.${item.id}.title`)}
                  </h3>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t(`home.expertise.items.${item.id}.description`)}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {item.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-accent/10 bg-accent/5 px-4 py-1.5 text-xs font-bold text-accent/80 uppercase tracking-widest"
                    >
                      {tech}
                    </span>
                  ))}
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
      className="glass-card group h-full rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden border-border/40"
      initial="initial"
      whileInView="animate"
      viewport={getViewportSettings(0.1)}
      variants={processStepCardVariants}
    >
      <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity decoration-accent pointer-events-none">
        <span className="text-8xl font-heading font-black select-none tracking-tighter">
          {step.number}
        </span>
      </div>

      <div className="relative z-10 space-y-6 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div className="rounded-2xl bg-accent/10 px-4 py-2 border border-accent/20 text-accent group-hover:bg-accent group-hover:text-black dark:group-hover:text-white transition-all duration-500">
            <span className="text-xs font-black uppercase tracking-[0.2em]">{step.duration}</span>
          </div>
        </div>

        <div className="space-y-3 flex-grow">
          <h3 className="font-heading text-2xl group-hover:tech-gradient-text transition-all duration-300 leading-tight">
            {step.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(`home.process.steps.${step.id}.description`)}
          </p>
        </div>

        <div className="relative p-4 rounded-2xl bg-accent/[0.03] border border-accent/10 mt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60 mb-1">{t("home.process.outputLabel")}</p>
          <p className="text-xs text-foreground/80 leading-relaxed font-bold">{t(`home.process.steps.${step.id}.output`)}</p>
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
      description: t('home.process.steps.consult.description'),
      duration: t('home.process.steps.consult.duration'),
      output: t('home.process.steps.consult.output'),
    },
    {
      id: 'scope',
      number: '02',
      title: t('home.process.steps.scope.title'),
      description: t('home.process.steps.scope.description'),
      duration: t('home.process.steps.scope.duration'),
      output: t('home.process.steps.scope.output'),
    },
    {
      id: 'development',
      number: '03',
      title: t('home.process.steps.development.title'),
      description: t('home.process.steps.development.description'),
      duration: t('home.process.steps.development.duration'),
      output: t('home.process.steps.development.output'),
    },
    {
      id: 'launch',
      number: '04',
      title: t('home.process.steps.launch.title'),
      description: t('home.process.steps.launch.description'),
      duration: t('home.process.steps.launch.duration'),
      output: t('home.process.steps.launch.output'),
    },
  ];

  return (
    <section id="process" className="relative border-t border-border/5 py-section overflow-hidden">
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
          className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.15)}
          variants={staggerContainer}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProcessStepCard
                step={step}
                t={t}
              />
            </motion.div>
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
      className="glass-card rounded-2xl p-8 text-center group cursor-pointer relative overflow-hidden"
      initial="initial"
      whileInView="animate"
      viewport={getViewportSettings(0.1)}
      variants={guaranteeCardVariants}
      whileHover={{ y: -10 }}
    >
      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="rounded-2xl bg-accent/10 p-4 transition-transform group-hover:scale-110 group-hover:rotate-12 group-hover:bg-accent/20">
            <Icon className="w-8 h-8 text-accent" />
          </div>
        </div>
        <h3 className="font-heading text-xl mb-3 text-foreground group-hover:text-accent transition-colors">
          {t(`home.guarantees.items.${guarantee.id}.title`)}
        </h3>
        <p className="text-muted-foreground font-medium leading-relaxed">{t(`home.guarantees.items.${guarantee.id}.description`)}</p>
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
    <section className="relative border-t border-border/5 py-section overflow-hidden">
      <Container className="relative z-10 space-y-16">
        <motion.div
          className="space-y-4 text-balance text-center"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent/80">
              {t("home.guarantees.label")}
            </span>
          </motion.div>
          <motion.h2
            className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-tight"
            variants={fadeInUp}
          >
            {t("home.guarantees.title")}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto"
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
    <section className="relative border-t border-border/5 py-section overflow-hidden bg-background/40 backdrop-blur-[1px]">
      <Container className="relative z-10 space-y-20">
        <motion.div
          className="space-y-6 text-balance text-center"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <span className="label-caps">
              {t("home.portfolio.label")}
            </span>
          </motion.div>
          <motion.h2
            className="tracking-tighter"
            variants={fadeInUp}
          >
            {t("home.portfolio.title")}
          </motion.h2>
          <motion.p
            className="max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            {t("home.portfolio.description")}
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 sm:grid-cols-2">
            {projects.map((project, index) => {
              const translatedProject = getTranslatedProject(project.id, t) ?? project;
              return (
                <motion.article
                  key={project.id}
                  className="glass-card group rounded-[2.5rem] overflow-hidden hover:-translate-y-3 transition-all duration-700 shadow-2xl relative"
                  initial="initial"
                  whileInView="animate"
                  viewport={getViewportSettings(0.2)}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/cases/${translatedProject.id}`}
                    className="block h-full"
                    aria-label={t("cases.list.openCaseAria", { title: translatedProject.title })}
                  >
                    <ProjectCardContent project={translatedProject} />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>

        <motion.div
          className="text-center pt-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Link
            href="/cases"
            className="inline-flex items-center gap-3 rounded-2xl glass-card px-10 py-5 text-sm font-bold uppercase tracking-widest text-foreground transition-all hover:bg-accent/10 hover:text-accent group"
          >
            {t("common.cta.viewAllCases")}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
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
    <section className="relative border-t border-border/60 py-section overflow-hidden bg-background">
      {/* Dynamic Aura Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="mesh-gradient opacity-60 dark:opacity-40 scale-125">
          <div className="mesh-orb w-[1200px] h-[1200px] -bottom-1/4 -right-1/4 bg-accent/20 blur-[150px]" />
          <div className="mesh-orb w-[800px] h-[800px] top-1/4 -left-1/4 bg-secondary/15 blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[80px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          className="space-y-12 md:space-y-20"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          {/* Header with improved typography */}
          <div className="space-y-6 text-center max-w-4xl mx-auto">
            <motion.div variants={fadeInUp}>
              <span className="label-caps px-4 py-2 rounded-full bg-accent/5 border border-accent/10">
                {t("home.finalCta.label")}
              </span>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-heading tracking-tighter leading-[0.9] text-balance"
              variants={fadeInUp}
            >
              {t("home.finalCta.title")}
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              {t("home.finalCta.description")}
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Benefits Grid */}
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
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
                  className="glass-card flex items-center gap-4 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] group transition-all hover:bg-accent/5 border-border/40"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="shrink-0 p-2.5 rounded-2xl bg-accent text-accent-foreground group-hover:scale-110 transition-transform duration-500 shadow-glow">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-base md:text-lg font-bold text-foreground/90 leading-tight">{text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div className="space-y-10 text-center" variants={fadeInUp}>
              <div className="flex flex-col items-center gap-8">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(true)}
                  className="group relative inline-flex h-20 items-center justify-center rounded-[2.5rem] bg-accent px-12 text-lg font-black uppercase tracking-[0.2em] text-[#020617] shadow-[0_20px_50px_-10px_rgba(51,153,51,0.5)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_25px_60px_-10px_rgba(51,153,51,0.6)] active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {t("common.cta.getFreeConsultation")}
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>

                <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px]">
                  {t("home.finalCta.subtitle")}
                </p>
              </div>
            </motion.div>
          </div>
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
                { icon: Github, label: t("common.footer.github"), href: "https://github.com/SayanRoor" },
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
      <StructuredData data={generateServiceStructuredData()} />
      <main id="main-content" className="flex flex-1 flex-col">
        <HeroSection />
        <ExpertiseSection />
        <ProcessSection />
        <GuaranteesSection />
        <PortfolioSection />
        <TechnologiesMarquee />
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
