import type { Metadata } from "next";
import { TRPCProvider } from "@/lib/trpc/Provider";
import "./globals.css";

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
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
