// Home page — server component. Client sections loaded via dynamic() after initial render.
import type { ReactElement } from "react";
import dynamic from "next/dynamic";
import { SiteShell } from "@/components/layout/site-shell";
import {
  StructuredData,
  generatePersonStructuredData,
  generateWebsiteStructuredData,
  generateOrganizationStructuredData,
  generateServiceStructuredData,
} from "@/components/seo/structured-data";
import { HeroSection } from "./_home/hero-section";

function SectionSkeleton({ className }: { readonly className?: string }): ReactElement {
  return <div className={`animate-pulse bg-surface/40 ${className ?? ""}`} />;
}

const ExpertiseSection = dynamic(
  () => import("./_home/expertise-section").then((m) => ({ default: m.ExpertiseSection })),
  { loading: () => <SectionSkeleton className="min-h-[400px]" /> },
);
const ProcessSection = dynamic(
  () => import("./_home/process-section").then((m) => ({ default: m.ProcessSection })),
  { loading: () => <SectionSkeleton className="min-h-[500px]" /> },
);
const GuaranteesSection = dynamic(
  () => import("./_home/guarantees-section").then((m) => ({ default: m.GuaranteesSection })),
  { loading: () => <SectionSkeleton className="min-h-[400px]" /> },
);
const LatestCaseSection = dynamic(
  () => import("./_home/latest-case-section").then((m) => ({ default: m.LatestCaseSection })),
  { loading: () => <SectionSkeleton className="min-h-[420px]" /> },
);
const FinalCTASection = dynamic(
  () => import("./_home/final-cta-section").then((m) => ({ default: m.FinalCTASection })),
  { loading: () => <SectionSkeleton className="min-h-[300px]" /> },
);
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
      <StructuredData data={generateOrganizationStructuredData()} />
      <StructuredData data={generateServiceStructuredData()} />
      <main id="main-content" className="flex flex-1 flex-col">
        <HeroSection />
        <div className="content-auto">
          <ExpertiseSection />
        </div>
        <div className="content-auto">
          <ProcessSection />
        </div>
        <div className="content-auto">
          <GuaranteesSection />
        </div>
        <div className="content-auto">
          <LatestCaseSection />
        </div>
        <div className="content-auto">
          <FinalCTASection />
        </div>
      </main>
      <ScrollButtons />
    </SiteShell>
  );
}
