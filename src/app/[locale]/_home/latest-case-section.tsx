"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { getTranslatedProject } from "@/lib/portfolio-data";
import { fadeInUp, staggerContainer, getViewportSettings } from "./animations";

export function LatestCaseSection(): ReactElement {
  const t = useTranslations();
  const project = getTranslatedProject("egemen-kz", t);
  if (!project) return <></>;

  return (
    <section className="border-t border-border/60 py-section overflow-hidden">
      <Container>
        <motion.div className="space-y-10" initial="initial" whileInView="animate" viewport={getViewportSettings(0.1)} variants={staggerContainer}>
          <motion.div className="space-y-3 text-center" variants={fadeInUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">{t("home.latestCase.label")}</p>
            <h2 className="font-heading text-3xl md:text-4xl">{t("home.latestCase.title")}</h2>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Link href="/cases/egemen-kz" className="group block rounded-3xl overflow-hidden glass-card border-border/60 hover:border-accent/60 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="grid md:grid-cols-2 min-h-[420px]">
                <div className="relative overflow-hidden bg-linear-to-br from-accent/20 to-accent/5 min-h-[260px] md:min-h-0">
                  <Image src={project.image} alt={project.imageAlt} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-surface/60 hidden md:block" />
                  <div className="absolute top-4 left-4 rounded-full border border-border/60 bg-surface/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-muted-foreground">{project.year}</div>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">{project.category}</span>
                    <span className="text-xs text-muted-foreground">{t("home.latestCase.newLabel")}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-heading text-2xl md:text-3xl group-hover:text-accent transition-colors leading-tight">{project.title}</h3>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">{project.description}</p>
                  </div>
                  {project.metrics && (
                    <div className="grid grid-cols-2 gap-3">
                      {project.metrics.slice(0, 4).map((metric) => (
                        <div key={metric.label} className="rounded-xl border border-border/60 bg-surface/60 p-3 space-y-0.5">
                          <p className="text-lg font-bold text-accent">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">{tag}</span>
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
          <motion.div className="text-center" variants={fadeInUp}>
            <Link href="/cases" className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface/80 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-accent hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              {t("common.cta.viewAllCases")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
