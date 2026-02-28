# NaviR+ - Claude Code 上下文

个性化浏览器主页，Next.js 16 全栈应用。详细架构见 ARCH.md。

## 技术栈

Next.js 16 / React 19 / TypeScript / PostgreSQL (Neon Serverless) / Drizzle ORM / tRPC 11 / NextAuth 5 (JWT) / Tailwind CSS 4 / GSAP / Zod

## 常用命令

```bash
npm run dev           # 开发服务器
npm run build         # 生产构建
npm run lint          # ESLint 检查
npm run db:push       # 推送 schema 到数据库
npm run db:generate   # 生成迁移文件
npm run db:migrate    # 执行迁移
npm run db:studio     # Drizzle Studio
```

## 关键文件路径

- 数据库 Schema: `src/db/schema.ts`
- tRPC 路由聚合: `src/server/trpc/router.ts`
- tRPC 初始化 + procedure: `src/server/trpc/index.ts`
- 各 tRPC Router: `src/server/trpc/routers/` (user, bookmark, account, settings)
- NextAuth 配置: `src/lib/auth/index.ts`
- 密码工具: `src/lib/auth/passwordUtils.ts`
- Provider 组装: `src/components/Providers.tsx`
- Context: `src/context/` (AuthContext, BookmarkContext, SettingsContext)
- 默认设置: `src/lib/settings/defaults.ts`
- 类型定义: `src/types/` (settings.ts, bookmark.ts, next-auth.d.ts)
- CORS 中间件: `src/middleware.ts` (仅匹配 `/api/:path*`)

## 开发约定

- 路径别名: `@/*` 映射到 `./src/*`
- 数据库查询使用 Drizzle ORM，schema 定义在 `src/db/schema.ts`
- 修改 schema 后执行 `npm run db:generate && npm run db:migrate`
- API 使用 tRPC，新增路由在 `src/server/trpc/routers/` 下创建并在 `router.ts` 中注册
- 需要认证的 tRPC 过程使用 `protectedProcedure`，从 `ctx.session.user.id` 获取用户 ID
- 密码必须使用 bcrypt 哈希（`hashPassword` / `verifyPassword`），禁止明文存储
- 前端组件按功能分目录放在 `src/components/` 下
- 设置类型定义在 `src/types/settings.ts`，默认值在 `src/lib/settings/defaults.ts`
- `extension/` 目录已从 tsconfig 排除，不参与主项目编译
- 使用 Tailwind CSS 4（通过 `@tailwindcss/postcss` 插件）
- 动画使用 GSAP，配置在 `src/lib/gsap/config.ts`
- 输入校验使用 Zod
