"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { fadeInUp, staggerContainer, getViewportSettings } from "./animations";

export function FinalCTASection(): ReactElement {
  const t = useTranslations();
  return (
    <section className="py-section">
      <Container className="max-w-4xl">
        <motion.div className="space-y-10 text-balance" initial="initial" whileInView="animate" viewport={getViewportSettings(0.1)} variants={staggerContainer}>
          <motion.div className="space-y-4 text-center" variants={fadeInUp}>
            <motion.p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground" variants={fadeInUp}>{t("home.finalCta.label")}</motion.p>
            <motion.h2 className="font-heading text-3xl md:text-4xl lg:text-5xl" variants={fadeInUp}>{t("home.finalCta.title")}</motion.h2>
            <motion.p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto" variants={fadeInUp}>{t("home.finalCta.description")}</motion.p>
          </motion.div>
          <motion.div className="rounded-3xl border-2 border-accent/40 bg-linear-to-br from-accent/10 via-accent/5 to-surface/40 p-8 md:p-12 shadow-soft text-center" variants={fadeInUp}>
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="rounded-xl bg-accent p-3 w-fit mx-auto">
                <Send className="w-7 h-7 text-accent-foreground" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 text-left">
                {([1, 2, 3, 4] as const).map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground">{t(`home.finalCta.benefits.item${i}`)}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{t("home.finalCta.subtitle")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/brief" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 text-base font-semibold normal-case text-accent-foreground shadow-soft transition-all hover:bg-accent/90 hover:shadow-lg hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
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
