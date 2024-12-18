import { relations } from 'drizzle-orm';
import { customType, foreignKey, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { TransactionType } from '@shared';

import { variants } from './variant.schema';

const EnumTransactionType = customType<{
  data: TransactionType;
}>({
  dataType: () => 'text',
});

export const inventory = pgTable(
  'inventory',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    variantId: uuid('variant_id')
      .notNull()
      .references(() => variants.id),
    quantity: integer('quantity').notNull(),
    type: EnumTransactionType('type').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    fk_variant: foreignKey({
      columns: [table.variantId],
      foreignColumns: [variants.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  })
);

export type Inventory = typeof inventory.$inferSelect;
export type InventoryInsert = typeof inventory.$inferInsert;

export const inventoryRelations = relations(inventory, ({ one }) => ({
  variant: one(variants, {
    fields: [inventory.variantId],
    references: [variants.id],
  }),
}));
