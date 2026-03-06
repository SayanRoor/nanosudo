'use client';

// Services page: AI automation + web development offerings with pricing
import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  BrainCircuit,
  Code,
  Link2,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

type ServiceItem = {
  id: 'aiAutomation' | 'webDev' | 'aiConsulting' | 'integrations';
  icon: LucideIcon;
  accent: string;
};

const SERVICES: ServiceItem[] = [
  { id: 'aiAutomation', icon: BrainCircuit, accent: 'text-accent' },
  { id: 'webDev', icon: Code, accent: 'text-blue-400' },
  { id: 'aiConsulting', icon: Lightbulb, accent: 'text-yellow-400' },
  { id: 'integrations', icon: Link2, accent: 'text-green-400' },
];

type PricingTier = 'starter' | 'business' | 'retainer';
const PRICING_TIERS: PricingTier[] = ['starter', 'business', 'retainer'];

export function ServicesPageClient(): ReactElement {
  const t = useTranslations('services');

  return (
    <SiteShell>
      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-40 pb-20 md:pt-48 md:pb-28">
          <Container>
            <motion.div
              className="max-w-4xl mx-auto text-center space-y-6"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.p
                className="text-xs font-bold uppercase tracking-[0.2em] text-accent"
                variants={fadeInUp}
              >
                {t('hero.label')}
              </motion.p>
              <motion.h1
                className="font-heading text-4xl sm:text-5xl md:text-6xl font-black leading-tight"
                variants={fadeInUp}
                dangerouslySetInnerHTML={{
                  __html: t.raw('hero.title') as string,
                }}
              />
              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                variants={fadeInUp}
              >
                {t('hero.description')}
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                variants={fadeInUp}
              >
                <Link
                  href="/brief"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-8 py-4 text-sm font-black uppercase tracking-[0.15em] text-black hover:opacity-90 transition-opacity active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  {t('hero.cta')}
                </Link>
                <Link
                  href="/cases"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-8 py-4 text-sm font-black uppercase tracking-[0.15em] hover:border-accent/50 transition-colors"
                >
                  {t('hero.ctaSecondary')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* Services List */}
        <section className="py-20 md:py-28">
          <Container className="space-y-16">
            <motion.div
              className="text-center space-y-4 max-w-2xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.p
                className="text-xs font-bold uppercase tracking-[0.2em] text-accent"
                variants={fadeInUp}
              >
                {t('list.label')}
              </motion.p>
              <motion.h2
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold"
                variants={fadeInUp}
              >
                {t('list.title')}
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg"
                variants={fadeInUp}
              >
                {t('list.description')}
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {SERVICES.map((service, i) => {
                const Icon = service.icon;
                const features = Object.values(
                  t.raw(`list.items.${service.id}.features`) as Record<string, string>
                );
                return (
                  <motion.div
                    key={service.id}
                    className="glass-card rounded-[2rem] p-8 space-y-6 group hover:border-accent/30 transition-colors duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className={`p-3 rounded-2xl bg-muted/30 ${service.accent}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border border-border/50 rounded-full px-3 py-1">
                        {t(`list.items.${service.id}.tag`)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-xl font-bold">
                        {t(`list.items.${service.id}.title`)}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {t(`list.items.${service.id}.description`)}
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${service.accent}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Pricing */}
        <section className="py-20 md:py-28 bg-muted/5">
          <Container className="space-y-16">
            <motion.div
              className="text-center space-y-4 max-w-2xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.p
                className="text-xs font-bold uppercase tracking-[0.2em] text-accent"
                variants={fadeInUp}
              >
                {t('pricing.label')}
              </motion.p>
              <motion.h2
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold"
                variants={fadeInUp}
              >
                {t('pricing.title')}
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg"
                variants={fadeInUp}
              >
                {t('pricing.description')}
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {PRICING_TIERS.map((tier, i) => {
                const features = Object.values(
                  t.raw(`pricing.tiers.${tier}.features`) as Record<string, string>
                );
                const isPopular = tier === 'business';
                const badge = isPopular ? t(`pricing.tiers.${tier}.badge`) : null;
                return (
                  <motion.div
                    key={tier}
                    className={`glass-card rounded-[2rem] p-8 space-y-6 flex flex-col ${isPopular ? 'border-accent/40 ring-1 ring-accent/20' : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">
                          {t(`pricing.tiers.${tier}.name`)}
                        </span>
                        {badge && (
                          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-black bg-accent rounded-full px-3 py-1">
                            {badge}
                          </span>
                        )}
                      </div>
                      <p className="font-heading text-3xl font-black">
                        {t(`pricing.tiers.${tier}.price`)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(`pricing.tiers.${tier}.description`)}
                      </p>
                    </div>
                    <ul className="space-y-2 flex-1">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/brief"
                      className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black uppercase tracking-[0.15em] transition-all active:scale-95 ${
                        isPopular
                          ? 'bg-accent text-black hover:opacity-90'
                          : 'bg-muted/30 text-foreground border border-border hover:border-accent/50'
                      }`}
                    >
                      {t('hero.cta')}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-center text-xs text-muted-foreground">{t('pricing.note')}</p>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <Container>
            <motion.div
              className="glass-card rounded-[2.5rem] p-12 md:p-16 text-center space-y-8 max-w-3xl mx-auto border-accent/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black">
                {t('cta.title')}
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                {t('cta.description')}
              </p>
              <Link
                href="/brief"
                className="inline-flex items-center gap-2 rounded-2xl bg-accent px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-black hover:opacity-90 transition-opacity active:scale-95"
              >
                <Zap className="w-4 h-4" />
                {t('cta.button')}
              </Link>
            </motion.div>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}
