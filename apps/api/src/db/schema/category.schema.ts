import { relations } from 'drizzle-orm';
import { customType, index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { Status } from '@repo/shared';

import { organizations } from './organization.schema';
import { products } from './product.schema';
import { stores } from './store.schema';

const EnumStatus = customType<{
  data: Status;
}>({
  dataType: () => 'text',
});

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    storeId: uuid('store_id')
      .notNull()
      .references(() => stores.id),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    status: EnumStatus('status').notNull().default(Status.ACTIVE),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    organizationIdIdx: index('idx_categories_organization_id').on(table.organizationId),
    nameIdx: index('idx_categories_name').on(table.name),
    organizationNameIdx: index('idx_categories_organization_id_name').on(table.organizationId, table.name),
    storeIdIdx: index('idx_categories_store_id').on(table.storeId),
    storeNameIdx: index('idx_categories_store_id_name').on(table.storeId, table.name),
  })
);

export type Category = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [categories.organizationId],
    references: [organizations.id],
  }),
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
  products: many(products),
}));
