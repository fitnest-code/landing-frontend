import type { Metadata } from "next";
import ElaqeLinksPage from "@/features/elaqe";
import { parseRouteLocale } from "@/lib/i18n/route-locale";
import { createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = parseRouteLocale(localeParam);

  return createPageMetadata({
    title: "Əlaqə",
    description:
      "FitNest App Store, Google Play və WhatsApp əlaqə linkləri — bir səhifədə.",
    pathname: "/elaqe",
    locale,
    keywords: ["FitNest", "Əlaqə", "App Store", "Google Play", "WhatsApp"],
  });
}

export default function ElaqePage() {
  return <ElaqeLinksPage />;
}
