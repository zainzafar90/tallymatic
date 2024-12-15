import { relations } from 'drizzle-orm';
import { customType, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { Status } from '@shared';

import { stores } from './store.schema';
import { users } from './user.schema';

const EnumStatus = customType<{
  data: Status;
}>({
  dataType: () => 'text',
});
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 255 }),
  website: varchar('website', { length: 255 }),
  address: varchar('address', { length: 255 }),
  status: EnumStatus('status').notNull().default(Status.ACTIVE),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type Organization = typeof organizations.$inferSelect;

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  stores: many(stores),
}));
