/**
 * Favicon URL 生成工具
 * 优先使用 Google 服务，失败后回退到国内服务
 */

// Google Favicon 服务
export const getGoogleFaviconUrl = (url: string, size: number = 64): string => {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=${size}`;
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
