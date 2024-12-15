import { customType, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { Status } from '@shared';

const OrganizationStatus = customType<{
  data: Status;
}>({
  dataType: () => 'text',
});

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  status: OrganizationStatus('status').notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type OrganizationInsert = typeof organizations.$inferInsert;
