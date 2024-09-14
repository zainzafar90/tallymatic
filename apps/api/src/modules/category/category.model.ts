import { BelongsTo, Column, DataType, ForeignKey, HasMany, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Status } from '@shared';

import { Product } from '../product';

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
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  parentCategoryId: string | null;

  @BelongsTo(() => Category, 'parentCategoryId')
  parentCategory: Category;

  @HasMany(() => Category, 'parentCategoryId')
  childCategories: Category[];

  @Column({
    type: DataType.ENUM({ values: Object.values(Status) }),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  status: Status;

  @HasMany(() => Product)
  products: Product[];
}
