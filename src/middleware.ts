import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 处理预检请求
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    setCorsHeaders(response, request);
    return response;
  }

  const response = NextResponse.next();
  setCorsHeaders(response, request);
  return response;
}

function setCorsHeaders(response: NextResponse, request: NextRequest) {
  const origin = request.headers.get('origin');

  // 允许 Chrome 扩展和本地开发
  if (
    origin?.startsWith('chrome-extension://') ||
    origin?.startsWith('http://localhost') ||
    origin?.startsWith('https://navir.icu')
  ) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
  }
}

export const config = {
  matcher: '/api/:path*',
};
