import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Product } from '../product';
import { ProductCategory } from '../product-category';

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  timestamps: true,
  tableName: 'categories',
})
export class Category extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

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

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  parentCategoryId: string | null;

  @BelongsTo(() => Category, 'parentCategoryId')
  parentCategory: Category;

  @HasMany(() => Category, 'parentCategoryId')
  childCategories: Category[];

  @Column({
    type: DataType.ENUM(...Object.values(CategoryStatus)),
    allowNull: false,
    defaultValue: CategoryStatus.ACTIVE,
  })
  status: CategoryStatus;

  @BelongsToMany(() => Product, () => ProductCategory)
  products: Product[];
}
