import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import PwaRegistrar from "@/components/PwaRegistrar";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | ZwinCar.com",
    default: "ZwinCar.com — Location de Voiture au Maroc Sans Caution CB",
  },
  description: "Louez votre voiture au Maroc sans blocage de carte de crédit. Agences locales vérifiées à Marrakech, Casablanca, Agadir, Tanger et Fès. Livraison aéroport et Riad gratuite. Assistance WhatsApp 24/7.",
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
      <body className={`${jakartaSans.variable} font-sans antialiased bg-[#FAF7F2] text-[#12161E]`}>
        {children}
        <PwaRegistrar />
      </body>
    </html>
  );
}
