import { z } from 'zod';
import { router, protectedProcedure } from '../index';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 设置输入验证 schema
const settingsSchema = z.object({
  appearance: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    backgroundEffect: z.enum(['blob', 'world-map', 'wave', 'blob-scatter', 'layered-peaks', 'layered-steps', 'none']),
    clockFormat: z.enum(['12h', '24h']),
    enableBlur: z.boolean(),
    colorScheme: z.enum(['orange', 'blue', 'green', 'purple', 'pink', 'red', 'cyan', 'yellow', 'indigo', 'teal', 'amber', 'slate']),
  }),
  search: z.object({
    defaultEngine: z.enum(['google', 'bing', 'baidu', 'bingcn', 'github', 'zhihu', 'bilibili']),
    openInNewTab: z.boolean(),
  }),
  bookmarks: z.object({
    showTitle: z.boolean(),
  }),
});

export const settingsRouter = router({
  // 获取用户设置
  get: protectedProcedure.query(async ({ ctx }) => {
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, ctx.userId));

    if (result.length === 0) {
      return null; // 用户还没有保存过设置
    }

    const s = result[0];
    // 转换为客户端格式
    return {
      appearance: {
        theme: s.theme as 'light' | 'dark' | 'system',
        backgroundEffect: s.backgroundEffect as 'blob' | 'world-map' | 'wave' | 'blob-scatter' | 'layered-peaks' | 'layered-steps' | 'none',
        clockFormat: s.clockFormat as '12h' | '24h',
        enableBlur: s.enableBlur,
        colorScheme: s.colorScheme as 'orange' | 'blue' | 'green' | 'purple' | 'pink' | 'red' | 'cyan' | 'yellow' | 'indigo' | 'teal' | 'amber' | 'slate',
      },
      search: {
        defaultEngine: s.defaultEngine as 'google' | 'bing' | 'baidu' | 'bingcn' | 'github' | 'zhihu' | 'bilibili',
        openInNewTab: s.openInNewTab,
      },
      bookmarks: {
        showTitle: s.showTitle,
      },
    };
  }),

  // 保存/更新设置 (upsert)
  save: protectedProcedure
    .input(settingsSchema)
    .mutation(async ({ ctx, input }) => {
      // 检查是否已存在
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.userId, ctx.userId));

      if (existing.length > 0) {
        // 更新
        await db
          .update(settings)
          .set({
            theme: input.appearance.theme,
            backgroundEffect: input.appearance.backgroundEffect,
            clockFormat: input.appearance.clockFormat,
            enableBlur: input.appearance.enableBlur,
            colorScheme: input.appearance.colorScheme,
            defaultEngine: input.search.defaultEngine,
            openInNewTab: input.search.openInNewTab,
            showTitle: input.bookmarks.showTitle,
            updatedAt: new Date(),
          })
          .where(eq(settings.userId, ctx.userId));
      } else {
        // 插入
        await db.insert(settings).values({
          userId: ctx.userId,
          theme: input.appearance.theme,
          backgroundEffect: input.appearance.backgroundEffect,
          clockFormat: input.appearance.clockFormat,
          enableBlur: input.appearance.enableBlur,
          colorScheme: input.appearance.colorScheme,
          defaultEngine: input.search.defaultEngine,
          openInNewTab: input.search.openInNewTab,
          showTitle: input.bookmarks.showTitle,
        });
      }

      return { success: true };
    }),
});
