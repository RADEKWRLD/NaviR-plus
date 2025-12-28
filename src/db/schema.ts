import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';

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
