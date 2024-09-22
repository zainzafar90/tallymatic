import { BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, Table } from 'sequelize-typescript';
import { TransactionType } from '@shared';

import { ProductVariant } from '../product-variant';

@DefaultScope(() => ({
  attributes: { include: ['createdAt', 'updatedAt'] },
}))
@Table({
  timestamps: true,
  tableName: 'inventories',
})
export class Inventory extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => ProductVariant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  variantId: string;

  @BelongsTo(() => ProductVariant)
  variant: ProductVariant;

  @Column({
    type: DataType.ENUM({ values: Object.values(TransactionType) }),
    allowNull: false,
  })
  type: TransactionType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;
}
