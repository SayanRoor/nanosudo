"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BrainCircuit, Code, Link2, Zap } from "lucide-react";
import { Container } from "@/components/layout/container";
import { fadeInUp, staggerContainer, getViewportSettings } from "./animations";

export function ExpertiseSection(): ReactElement {
  const t = useTranslations();
  const expertise = [
    { id: "ai", icon: BrainCircuit },
    { id: "dev", icon: Code },
    { id: "integrations", icon: Link2 },
    { id: "performance", icon: Zap },
  ];

  return (
    <section id="expertise" className="relative py-section">
      <Container className="space-y-12 md:space-y-16">
        <motion.div
          className="space-y-4 text-center max-w-3xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.p className="text-xs font-bold uppercase tracking-[0.2em] text-accent" variants={fadeInUp}>
            {t("home.expertise.label")}
          </motion.p>
          <motion.h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold" variants={fadeInUp}>
            {t("home.expertise.title")}
          </motion.h2>
          <motion.p className="text-base md:text-lg text-muted-foreground leading-relaxed" variants={fadeInUp}>
            {t("home.expertise.description")}
          </motion.p>
        </motion.div>

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
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-accent/80 via-accent/40 to-transparent" />
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/10 ring-1 ring-accent/20 group-hover:bg-accent/20 group-hover:ring-accent/40 group-hover:scale-110 transition-all duration-500">
                  <item.icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
                </div>
                <div className="space-y-3">
                  <h3 className="font-heading text-2xl font-bold leading-tight text-foreground group-hover:text-accent transition-colors duration-300">
                    {t(`home.expertise.items.${item.id}.title`)}
                  </h3>
                  <p className="text-base text-muted-foreground/90 leading-relaxed">
                    {t(`home.expertise.items.${item.id}.description`)}
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-all duration-500" />
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
