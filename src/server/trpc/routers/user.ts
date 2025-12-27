import { z } from 'zod';
import { router, publicProcedure } from '../index';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const userRouter = router({
  // 根据 ID 查询
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
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
      return db.insert(users).values(input).returning();
    }),

  // 更新用户
  update: publicProcedure
    .input(z.object({
      id: z.number(),
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
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.delete(users).where(eq(users.id, input.id)).returning();
    }),
});
