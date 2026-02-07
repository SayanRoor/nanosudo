"use client";

import { type ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import {
  Github,
  Mail,
  Send,
  MessageCircle,
  Instagram,
  Linkedin,
  FileText,
  Briefcase,
  User,
  BookOpen,
  MessageSquare,
  ArrowUpRight,
  Globe,
  MapPin,
} from "lucide-react";

import { useTheme } from "@/components/theme/theme-provider";
import { Container } from "./container";
import { MapWidget } from "@/components/map-widget";


const currentYear = new Date().getFullYear();

export function SiteFooter(): ReactElement {
  const t = useTranslations();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedTheme = (mounted ? theme : "dark") ?? "dark";
  const logoSrc = resolvedTheme === "light" ? "/Nanosudo_logo_dark.png" : "/Nanosudo_logo_light.png";

  return (
    <footer className="relative pt-20 pb-10 border-t border-border/10 overflow-hidden bg-background">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="mesh-gradient opacity-10 dark:opacity-20 translate-y-24">
          <div className="mesh-orb w-[800px] h-[800px] -bottom-1/2 -right-1/4 bg-accent/10" />
          <div className="mesh-orb w-[600px] h-[600px] top-0 -left-1/4 bg-secondary/5" />
        </div>
      </div>

      <div className="w-full">
        <Container className="relative z-10 space-y-12">
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* 1. BRANDING CARD (8 COLS) */}
            <div className="md:col-span-12 lg:col-span-8 glass-card rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden group border-border/40 flex flex-col justify-center min-h-[450px]">
              <div className="relative z-10 space-y-12">
                <Link href="/" className="inline-block group/logo outline-none">
                  <Image
                    src={logoSrc}
                    alt="NANOSUDO"
                    width={200}
                    height={60}
                    className="h-10 w-auto object-contain transition-transform duration-500 group-hover/logo:scale-105"
                  />
                </Link>

                <div className="space-y-6">
                  <h2 className="text-foreground tracking-tighter leading-[0.9]">
                    FULL STACK <span className="text-accent">DEVELOPER</span> AT SCALE<span className="text-accent">.</span>
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed max-w-2xl font-medium">
                    {t('footer.branding.description')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <Link href="/brief" className="group/btn relative">
                    <div className="px-10 py-5 rounded-full bg-accent text-black font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-500 group-hover/btn:scale-105 group-hover/btn:shadow-2xl group-hover/btn:shadow-accent/40 active:scale-95">
                      {t('common.cta.cost')}
                    </div>
                  </Link>
                  <div className="w-14 h-14 rounded-full border border-border/80 flex items-center justify-center transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent/5">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/5 blur-[100px] rounded-full" />
              <div className="absolute top-12 right-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 pointer-events-none">
                <Globe className="w-80 h-80" />
              </div>
            </div>

            {/* 2. ASIDE (4 COLS) - STACKED CARDS */}
            <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-8">
              {/* TIME CARD */}
              <div className="glass-card rounded-[2.5rem] p-8 flex flex-col border-border/40 hover:border-accent/20 transition-all duration-500 relative overflow-hidden flex-1 group min-h-[300px]">
                <div className="space-y-4 mb-6">
                  <h3 className="label-caps">{t('footer.widgets.location.title')}</h3>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-accent/5 border border-accent/20 w-fit">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-accent">Almaty, Dostyk 132B</span>
                  </div>
                </div>

                <div className="relative flex-1 rounded-2xl overflow-hidden border border-border/40">
                  <MapWidget className="absolute inset-0" />
                </div>
              </div>

              {/* CONTACT CARD */}
              <div className="glass-card rounded-[2.5rem] p-8 border-border/40 hover:border-accent/20 transition-all duration-500 overflow-hidden relative group flex-1">
                <h3 className="label-caps mb-8">{t('footer.widgets.contact.title')}</h3>
                <div className="space-y-8 relative z-10">
                  <a href="mailto:roorsayan@gmail.com" className="group/link block">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1">{t('footer.widgets.contact.emailLabel')}</p>
                    <p className="text-base font-heading font-bold text-foreground group-hover/link:text-accent transition-colors break-all leading-tight">ROORSAYAN@GMAIL.COM</p>
                  </a>
                  <div className="flex gap-4">
                    {[
                      { icon: Github, href: "https://github.com/SayanWD" },
                      { icon: Linkedin, href: "https://www.linkedin.com/in/sayan-roor/" },
                      { icon: Instagram, href: "https://instagram.com/satoshi_iam" },
                      { icon: Send, href: "https://t.me/satoshi_iam" },
                    ].map((social, i) => (
                      <a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/20 border border-border/50 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300"
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
                <Send className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.03] text-accent rotate-12 transition-transform duration-700 group-hover:scale-110" />
              </div>
            </div>

            {/* 3. EXPLORE CARD (12 COLS) */}
            <div className="md:col-span-12 glass-card rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-border/40 overflow-hidden relative">
              <div className="shrink-0">
                <h3 className="label-caps">{t('footer.widgets.explore.title')}</h3>
              </div>
              <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 relative z-10 w-full md:w-auto">
                {[
                  { label: t('common.nav.cases'), href: "/cases" },
                  { label: t('common.nav.about'), href: "/about" },
                  { label: t('common.nav.blog'), href: "/blog" },
                  { label: t('common.nav.contact'), href: "/contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as any}
                      className="group flex items-center gap-2 text-xl md:text-2xl font-heading font-black text-foreground hover:text-accent transition-all duration-300"
                    >
                      <span className="uppercase tracking-tighter">{link.label}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-accent/[0.02] blur-3xl rounded-full pointer-events-none" />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-10">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 text-center md:text-left flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span>© {currentYear} NANOSUDO<span className="text-accent/40">.</span></span>
              <span className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground/30 shrink-0">
                Designed & Developed by Sayan Roor
              </span>
            </p>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
              <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                <Link href="/privacy-policy" className="hover:text-accent transition-colors duration-300">
                  {t('common.footer.privacyPolicy')}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
