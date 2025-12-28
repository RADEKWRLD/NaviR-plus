import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { Session } from 'next-auth';

// tRPC Context 类型定义
export interface TRPCContext {
  session: Session | null;
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// 受保护的 procedure (需要登录)
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: '请先登录',
    });
  }
  return next({
    ctx: {
      session: ctx.session,
      userId: ctx.session.user.id, // UUID 字符串
    },
  });
});
