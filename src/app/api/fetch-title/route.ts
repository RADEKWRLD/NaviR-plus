import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      signal: AbortSignal.timeout(5000),
    });

    const html = await response.text();

    // 提取 title 标签内容
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    if (titleMatch && titleMatch[1]) {
      const title = titleMatch[1].trim();
      return NextResponse.json({ title });
    }

    // 尝试从 og:title 获取
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    if (ogTitleMatch && ogTitleMatch[1]) {
      return NextResponse.json({ title: ogTitleMatch[1].trim() });
    }

    // 如果没有找到标题，返回域名
    const urlObj = new URL(url);
    return NextResponse.json({ title: urlObj.hostname.replace('www.', '') });
  } catch {
    // 请求失败，返回域名作为默认标题
    try {
      const urlObj = new URL(url);
      return NextResponse.json({ title: urlObj.hostname.replace('www.', '') });
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
  }
}
