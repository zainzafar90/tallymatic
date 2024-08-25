import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { Category } from '../category/category.model';
import { Product } from '../product/product.model';

@Table({
  timestamps: true,
  tableName: 'product_categories',
})
export class ProductCategory extends Model {
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

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  categoryId: string;

  @BelongsTo(() => Category)
  category: Category;
}
