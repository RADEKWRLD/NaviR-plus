import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
//用户表
export const users=pgTable("users",{
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})
