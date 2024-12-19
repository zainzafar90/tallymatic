import { relations } from 'drizzle-orm';
import { customType, foreignKey, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { ProductStatus } from '@repo/shared';

import { categories } from './category.schema';
import { organizations } from './organization.schema';
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
  },
  (table) => ({
    fk_organization: foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
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
}));
