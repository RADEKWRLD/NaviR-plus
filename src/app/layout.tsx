import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/Providers";
import "./globals.css";

const oxanium = localFont({
  src: "../../public/Oxanium/Oxanium-VariableFont_wght.ttf",
  variable: "--font-oxanium",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NaviR",
  description: "A minimalist navigate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={oxanium.variable}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
