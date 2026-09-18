import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

const FALLBACK_SITE_URL = "https://fitnest.az";
const normalizedSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? FALLBACK_SITE_URL;

export const SITE_URL = new URL(normalizedSiteUrl);
export const SITE_ORIGIN = SITE_URL.origin;
export const SITE_NAME = "FitNest";
export const DEFAULT_OG_IMAGE = "/images/main-page.webp";

const OG_LOCALES: Record<Locale, string> = {
  az: "az_AZ",
  en: "en_US",
  ru: "ru_RU",
};

type CreatePageMetadataInput = {
  title: string;
  description: string;
  pathname: string;
  locale: Locale;
  keywords?: string[];
  noIndex?: boolean;
  image?: string | null;
};

const normalizePathname = (pathname: string): string => {
  if (!pathname) return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
};

const getLocalizedPath = (pathname: string, locale: Locale): string => {
  const safePath = normalizePathname(pathname);
  return safePath === "/" ? `/${locale}` : `/${locale}${safePath}`;
};

export const getLocalizedUrl = (pathname: string, locale: Locale): string =>
  new URL(getLocalizedPath(pathname, locale), SITE_URL).toString();

export const createPageMetadata = ({
  title,
  description,
  pathname,
  locale,
  keywords = [],
  noIndex = false,
  image = DEFAULT_OG_IMAGE,
}: CreatePageMetadataInput): Metadata => {
  const canonical = getLocalizedUrl(pathname, locale);
  const languageAlternates = Object.fromEntries(
    locales.map((lang) => [lang, getLocalizedUrl(pathname, lang)]),
  );
  const ogImage = image?.trim() ? image : DEFAULT_OG_IMAGE;
  const alternateLocale = locales
    .filter((lang) => lang !== locale)
    .map((lang) => OG_LOCALES[lang]);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        ...languageAlternates,
        "x-default": getLocalizedUrl(pathname, defaultLocale),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      alternateLocale,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  };
};

export const createAbsoluteUrl = (pathname: string) => {
  if (/^https?:\/\//i.test(pathname)) return pathname;
  return new URL(pathname, SITE_URL).toString();
};
