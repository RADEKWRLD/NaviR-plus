import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../index';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendWelcomeEmail } from '@/lib/email/send-welcome-email';

export const userRouter = router({
  // 根据 ID 查询
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await db.select().from(users).where(eq(users.id, input.id));
      return result[0] ?? null;
    }),

  // 创建用户
  create: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const newUser = await db.insert(users).values(input).returning();

        // 异步发送欢迎邮件（不阻塞注册流程）
        void sendWelcomeEmail({
          to: input.email,
          userName: input.name,
        }).catch((error) => {
          console.error('[Email] Failed to send welcome email:', error);
        });

        return newUser;
      } catch (error: unknown) {
        const dbError = error as { code?: string };
        if (dbError.code === '23505') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email already registered',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Registration failed, please try again',
        });
      }
    }),

  // 更新用户
  update: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.update(users).set(data).where(eq(users.id, id)).returning();
    }),

  // 删除用户
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return db.delete(users).where(eq(users.id, input.id)).returning();
    }),
});
