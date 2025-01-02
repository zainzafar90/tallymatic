import { relations } from 'drizzle-orm';
import { customType, foreignKey, index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { ProductStatus } from '@repo/shared';

import { categories } from './category.schema';
import { organizations } from './organization.schema';
import { stores } from './store.schema';
import { variants } from './variant.schema';

const EnumProductStatus = customType<{
  data: ProductStatus;
}>({
  dataType: () => 'text',
});

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    categoryId: uuid('category_id').references(() => categories.id),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    status: EnumProductStatus('status').notNull().default(ProductStatus.ACTIVE),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
    storeId: uuid('store_id')
      .notNull()
      .references(() => stores.id),
  },
  (table) => ({
    fk_organization: foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    organizationIdIdx: index('idx_products_organization_id').on(table.organizationId),
    nameIdx: index('idx_products_name').on(table.name),
    categoryIdIdx: index('idx_products_category_id').on(table.categoryId),
    organizationNameIdx: index('idx_products_organization_id_name').on(table.organizationId, table.name),
    storeIdIdx: index('idx_products_store_id').on(table.storeId),
    storeNameIdx: index('idx_products_store_id_name').on(table.storeId, table.name),
  })
);

export type Product = typeof products.$inferSelect;

export const productsRelations = relations(products, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [products.organizationId],
    references: [organizations.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(variants),
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
}));
