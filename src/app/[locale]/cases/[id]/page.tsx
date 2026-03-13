import type { ReactElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { getProjectById, getAllProjects } from "@/lib/portfolio-data";
import { ProjectDetailContent } from "./project-detail-content";
import { StructuredData, generateBreadcrumbStructuredData } from "@/components/seo/structured-data";
import { getTranslations } from "next-intl/server";
import { generateMetadata as generateBaseMetadata } from "@/lib/metadata";
import { routing } from "@/i18n/routing";

type ProjectDetailPageProps = {
  readonly params: Promise<{ readonly id: string; readonly locale: string }>;
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const project = getProjectById(id);
  if (!project) return { title: 'Not Found' };

  const baseUrl = 'https://nanosudo.com';
  const url = locale === routing.defaultLocale
    ? `${baseUrl}/cases/${id}`
    : `${baseUrl}/${locale}/cases/${id}`;
  return generateBaseMetadata({
    title: project.title,
    description: project.shortDescription,
    image: project.image.startsWith('http') ? project.image : `${baseUrl}${project.image}`,
    locale,
    url,
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps): Promise<ReactElement> {
  const { id, locale } = await params;
  const project = getProjectById(id);
  const t = await getTranslations({ locale });

  if (!project) {
    notFound();
  }

  return (
    <SiteShell>
      <StructuredData data={generateBreadcrumbStructuredData([
        { name: t("common.home"), item: "/" },
        { name: t("common.cases"), item: "/cases" },
        { name: project.id.toUpperCase(), item: `/cases/${id}` },
      ])} />
      <main id="main-content" className="flex flex-1 flex-col pt-24 md:pt-32">
        <ProjectDetailContent project={project} />
      </main>
    </SiteShell>
  );
}

// Generate static params for all projects
export async function generateStaticParams(): Promise<Array<{ readonly id: string }>> {
  const projects = getAllProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}
