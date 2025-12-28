import { z } from 'zod';
import { router, protectedProcedure } from '../index';
import { db } from '@/db';
import { bookmarks } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

// 书签输入验证 schema
const bookmarkSchema = z.object({
  clientId: z.string(),
  title: z.string().min(1),
  url: z.string(),
  position: z.number().int().min(0),
  createdAt: z.string().optional(),
});

const bookmarkArraySchema = z.array(bookmarkSchema);

export const bookmarkRouter = router({
  // 获取当前用户的所有书签
  list: protectedProcedure.query(async ({ ctx }) => {
    const result = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, ctx.userId))
      .orderBy(asc(bookmarks.position));

    // 转换为客户端格式
    return result.map((b) => ({
      id: b.clientId,
      title: b.title,
      url: b.url,
      position: b.position,
      createdAt: b.createdAt?.toISOString() || new Date().toISOString(),
    }));
  }),

  // 批量同步 (用于登录时覆盖云端数据)
  syncAll: protectedProcedure
    .input(bookmarkArraySchema)
    .mutation(async ({ ctx, input }) => {
      // 1. 删除该用户的所有现有书签
      await db.delete(bookmarks).where(eq(bookmarks.userId, ctx.userId));

      // 2. 批量插入新书签
      if (input.length > 0) {
        await db.insert(bookmarks).values(
          input.map((b) => ({
            userId: ctx.userId,
            clientId: b.clientId,
            title: b.title,
            url: b.url,
            position: b.position,
            createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
            updatedAt: new Date(),
          }))
        );
      }

      return { success: true, count: input.length };
    }),

  // 添加单个书签
  create: protectedProcedure
    .input(bookmarkSchema)
    .mutation(async ({ ctx, input }) => {
      const [result] = await db
        .insert(bookmarks)
        .values({
          userId: ctx.userId,
          clientId: input.clientId,
          title: input.title,
          url: input.url,
          position: input.position,
          createdAt: input.createdAt ? new Date(input.createdAt) : new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return {
        id: result.clientId,
        title: result.title,
        url: result.url,
        position: result.position,
        createdAt: result.createdAt?.toISOString() || new Date().toISOString(),
      };
    }),

  // 更新书签
  update: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        title: z.string().min(1).optional(),
        url: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { clientId, ...data } = input;

      const [result] = await db
        .update(bookmarks)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(
          and(eq(bookmarks.userId, ctx.userId), eq(bookmarks.clientId, clientId))
        )
        .returning();

      if (!result) {
        throw new Error('Bookmark not found');
      }

      return {
        id: result.clientId,
        title: result.title,
        url: result.url,
        position: result.position,
        createdAt: result.createdAt?.toISOString() || new Date().toISOString(),
      };
    }),

  // 删除书签
  delete: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(bookmarks)
        .where(
          and(
            eq(bookmarks.userId, ctx.userId),
            eq(bookmarks.clientId, input.clientId)
          )
        );

      return { success: true };
    }),

  // 批量更新位置 (用于拖拽排序)
  reorder: protectedProcedure
    .input(
      z.array(
        z.object({
          clientId: z.string(),
          position: z.number().int().min(0),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      // 并行更新所有书签位置
      await Promise.all(
        input.map((item) =>
          db
            .update(bookmarks)
            .set({ position: item.position, updatedAt: new Date() })
            .where(
              and(
                eq(bookmarks.userId, ctx.userId),
                eq(bookmarks.clientId, item.clientId)
              )
            )
        )
      );

      return { success: true };
    }),
});
