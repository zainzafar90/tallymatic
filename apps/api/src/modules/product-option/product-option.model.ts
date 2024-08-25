import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Status } from '@shared';

import { Product } from '../product/product.model';

@Table({
  timestamps: true,
  tableName: 'product_options',
})
export class ProductOption extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  priceModifier: number;

  @Column({
    type: DataType.ENUM({ values: Object.values(Status) }),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  status: Status;
}
