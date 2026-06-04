import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../index';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  BACKGROUND_ALLOWED_TYPES,
  createBackgroundPresignedPutUrl,
  deleteBackgroundIfOurs,
  deleteBackgroundByKey,
  verifyBackgroundObject,
  extractBackgroundKey,
} from '@/lib/r2';

// 设置输入验证 schema
const settingsSchema = z.object({
  appearance: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    backgroundEffect: z.enum(['blob', 'world-map', 'wave', 'blob-scatter', 'layered-peaks', 'layered-steps', 'custom', 'none']),
    clockFormat: z.enum(['12h', '24h']),
    enableBlur: z.boolean(),
    showGrid: z.boolean(),
    showAnimatedText: z.boolean(),
    showTypographicHero: z.boolean(),
    colorScheme: z.enum(['orange', 'blue', 'green', 'purple', 'pink', 'red', 'cyan', 'yellow', 'indigo', 'teal', 'amber', 'slate']),
    customBackgroundUrl: z.url().nullable(),
    uiVariant: z.enum(['solid', 'glass', 'outline', 'minimal']),
    uiFont: z.enum(['oxanium', 'inter', 'lora', 'jetbrains-mono', 'space-grotesk', 'bebas-neue', 'playfair', 'orbitron']),
    showRecentLinks: z.boolean(),
  }),
  search: z.object({
    defaultEngine: z.enum(['google', 'bing', 'baidu', 'bingcn', 'github', 'zhihu', 'bilibili', 'duckduckgo', 'yandex']),
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
        backgroundEffect: s.backgroundEffect as 'blob' | 'world-map' | 'wave' | 'blob-scatter' | 'layered-peaks' | 'layered-steps' | 'custom' | 'none',
        clockFormat: s.clockFormat as '12h' | '24h',
        enableBlur: s.enableBlur,
        showGrid: s.showGrid,
        showAnimatedText: s.showAnimatedText,
        showTypographicHero: s.showTypographicHero,
        colorScheme: s.colorScheme as 'orange' | 'blue' | 'green' | 'purple' | 'pink' | 'red' | 'cyan' | 'yellow' | 'indigo' | 'teal' | 'amber' | 'slate',
        customBackgroundUrl: s.customBackgroundUrl,
        uiVariant: s.uiVariant as 'solid' | 'glass' | 'outline' | 'minimal',
        uiFont: s.uiFont as 'oxanium' | 'inter' | 'lora' | 'jetbrains-mono' | 'space-grotesk' | 'bebas-neue' | 'playfair' | 'orbitron',
        showRecentLinks: s.showRecentLinks,
      },
      search: {
        defaultEngine: s.defaultEngine as 'google' | 'bing' | 'baidu' | 'bingcn' | 'github' | 'zhihu' | 'bilibili' | 'duckduckgo' | 'yandex',
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
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.userId, ctx.userId));

      const newCustomUrl = input.appearance.customBackgroundUrl;
      const oldCustomUrl = existing[0]?.customBackgroundUrl ?? null;

      // 实际落库的背景值（缺失引用时会被优雅置空）
      let effectiveCustomUrl = newCustomUrl;
      let effectiveBackgroundEffect = input.appearance.backgroundEffect;

      // 当 customBackgroundUrl 变化且新值在我们的 R2 桶里时，HeadObject 后置校验
      if (newCustomUrl && newCustomUrl !== oldCustomUrl) {
        const newKey = extractBackgroundKey(newCustomUrl);
        if (newKey) {
          const verify = await verifyBackgroundObject(newKey);
          if (!verify.ok) {
            if (verify.reason === 'missing') {
              // 引用的对象已不存在（如切换数据库分支 / 被清理 / 上传未完成）：
              // 不阻断整次保存，优雅丢弃这张背景图，其余设置照常持久化。
              effectiveCustomUrl = null;
              if (effectiveBackgroundEffect === 'custom') {
                effectiveBackgroundEffect = 'none';
              }
            } else {
              // 真·非法的新上传（超大 / 格式错）：删除并拒绝
              await deleteBackgroundByKey(newKey);
              const reasonMsg =
                verify.reason === 'too_large'
                  ? '图片超出 100MB 上限'
                  : '图片格式不支持';
              throw new TRPCError({ code: 'BAD_REQUEST', message: reasonMsg });
            }
          }
        }
      }

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({
            theme: input.appearance.theme,
            backgroundEffect: effectiveBackgroundEffect,
            clockFormat: input.appearance.clockFormat,
            enableBlur: input.appearance.enableBlur,
            showGrid: input.appearance.showGrid,
            showAnimatedText: input.appearance.showAnimatedText,
            showTypographicHero: input.appearance.showTypographicHero,
            colorScheme: input.appearance.colorScheme,
            customBackgroundUrl: effectiveCustomUrl,
            uiVariant: input.appearance.uiVariant,
            uiFont: input.appearance.uiFont,
            showRecentLinks: input.appearance.showRecentLinks,
            defaultEngine: input.search.defaultEngine,
            openInNewTab: input.search.openInNewTab,
            showTitle: input.bookmarks.showTitle,
            updatedAt: new Date(),
          })
          .where(eq(settings.userId, ctx.userId));

        // 旧背景图与新值不同时，从 R2 删除旧文件
        if (oldCustomUrl && oldCustomUrl !== effectiveCustomUrl) {
          await deleteBackgroundIfOurs(oldCustomUrl);
        }
      } else {
        await db.insert(settings).values({
          userId: ctx.userId,
          theme: input.appearance.theme,
          backgroundEffect: effectiveBackgroundEffect,
          clockFormat: input.appearance.clockFormat,
          enableBlur: input.appearance.enableBlur,
          showGrid: input.appearance.showGrid,
          showAnimatedText: input.appearance.showAnimatedText,
          showTypographicHero: input.appearance.showTypographicHero,
          colorScheme: input.appearance.colorScheme,
          customBackgroundUrl: effectiveCustomUrl,
          uiVariant: input.appearance.uiVariant,
          uiFont: input.appearance.uiFont,
          showRecentLinks: input.appearance.showRecentLinks,
          defaultEngine: input.search.defaultEngine,
          openInNewTab: input.search.openInNewTab,
          showTitle: input.bookmarks.showTitle,
        });
      }

      return { success: true };
    }),

  // 签发自定义背景的 presigned PUT URL（R2 不支持 presigned POST）
  getBackgroundUploadUrl: protectedProcedure
    .input(
      z.object({
        contentType: z.enum(BACKGROUND_ALLOWED_TYPES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return createBackgroundPresignedPutUrl(ctx.userId, input.contentType);
    }),

  // 清理上传到 R2 但未关联到设置的孤儿对象（save 失败的回滚）
  cleanupOrphanBackground: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const expectedPrefix = `backgrounds/${ctx.userId}/`;
      if (!input.key.startsWith(expectedPrefix)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: '无权删除此对象',
        });
      }
      await deleteBackgroundByKey(input.key);
      return { success: true };
    }),
});
