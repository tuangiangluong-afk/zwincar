import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import PwaRegistrar from "@/components/PwaRegistrar";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "ZwinCar.com — Location Voiture Maroc Sans Caution CB",
  },
  description: "Louez votre voiture au Maroc sans blocage de carte bancaire. Agences locales vérifiées à Marrakech, Casablanca, Agadir, Tanger. 0€ caution franchise zéro.",
  keywords: [
    "location voiture maroc sans caution",
    "location voiture marrakech sans carte de credit",
    "car rental morocco no deposit",
    "louer duster maroc aeroport",
    "location voiture agadir sans franchise",
    "location voiture casablanca aeroport cmn",
    "zwincar maroc",
  ],
  metadataBase: new URL("https://zwincar.com"),
  alternates: {
    canonical: "https://zwincar.com",
    languages: {
      "fr-FR": "https://zwincar.com",
      "en-US": "https://zwincar.com/en",
      "es-ES": "https://zwincar.com/es",
      "nl-NL": "https://zwincar.com/nl",
      "x-default": "https://zwincar.com/en",
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    siteName: "ZwinCar.com",
    title: "ZwinCar.com — Location de Voiture au Maroc Sans Caution CB",
    description: "La plateforme de location au Maroc sans caution bancaire abusive. Agences locales vérifiées et livraison aéroport offerte.",
    locale: "fr_FR",
    type: "website",
    url: "https://zwincar.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZwinCar.com — Location Voiture Maroc Sans Caution",
    description: "0€ bloqué sur carte bancaire. Agences locales vérifiées. Livraison Aéroport & Riad.",
  },
};

export const viewport: Viewport = {
  themeColor: "#C9572C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/hero-morocco-mobile.webp"
          media="(max-width: 768px)"
          fetchPriority="high"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero-morocco.webp"
          media="(min-width: 769px)"
          fetchPriority="high"
          type="image/webp"
        />
      </head>
      <body className={`${jakartaSans.variable} font-sans antialiased bg-[#FAF7F2] text-[#12161E]`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-[#C9572C] text-white px-4 py-2 rounded-xl font-bold shadow-lg focus:outline-none"
        >
          Aller au contenu principal
        </a>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PP5JRZ54"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}
        <PwaRegistrar />
        <CookieBanner />

        {/* Google Tag Manager (GTM-PP5JRZ54) */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-PP5JRZ54"
        />

        {/* Google Analytics (GA4 G-7ENRDH54TP) & dataLayer setup */}
        <Script
          id="ga4-gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7ENRDH54TP', {
                page_path: window.location.pathname,
                currency: 'EUR'
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
