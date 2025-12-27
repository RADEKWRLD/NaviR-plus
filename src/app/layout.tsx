import type { Metadata } from "next";
import localFont from "next/font/local";
import { TRPCProvider } from "@/lib/trpc/Provider";
import "./globals.css";

const plaster = localFont({
  src: "../../public/Plaster-Regular.ttf",
  variable: "--font-plaster",
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
      <body className={plaster.variable}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
