import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { Product } from '../product/product.model';

export enum ProductVariantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  timestamps: true,
  tableName: 'product_variants',
})
export class ProductVariant extends Model {
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
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  sku: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.ENUM(...Object.values(ProductVariantStatus)),
    allowNull: false,
    defaultValue: ProductVariantStatus.ACTIVE,
  })
  status: ProductVariantStatus;
}
