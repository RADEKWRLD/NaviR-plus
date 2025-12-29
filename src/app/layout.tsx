import type { Metadata } from "next";
import localFont from "next/font/local";
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

// 内联脚本：在页面渲染前读取 localStorage 并应用主题（防止闪烁）
const themeScript = `
(function() {
  try {
    var s = localStorage.getItem('navir_settings');
    if (s) {
      var p = JSON.parse(s);
      var t = p.appearance?.theme;
      var c = p.appearance?.colorScheme || 'orange';
      if (t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme:dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
      document.documentElement.setAttribute('data-color-scheme', c);
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={oxanium.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
