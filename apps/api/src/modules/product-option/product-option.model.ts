import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { Product } from '../product/product.model';

export enum ProductOptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

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
    type: DataType.ENUM(...Object.values(ProductOptionStatus)),
    allowNull: false,
    defaultValue: ProductOptionStatus.ACTIVE,
  })
  status: ProductOptionStatus;
}
