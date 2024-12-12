import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { ProductVariant } from '../product-variant';
import { Purchase } from './purchase.model';

@DefaultScope(() => ({
  attributes: { include: ['createdAt', 'updatedAt'] },
}))
@Table({
  timestamps: true,
  tableName: 'purchase_items',
})
export class PurchaseItem extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Purchase)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  purchaseId: string;

  @ForeignKey(() => ProductVariant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  variantId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  unitCost: number;

  @BelongsTo(() => Purchase)
  purchase: Purchase;

  @BelongsTo(() => ProductVariant)
  variant: ProductVariant;
}
