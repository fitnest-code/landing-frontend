import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { addLocaleToPathname } from "@/lib/i18n/config";
import { parseRouteLocale } from "@/lib/i18n/route-locale";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function LocaleFitMarketDetailsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = parseRouteLocale(localeParam) as Locale;
  redirect(addLocaleToPathname("/fit-market", locale));
}
