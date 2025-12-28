import { z } from 'zod';
import { router, protectedProcedure } from '../index';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { TRPCError } from '@trpc/server';

export const accountRouter = router({
  // 更新用户名
  updateName: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(50) }))
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .update(users)
        .set({ name: input.name })
        .where(eq(users.id, ctx.userId))
        .returning();
      return result[0];
    }),

  // 更新邮箱 (需要验证密码)
  updateEmail: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        currentPassword: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 获取当前用户
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.userId));
      if (!user[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // 验证当前密码
      const isValid = await bcrypt.compare(input.currentPassword, user[0].password);
      if (!isValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid password',
        });
      }

      // 检查邮箱是否已被使用
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email));
      if (existing.length > 0 && existing[0].id !== ctx.userId) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email already in use',
        });
      }

      const result = await db
        .update(users)
        .set({ email: input.email })
        .where(eq(users.id, ctx.userId))
        .returning();
      return result[0];
    }),

  // 更新密码
  updatePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 获取当前用户
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.userId));
      if (!user[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // 验证当前密码
      const isValid = await bcrypt.compare(input.currentPassword, user[0].password);
      if (!isValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid current password',
        });
      }

      // 加密新密码
      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, ctx.userId));

      return { success: true };
    }),

  // 删除账户
  deleteAccount: protectedProcedure
    .input(z.object({ password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 获取当前用户
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.userId));
      if (!user[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // 验证密码
      const isValid = await bcrypt.compare(input.password, user[0].password);
      if (!isValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid password',
        });
      }

      // 删除用户 (书签会通过 onDelete: 'cascade' 自动删除)
      await db.delete(users).where(eq(users.id, ctx.userId));

      return { success: true };
    }),
});
