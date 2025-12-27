import type { Metadata } from "next";
import localFont from "next/font/local";
import { TRPCProvider } from "@/lib/trpc/Provider";
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
    <html lang="zh">
      <body className={oxanium.variable}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
