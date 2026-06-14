import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "@/components/layout/LayoutClient";
import FloatingActions from "@/components/ui/FloatingActions";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://athar.ma";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Athar — Parfums Marocains Authentiques",
    template: "%s | Athar — Parfums du Maroc",
  },
  description:
    "Découvrez les parfums marocains d'exception de la Maison Athar — Oud, Rose et Musc. Livraison partout au Maroc. Paiement à la livraison (COD).",
  keywords: [
    "parfum maroc",
    "parfum oud maroc",
    "athar parfums",
    "parfum marocain",
    "musc maroc",
    "rose dades",
    "oud sauvage",
    "paiement livraison maroc",
  ],
  authors: [{ name: "Athar", url: BASE_URL }],
  creator: "Athar",
  publisher: "Athar Maison de Parfums",

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

  alternates: {
    canonical: BASE_URL,
    languages: { "fr-MA": BASE_URL },
  },

  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: BASE_URL,
    siteName: "Athar — Parfums du Maroc",
    title: "Athar — Parfums Marocains Authentiques",
    description:
      "Découvrez les parfums marocains d'exception de la Maison Athar. Livraison COD partout au Maroc.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Athar — Maison de Parfums Marocains",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Athar — Parfums Marocains Authentiques",
    description:
      "Parfums d'exception issus de la tradition marocaine. Paiement à la livraison.",
    images: ["/og-image.jpg"],
    creator: "@atharparfums",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning className="min-h-full flex flex-col antialiased">
        <LayoutClient>
          {children}
        </LayoutClient>
        <FloatingActions />
      </body>
    </html>
  );
}
