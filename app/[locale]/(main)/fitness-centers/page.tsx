import type { Metadata } from "next";
import FitnessCentersPage from "@/features/fitness-centers";
import { parseRouteLocale } from "@/lib/i18n/route-locale";
import { createPageMetadata } from "@/lib/seo";
import { getSeoContent } from "@/lib/seo-content";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = parseRouteLocale(localeParam);
  const seo = getSeoContent("fitnessCenters", locale);

  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    pathname: "/fitness-centers",
    locale,
    keywords: seo.keywords,
  });
}

export default async function LocaleFitnessCentersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const raw = params.membership;
  const membership = Array.isArray(raw) ? raw[0] : raw;
  return <FitnessCentersPage membership={membership} />;
}
