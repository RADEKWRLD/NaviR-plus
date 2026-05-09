/**
 * Favicon URL 生成工具
 * 主链：Favicone（多源抓取：favicon.ico + <link> + manifest icons）
 * 兜底：国内代理服务
 */

// Favicone：服务端会同时查 favicon.ico、<link> 标签和 web manifest 的 icons
export const getFaviconeUrl = (url: string, size: number = 64): string => {
  try {
    const urlObj = new URL(url);
    return `https://favicone.com/${urlObj.hostname}?s=${size}`;
  } catch {
    return '';
  }
};

// 国内备用 Favicon 服务
export const getFallbackFaviconUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `https://api.freejk.com/gongju/favicon/?url=${urlObj.origin}/`;
  } catch {
    return '';
  }
};
