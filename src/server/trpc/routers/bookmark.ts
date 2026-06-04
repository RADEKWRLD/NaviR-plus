import { z } from 'zod';
import { router, protectedProcedure } from '../index';
import { db } from '@/db';
import { bookmarks } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { deleteIconIfOurs } from '@/lib/r2';

// 书签输入验证 schema
const bookmarkSchema = z.object({
  clientId: z.string(),
  title: z.string().min(1),
  url: z.string(),
  iconUrl: z.string().nullable().optional(),
  position: z.number().int().min(0),
  pinnedToHome: z.boolean().optional(),
  createdAt: z.string().optional(),
});

const bookmarkArraySchema = z.array(bookmarkSchema);

async function safeDeleteIcon(url: string | null | undefined) {
  try {
    await deleteIconIfOurs(url);
  } catch (err) {
    console.error('Icon cleanup failed:', err);
  }
}

export const bookmarkRouter = router({
  // 获取当前用户的所有书签
  list: protectedProcedure.query(async ({ ctx }) => {
    const result = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, ctx.userId))
      .orderBy(asc(bookmarks.position));

    return result.map((b) => ({
      id: b.clientId,
      title: b.title,
      url: b.url,
      iconUrl: b.iconUrl,
      position: b.position,
      pinnedToHome: b.pinnedToHome,
      createdAt: b.createdAt?.toISOString() || new Date().toISOString(),
    }));
  }),

  // 批量同步 (用于登录时覆盖云端数据)
  syncAll: protectedProcedure
    .input(bookmarkArraySchema)
    .mutation(async ({ ctx, input }) => {
      const oldRows = await db
        .select()
        .from(bookmarks)
        .where(eq(bookmarks.userId, ctx.userId));

      const newIconUrls = new Set(
        input.map((b) => b.iconUrl).filter((u): u is string => !!u),
      );

      await db.delete(bookmarks).where(eq(bookmarks.userId, ctx.userId));

      if (input.length > 0) {
        await db.insert(bookmarks).values(
          input.map((b) => ({
            userId: ctx.userId,
            clientId: b.clientId,
            title: b.title,
            url: b.url,
            iconUrl: b.iconUrl ?? null,
            position: b.position,
            pinnedToHome: b.pinnedToHome ?? false,
            createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
            updatedAt: new Date(),
          })),
        );
      }

      await Promise.all(
        oldRows
          .filter((r) => r.iconUrl && !newIconUrls.has(r.iconUrl))
          .map((r) => safeDeleteIcon(r.iconUrl)),
      );

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
          iconUrl: input.iconUrl ?? null,
          position: input.position,
          pinnedToHome: input.pinnedToHome ?? false,
          createdAt: input.createdAt ? new Date(input.createdAt) : new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return {
        id: result.clientId,
        title: result.title,
        url: result.url,
        iconUrl: result.iconUrl,
        position: result.position,
        pinnedToHome: result.pinnedToHome,
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
        iconUrl: z.string().nullable().optional(),
        pinnedToHome: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [old] = await db
        .select()
        .from(bookmarks)
        .where(
          and(eq(bookmarks.userId, ctx.userId), eq(bookmarks.clientId, input.clientId)),
        );
      if (!old) {
        throw new Error('Bookmark not found');
      }

      const { clientId, ...patch } = input;

      const [result] = await db
        .update(bookmarks)
        .set({
          ...patch,
          updatedAt: new Date(),
        })
        .where(
          and(eq(bookmarks.userId, ctx.userId), eq(bookmarks.clientId, clientId)),
        )
        .returning();

      if ('iconUrl' in input && old.iconUrl !== input.iconUrl) {
        await safeDeleteIcon(old.iconUrl);
      }

      return {
        id: result.clientId,
        title: result.title,
        url: result.url,
        iconUrl: result.iconUrl,
        position: result.position,
        pinnedToHome: result.pinnedToHome,
        createdAt: result.createdAt?.toISOString() || new Date().toISOString(),
      };
    }),

  // 删除书签
  delete: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [old] = await db
        .select()
        .from(bookmarks)
        .where(
          and(eq(bookmarks.userId, ctx.userId), eq(bookmarks.clientId, input.clientId)),
        );

      await db
        .delete(bookmarks)
        .where(
          and(
            eq(bookmarks.userId, ctx.userId),
            eq(bookmarks.clientId, input.clientId),
          ),
        );

      if (old) await safeDeleteIcon(old.iconUrl);

      return { success: true };
    }),

  // 批量更新位置 (用于拖拽排序)
  reorder: protectedProcedure
    .input(
      z.array(
        z.object({
          clientId: z.string(),
          position: z.number().int().min(0),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.map((item) =>
          db
            .update(bookmarks)
            .set({ position: item.position, updatedAt: new Date() })
            .where(
              and(
                eq(bookmarks.userId, ctx.userId),
                eq(bookmarks.clientId, item.clientId),
              ),
            ),
        ),
      );

      return { success: true };
    }),
});
