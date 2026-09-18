import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import icon from "@/public/Logo.png";
import { QueryProvider } from "@/lib/providers/query-provider";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { createAbsoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";
import { defaultLocale, normalizeLocale } from "@/lib/i18n/config";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter-family",
  display: "swap",
});

const manrope = localFont({
  src: "./fonts/Manrope-Variable.ttf",
  variable: "--font-manrope-family",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  applicationName: SITE_NAME,
  title: {
    default: "FitNest",
    template: "%s | FitNest",
  },
  description:
    "FitNest ilə Bakı və Azərbaycanda idman zalları, fitness mərkəzləri və bir abunəliklə QR giriş.",
  icons: {
    icon: icon.src,
    apple: icon.src,
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const locale = normalizeLocale(
    headerList.get("x-fitnest-locale") ?? defaultLocale,
  );

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: createAbsoluteUrl("/"),
    logo: createAbsoluteUrl(icon.src),
    sameAs: [
      "https://www.instagram.com/fitnest_azerbaijan",
      "https://www.facebook.com/profile.php?id=61584857837005",
      "https://www.linkedin.com/company/fitnest-school",
      "https://www.tiktok.com/@fitnest.azerbaijan",
      "https://www.youtube.com/@FitNestAzerbaijan",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: createAbsoluteUrl("/"),
    inLanguage: ["az", "en", "ru"],
    potentialAction: {
      "@type": "SearchAction",
      target: createAbsoluteUrl(`/${locale}/fitness-centers?q={search_term_string}`),
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={manrope.variable}
    >
      <body
        className={`${inter.variable} ${manrope.variable} ${inter.className} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
