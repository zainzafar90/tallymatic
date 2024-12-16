import { relations } from 'drizzle-orm';
import { boolean, customType, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { RoleType } from '@shared';

import { organizations } from './organization.schema';
import { tokens } from './token.schema';

const EnumRoleType = customType<{
  data: RoleType;
}>({
  dataType: () => 'text',
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  contact: varchar('contact', { length: 255 }),
  role: EnumRoleType('role').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  tokens: many(tokens),
}));
