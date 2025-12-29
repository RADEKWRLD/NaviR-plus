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
// 使用 visibility 而不是 opacity，因为 visibility:hidden 不会触发布局
const themeScript = `
(function() {
  var d = document.documentElement;
  try {
    var s = localStorage.getItem('navir_settings');
    if (s) {
      var p = JSON.parse(s);
      var t = p.appearance?.theme;
      var c = p.appearance?.colorScheme || 'orange';
      if (t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme:dark)').matches)) {
        d.classList.add('dark');
      }
      d.setAttribute('data-color-scheme', c);
    }
  } catch(e) {}
  // 标记主题已加载，移除隐藏状态
  d.classList.add('theme-loaded');
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="theme-loading" suppressHydrationWarning>
      <head>
        {/* 关键：在 CSS 加载前隐藏页面，防止闪烁 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.theme-loading { visibility: hidden; }
              html.theme-loaded { visibility: visible; }
            `,
          }}
        />
        {/* 主题初始化脚本 */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={oxanium.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
