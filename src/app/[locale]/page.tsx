// Home page — server component. Client sections loaded via dynamic() after initial render.
import type { ReactElement } from "react";
import dynamic from "next/dynamic";
import { SiteShell } from "@/components/layout/site-shell";
import {
  StructuredData,
  generatePersonStructuredData,
  generateWebsiteStructuredData,
  generateServiceStructuredData,
} from "@/components/seo/structured-data";
import { HeroSection } from "./_home/hero-section";

const ExpertiseSection = dynamic(() => import("./_home/expertise-section").then((m) => ({ default: m.ExpertiseSection })));
const ProcessSection = dynamic(() => import("./_home/process-section").then((m) => ({ default: m.ProcessSection })));
const GuaranteesSection = dynamic(() => import("./_home/guarantees-section").then((m) => ({ default: m.GuaranteesSection })));
const LatestCaseSection = dynamic(() => import("./_home/latest-case-section").then((m) => ({ default: m.LatestCaseSection })));
const FinalCTASection = dynamic(() => import("./_home/final-cta-section").then((m) => ({ default: m.FinalCTASection })));
const ScrollButtons = dynamic(() => import("./_home/scroll-buttons").then((m) => ({ default: m.ScrollButtons })));

type HomeProps = {
  readonly params: Promise<{ readonly locale: string }>;
};

export default async function Home({ params }: HomeProps): Promise<ReactElement> {
  const { locale } = await params;

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
      <ScrollButtons />
    </SiteShell>
  );
}
