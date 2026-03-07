"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Shield, FileText, CreditCard, Eye, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { staggerContainer, getViewportSettings } from "./animations";

type GuaranteeItem = {
  readonly id: string;
  readonly icon: LucideIcon;
};

const guaranteeCardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function GuaranteeCard({ item, t }: { item: GuaranteeItem; t: ReturnType<typeof useTranslations> }): ReactElement {
  const Icon = item.icon;
  return (
    <motion.div
      className="glass-card rounded-2xl p-6 text-center cursor-pointer overflow-hidden relative"
      initial="initial"
      whileInView="animate"
      viewport={getViewportSettings(0.2)}
      variants={guaranteeCardVariants}
      whileHover={{ scale: 1.05, y: -8, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } }}
    >
      <motion.div className="absolute inset-0 bg-linear-to-br from-accent/5 to-accent/10 opacity-0" whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
      <div className="relative z-10">
        <div className="flex justify-center mb-4">
          <motion.div className="rounded-lg bg-accent/10 p-3" whileHover={{ scale: 1.1, opacity: 0.8, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } }}>
            <motion.div whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }}>
              <Icon className="w-8 h-8 text-accent" />
            </motion.div>
          </motion.div>
        </div>
        <h3 className="font-heading text-lg mb-2 text-foreground">{t(`home.guarantees.items.${item.id}.title`)}</h3>
        <p className="text-sm text-muted-foreground">{t(`home.guarantees.items.${item.id}.description`)}</p>
      </div>
    </motion.div>
  );
}

export function GuaranteesSection(): ReactElement {
  const t = useTranslations();
  const guarantees: GuaranteeItem[] = [
    { id: "warranty", icon: Shield },
    { id: "contract", icon: FileText },
    { id: "payment", icon: CreditCard },
    { id: "process", icon: Eye },
  ];

  return (
    <section className="border-t border-border/60 py-section">
      <Container className="space-y-12">
        <motion.div className="space-y-4 text-balance text-center" initial="initial" whileInView="animate" viewport={getViewportSettings(0.1)} variants={staggerContainer}>
          <motion.p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground" variants={guaranteeCardVariants}>{t("home.guarantees.label")}</motion.p>
          <motion.h2 className="font-heading text-3xl md:text-4xl" variants={guaranteeCardVariants}>{t("home.guarantees.title")}</motion.h2>
        </motion.div>
        <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto" initial="initial" whileInView="animate" viewport={getViewportSettings(0.2)} variants={staggerContainer}>
          {guarantees.map((item) => <GuaranteeCard key={item.id} item={item} t={t} />)}
        </motion.div>
      </Container>
    </section>
  );
}
