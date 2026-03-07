"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { fadeInUp, staggerContainer, getViewportSettings } from "./animations";

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

const processStepCardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function ProcessStepCard({ step, t }: ProcessStepCardProps): ReactElement {
  return (
    <motion.article
      className="glass-card rounded-2xl p-6 cursor-pointer overflow-hidden relative group h-full flex flex-col"
      variants={processStepCardVariants}
      whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } }}
    >
      <motion.div className="absolute inset-0 bg-linear-to-br from-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 space-y-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-5xl font-heading font-black text-accent/20 group-hover:text-accent/40 transition-colors">{step.number}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1 rounded-full bg-muted/30">{step.duration}</span>
        </div>
        <h3 className="font-heading text-xl font-bold leading-tight min-h-[56px] flex items-center">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed min-h-[80px]">{t(`home.process.steps.${step.id}.description`)}</p>
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 space-y-1 mt-auto">
          <p className="text-[10px] font-black uppercase tracking-wider text-accent">{t("home.process.outputLabel")}</p>
          <p className="text-xs text-foreground/80 font-medium min-h-[32px]">{t(`home.process.steps.${step.id}.output`)}</p>
        </div>
      </div>
    </motion.article>
  );
}

export function ProcessSection(): ReactElement {
  const t = useTranslations();
  const steps = [
    { id: "consult", number: "01", title: t("home.process.steps.consult.title"), description: "", duration: t("home.process.steps.consult.duration"), output: "" },
    { id: "scope", number: "02", title: t("home.process.steps.scope.title"), description: "", duration: t("home.process.steps.scope.duration"), output: "" },
    { id: "development", number: "03", title: t("home.process.steps.development.title"), description: "", duration: t("home.process.steps.development.duration"), output: "" },
    { id: "launch", number: "04", title: t("home.process.steps.launch.title"), description: "", duration: t("home.process.steps.launch.duration"), output: "" },
  ];

  return (
    <section id="process" className="relative border-t border-border/60 py-section overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/30" />
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-[#99b9ff] opacity-20 blur-3xl dark:opacity-10" />
        <div className="absolute -right-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-[#78ffd1] opacity-15 blur-3xl dark:opacity-[0.08]" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[550px] w-[550px] rounded-full bg-[#ffb3c2] opacity-15 blur-3xl dark:opacity-[0.08]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[450px] w-[450px] rounded-full bg-[#f0ffa6] opacity-12 blur-3xl dark:opacity-[0.06]" />
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>
      <Container className="relative z-10 space-y-12">
        <motion.div className="space-y-4 text-balance text-center" initial="initial" whileInView="animate" viewport={getViewportSettings(0.1)} variants={staggerContainer}>
          <motion.p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground" variants={fadeInUp}>{t("home.process.label")}</motion.p>
          <motion.h2 className="font-heading text-3xl md:text-4xl" variants={fadeInUp}>{t("home.process.title")}</motion.h2>
          <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeInUp}>
            {t.rich("home.process.description", { highlight: (chunks) => <span className="font-semibold text-foreground">{chunks}</span> })}
          </motion.p>
        </motion.div>
        <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto" initial="initial" whileInView="animate" viewport={getViewportSettings(0.15)} variants={staggerContainer}>
          {steps.map((step) => <ProcessStepCard key={step.id} step={step} t={t} />)}
        </motion.div>
      </Container>
    </section>
  );
}
