# NaviR+ 架构文档

## 项目概览

NaviR+ 是一个个性化浏览器主页/新标签页替代方案。用户可以管理书签、切换搜索引擎、自定义外观主题，并通过账户在多设备间同步数据。同时提供 Chrome 扩展支持。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) + React 19 |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 4 + PostCSS |
| 状态管理 | React Context + React Query (via tRPC) |
| API | tRPC 11 |
| 认证 | NextAuth 5 (Credentials + JWT) |
| 数据库 | PostgreSQL (Neon Serverless) + Drizzle ORM |
| 邮件 | Resend + React Email |
| 动画 | GSAP + Split Type |
| 拖拽 | dnd-kit |
| 校验 | Zod |
| 部署 | Vercel |

## 目录结构

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 主页（书签 + 搜索 + 时钟）
│   ├── layout.tsx                # 根布局（字体、元数据、Providers）
│   ├── auth/page.tsx             # 登录/注册页
│   ├── privacy/page.tsx          # 隐私政策
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth 处理器
│       ├── auth/extension-login/ # 扩展登录（JWT 签发）
│       ├── auth/validate/        # Token 验证
│       ├── trpc/[trpc]/          # tRPC 端点
│       └── fetch-title/          # 网页标题抓取
│
├── components/                   # React 组件
│   ├── auth/                     # 登录/注册表单
│   ├── bookmarks/                # 书签网格、模态框、拖拽
│   ├── background/               # 7 种动态背景效果
│   ├── settings/                 # 设置面板（外观/搜索/书签/账户/数据）
│   ├── search/                   # 搜索栏 + 引擎切换
│   ├── clock/                    # 时钟显示
│   ├── header/                   # 顶栏图标
│   ├── typography/               # 排版动画（GSAP）
│   ├── icons/                    # 图标组件
│   ├── common/                   # 通用组件
│   └── Providers.tsx             # Context Provider 组装
│
├── context/                      # React Context
│   ├── AuthContext.tsx            # 认证状态
│   ├── BookmarkContext.tsx        # 书签状态 + 本地/云端同步
│   └── SettingsContext.tsx        # 设置状态 + 主题应用
│
├── server/trpc/                  # tRPC 后端
│   ├── index.ts                  # tRPC 初始化 + procedure 定义
│   ├── router.ts                 # 路由聚合
│   └── routers/
│       ├── user.ts               # 用户 CRUD
│       ├── bookmark.ts           # 书签 CRUD + 排序 + 批量同步
│       ├── account.ts            # 账户管理（改名/改邮箱/改密码/注销）
│       └── settings.ts           # 设置读写（upsert）
│
├── db/
│   ├── schema.ts                 # Drizzle ORM Schema
│   └── index.ts                  # 数据库连接（Neon Serverless）
│
├── lib/
│   ├── auth/index.ts             # NextAuth 配置
│   ├── auth/passwordUtils.ts     # bcrypt 哈希/验证
│   ├── trpc/client.ts            # tRPC 客户端
│   ├── trpc/Provider.tsx         # tRPC React Provider
│   ├── email/                    # 邮件服务 + 模板
│   ├── settings/defaults.ts      # 默认设置值
│   ├── constants/searchEngines.ts # 搜索引擎配置
│   ├── favicon.ts                # Favicon 工具
│   └── gsap/config.ts            # GSAP 配置
│
├── types/                        # TypeScript 类型
│   ├── settings.ts               # 设置类型（主题/背景/配色/引擎等）
│   ├── bookmark.ts               # 书签类型
│   ├── next-auth.d.ts            # NextAuth Session 扩展
│   └── ...
│
└── middleware.ts                  # CORS 中间件（API 路由专用）
```

## 架构分层

```
┌─────────────────────────────────────────────┐
│                  前端层                       │
│  App Router 页面 + React 组件 + Context 状态  │
│  Tailwind CSS + GSAP 动画 + dnd-kit 拖拽     │
├─────────────────────────────────────────────┤
│                  API 层                       │
│  tRPC Routers (user/bookmark/account/settings)│
│  NextAuth (Credentials + JWT)                │
│  CORS Middleware                              │
├─────────────────────────────────────────────┤
│                 数据层                        │
│  Drizzle ORM + PostgreSQL (Neon Serverless)  │
│  三张表: users / bookmarks / settings        │
└─────────────────────────────────────────────┘
```

## 数据库 Schema

```
users
├── id          UUID (PK)
├── name        text
├── email       text (unique)
├── password    text (bcrypt)
└── created_at  timestamp

bookmarks
├── id          UUID (PK)
├── user_id     UUID (FK → users.id, CASCADE)
├── client_id   text (本地 ID，如 'bm-{timestamp}')
├── title       text
├── url         text
├── position    integer (排序用)
├── created_at  timestamp
└── updated_at  timestamp

settings
├── id                UUID (PK)
├── user_id           UUID (FK → users.id, CASCADE, unique)
├── theme             text (默认 'light')
├── background_effect text (默认 'blob')
├── clock_format      text (默认 '24h')
├── enable_blur       boolean (默认 false)
├── color_scheme      text (默认 'orange')
├── default_engine    text (默认 'google')
├── open_in_new_tab   boolean (默认 true)
├── show_title        boolean (默认 true)
└── updated_at        timestamp
```

每个用户最多一条 settings 记录（`user_id` 有 unique 约束），通过 upsert 操作保存。

## 认证流程

### Web 端

1. 用户通过 `/auth` 页面注册或登录
2. NextAuth Credentials Provider 验证邮箱 + 密码（bcrypt）
3. 签发 JWT token（30 天有效期）
4. 前端通过 `useSession()` 获取会话，`AuthContext` 封装用户状态

### 浏览器扩展

1. 扩展调用 `/api/auth/extension-login`，传入邮箱 + 密码
2. 服务端验证后使用 `jose` 签发 JWT token（30 天有效期）
3. 扩展在后续请求中携带 `Authorization: Bearer <token>`
4. tRPC 端点从 Bearer token 中解析用户身份

### CORS 策略

中间件 (`middleware.ts`) 仅匹配 `/api/:path*`，允许以下来源：
- `chrome-extension://*`（Chrome 扩展）
- `http://localhost`（本地开发）
- `https://navir.icu`（生产环境）

## 状态管理

### Provider 嵌套顺序

```tsx
<SessionProvider>        // NextAuth 会话
  <TRPCProvider>         // tRPC 客户端 + React Query
    <SettingsProvider>   // 用户设置（主题、外观等）
      <BookmarkProvider> // 书签数据 + 同步逻辑
        <AuthProvider>   // 认证状态封装
          {children}
        </AuthProvider>
      </BookmarkProvider>
    </SettingsProvider>
  </TRPCProvider>
</SessionProvider>
```

### 数据同步策略

**书签同步**：
- 未登录：数据仅存 localStorage
- 登录时：将本地书签批量上传到云端（`syncAll`），之后双向同步
- 操作优先写本地状态，异步同步到云端

**设置同步**：
- `useLayoutEffect` 立即应用主题/配色到 DOM，避免闪烁
- 设置变更同时写入 localStorage 和云端
- 首次加载优先从 localStorage 读取，再用云端数据覆盖

## 功能模块

### 书签管理
- 增删改查 + 拖拽排序（dnd-kit）
- 右键（桌面）或点击（移动端）打开书签面板
- Favicon 自动获取

### 搜索
- 9 种搜索引擎：Google, Bing, Bing 中国, Baidu, GitHub, Zhihu, Bilibili, DuckDuckGo, Yandex
- 引擎切换器 + 新标签页打开选项

### 外观定制
- 主题：明亮 / 暗黑 / 跟随系统
- 背景效果：blob / blob-scatter / wave / layered-peaks / layered-steps / world-map / none
- 配色方案：12 种（orange, blue, green, purple, pink, red, cyan, yellow, indigo, teal, amber, slate）
- 时钟格式：12h / 24h
- 模糊效果开关

### 邮件
- 注册成功后异步发送欢迎邮件（Resend）
- React Email 模板
