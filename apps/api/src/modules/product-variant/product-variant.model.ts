import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Status } from '@shared';

import { Product } from '../product/product.model';

@Table({
  timestamps: true,
  tableName: 'variants',
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
    type: DataType.NUMBER,
    allowNull: false,
    defaultValue: 0,
  })
  stock: number;

  @Column({
    type: DataType.ENUM({ values: Object.values(Status) }),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  status: Status;
}
