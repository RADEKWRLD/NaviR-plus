# NaviR+

个性化浏览器主页，支持书签管理、搜索引擎切换、外观定制和多设备同步。

## 功能特性

- **书签管理** - 增删改查 + 拖拽排序，登录后云端同步
- **搜索引擎** - 9 种引擎可选（Google、Bing、Baidu、GitHub、DuckDuckGo 等）
- **外观定制** - 7 种动态背景、12 种配色、明暗主题、时钟格式
- **用户认证** - 邮箱密码注册登录，JWT 会话
- **浏览器扩展** - Chrome 扩展支持，新标签页替换
- **响应式设计** - 桌面端和移动端适配

## 技术栈

Next.js 16 / React 19 / TypeScript / PostgreSQL (Neon) / Drizzle ORM / tRPC / NextAuth 5 / Tailwind CSS 4 / GSAP

## 快速开始

### 环境要求

- Node.js 20+
- PostgreSQL 数据库（推荐 [Neon](https://neon.tech)）

### 安装

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
```

在 `.env.local` 中填写：

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-key
RESEND_API_KEY=re_xxx
EMAIL_FROM="NaviR <noreply@navir.icu>"
```

### 数据库初始化

```bash
# 推送 schema 到数据库
npm run db:push

# 或使用迁移
npm run db:generate
npm run db:migrate
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看。

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | ESLint 检查 |
| `npm run db:generate` | 生成数据库迁移 |
| `npm run db:migrate` | 执行数据库迁移 |
| `npm run db:push` | 推送 schema 到数据库 |
| `npm run db:studio` | 打开 Drizzle Studio |
| `npm run email:dev` | 邮件模板开发预览 |
| `npm run ext:install` | 安装扩展依赖 |
| `npm run ext:dev` | 扩展开发模式 |
| `npm run ext:build` | 构建扩展 |

## 项目结构

```
src/
├── app/              # 页面和 API 路由
├── components/       # React 组件
├── context/          # React Context（Auth/Bookmark/Settings）
├── server/trpc/      # tRPC 后端路由
├── db/               # 数据库 Schema 和连接
├── lib/              # 工具库（认证/邮件/设置/tRPC）
├── types/            # TypeScript 类型定义
└── middleware.ts      # CORS 中间件
```

详细架构说明见 [ARCH.md](ARCH.md)。

## 部署

推荐使用 [Vercel](https://vercel.com) 部署，确保配置以下环境变量：

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`
