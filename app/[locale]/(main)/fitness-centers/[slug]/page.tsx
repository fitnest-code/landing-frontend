import type { Metadata } from "next";
import FitnessCenterDetails from "@/features/fitness-centers/components/FitnessCenterDetails";
import { getLandingGymServer } from "@/lib/api/landing";
import { parseRouteLocale } from "@/lib/i18n/route-locale";
import type { Locale } from "@/lib/i18n/config";
import { createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const fallbackCity = (locale: Locale) =>
  locale === "ru" ? "Баку" : locale === "en" ? "Baku" : "Bakı";

const truncate = (text: string, max = 160) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = parseRouteLocale(localeParam);
  const gym = await getLandingGymServer(locale, slug);
  const name =
    gym?.name ??
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  const city = gym?.city?.trim() || fallbackCity(locale);
  const categories = (gym?.categories ?? []).map((item) => item.trim()).filter(Boolean);
  const title =
    locale === "en"
      ? `${name} — gym in ${city}`
      : locale === "ru"
        ? `${name} — спортзал в городе ${city}`
        : `${name} — ${city} idman zalı`;
  const fromApi = gym?.description?.trim();
  const generated =
    locale === "en"
      ? `${name} in ${city}: address, hours, and services on FitNest.${categories.length ? ` ${categories.join(", ")}.` : ""}`
      : locale === "ru"
        ? `${name} в городе ${city}: адрес, часы работы и услуги на FitNest.${categories.length ? ` ${categories.join(", ")}.` : ""}`
        : `${name}, ${city}: ünvan, iş saatları və xidmətlər FitNest-də.${categories.length ? ` ${categories.join(", ")}.` : ""}`;

  return createPageMetadata({
    title,
    description: truncate(fromApi || generated),
    pathname: `/fitness-centers/${slug}`,
    locale,
    keywords: [name, city, "gym", "idman zalı", "FitNest", ...categories],
    image: gym?.coverImageUrl,
  });
}

export default async function LocaleFitnessCenterDetailsPage({
  params,
}: PageProps) {
  const { slug } = await params;
  return <FitnessCenterDetails slug={slug} />;
}
