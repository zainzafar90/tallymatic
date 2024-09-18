import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Status } from '@shared';

import { ClaimItem } from '../claim/claim-item.model';
import { Inventory } from '../inventory/inventory.model';
import { Product } from '../product/product.model';

@Table({
  timestamps: true,
  tableName: 'variants',
})
export class ProductVariant extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  productId: string;

  @BelongsTo(() => Product)
  product: Product;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  sku: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  price: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  costPrice: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stock: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  lowStockThreshold: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  reorderPoint: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  reorderQuantity: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(Status),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  status: Status;

  @HasMany(() => Inventory)
  inventories: Inventory[];

  @HasMany(() => ClaimItem)
  claimItems: ClaimItem[];
}
