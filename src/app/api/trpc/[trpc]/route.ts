import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/trpc/router';
import { auth } from '@/lib/auth';
import { jwtVerify } from 'jose';
import type { TRPCContext } from '@/server/trpc';
import type { Session } from 'next-auth';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

// 验证扩展 Bearer token，返回兼容 Session 的格式
async function verifyExtensionToken(authHeader: string | null): Promise<Session | null> {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const { payload } = await jwtVerify(token, JWT_SECRET);

    return {
      user: {
        id: payload.userId as string,
        name: payload.name as string,
        email: payload.email as string,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  } catch {
    return null;
  }
}

const handler = async (req: Request) => {
  // 优先检查 Bearer token（扩展使用）
  const authHeader = req.headers.get('authorization');
  let session: Session | null = await verifyExtensionToken(authHeader);

  // 回退到 NextAuth session（Web 使用）
  if (!session) {
    session = await auth();
  }

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: (): TRPCContext => ({
      session,
    }),
  });
};

export { handler as GET, handler as POST };
