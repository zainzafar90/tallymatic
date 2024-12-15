import { relations } from 'drizzle-orm';
import { boolean, customType, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { TokenType } from '@shared';

import { users } from './user.schema';

const EnumTokenType = customType<{
  data: TokenType;
}>({
  dataType: () => 'text',
});

export const tokens = pgTable('tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  token: text('token').notNull(),
  type: EnumTokenType('type').notNull(),
  blacklisted: boolean('blacklisted').notNull().default(false),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));
