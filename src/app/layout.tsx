import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Lora, JetBrains_Mono, Space_Grotesk, Bebas_Neue, Playfair_Display, Orbitron } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Providers from "@/components/Providers";
import "./globals.css";

const oxanium = localFont({
  src: "../../public/Oxanium/Oxanium-VariableFont_wght.ttf",
  variable: "--font-oxanium",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
  weight: "400",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NaviR - Minimalist Bookmark Navigator",
    template: "%s | NaviR"
  },
  description: "NaviR is a minimalist personal navigation tool that helps you efficiently manage bookmarks and quickly access your favorite websites.",
  keywords: ["bookmark manager", "navigation", "startpage", "minimalist", "NaviR"],
  metadataBase: new URL("https://navir.icu"),
  openGraph: {
    title: "NaviR - Minimalist Bookmark Navigator",
    description: "A minimalist personal navigation tool for efficient bookmark management",
    url: "https://navir.icu",
    siteName: "NaviR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NaviR - Minimalist Bookmark Navigator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NaviR - Minimalist Bookmark Navigator",
    description: "A minimalist personal navigation tool for efficient bookmark management",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://navir.icu",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NaviR',
    description: 'A minimalist personal navigation tool for efficient bookmark management',
    url: 'https://navir.icu',
    applicationCategory: 'UtilitiesApplication',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${oxanium.variable} ${inter.variable} ${lora.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${bebasNeue.variable} ${playfair.variable} ${orbitron.variable}`}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
