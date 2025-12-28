import { pgTable, text, timestamp, integer, uuid, boolean } from 'drizzle-orm/pg-core';

//用户表
export const users = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})

//书签表
export const bookmarks = pgTable("bookmarks", {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    clientId: text('client_id').notNull(),  // 保持与本地 ID 一致 (如 'bm-{timestamp}')
    title: text('title').notNull(),
    url: text('url').notNull(),
    position: integer('position').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})

//用户设置表
export const settings = pgTable("settings", {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
    // 外观设置
    theme: text('theme').notNull().default('light'),
    backgroundEffect: text('background_effect').notNull().default('blob'),
    clockFormat: text('clock_format').notNull().default('24h'),
    enableBlur: boolean('enable_blur').notNull().default(false),
    colorScheme: text('color_scheme').notNull().default('orange'),
    // 搜索设置
    defaultEngine: text('default_engine').notNull().default('google'),
    openInNewTab: boolean('open_in_new_tab').notNull().default(true),
    // 书签设置
    showTitle: boolean('show_title').notNull().default(true),
    // 时间戳
    updatedAt: timestamp('updated_at').defaultNow(),
})
